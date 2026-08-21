import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { analyzeComponent } from './analyze-component';

describe('analyzeComponent', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should return null for non-existent files', () => {
    const result = analyzeComponent(tree, 'libs/ui/src/lib/foo.tsx');
    expect(result).toBeNull();
  });

  it('should extract named export component', () => {
    tree.write(
      'libs/ui/src/lib/button/button.tsx',
      `
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  disabled?: boolean;
}

export const Button = ({ label, onClick, variant, disabled }: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
`
    );

    const result = analyzeComponent(tree, 'libs/ui/src/lib/button/button.tsx');

    expect(result).not.toBeNull();
    expect(result!.name).toBe('Button');
    expect(result!.exportType).toBe('named');
    expect(result!.props).toHaveLength(4);

    const labelProp = result!.props.find((p) => p.name === 'label');
    expect(labelProp).toBeDefined();
    expect(labelProp!.required).toBe(true);
    expect(labelProp!.type).toBe('string');

    const onClickProp = result!.props.find((p) => p.name === 'onClick');
    expect(onClickProp).toBeDefined();
    expect(onClickProp!.required).toBe(false);
    expect(onClickProp!.isCallback).toBe(true);

    const variantProp = result!.props.find((p) => p.name === 'variant');
    expect(variantProp).toBeDefined();
    expect(variantProp!.unionValues).toEqual(['solid', 'outline', 'ghost']);
  });

  it('should extract default export component', () => {
    tree.write(
      'libs/ui/src/lib/card/card.tsx',
      `
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return <div><h2>{title}</h2>{children}</div>;
}
`
    );

    const result = analyzeComponent(tree, 'libs/ui/src/lib/card/card.tsx');

    expect(result).not.toBeNull();
    expect(result!.name).toBe('Card');
    expect(result!.exportType).toBe('default');
    expect(result!.hasChildren).toBe(true);
  });

  it('should detect router usage', () => {
    tree.write(
      'libs/ui/src/lib/nav/nav.tsx',
      `
import React from 'react';
import { Link } from 'react-router-dom';

export const Nav = () => <Link to="/">Home</Link>;
`
    );

    const result = analyzeComponent(tree, 'libs/ui/src/lib/nav/nav.tsx');

    expect(result).not.toBeNull();
    expect(result!.usesRouter).toBe(true);
  });

  it('should detect Chakra UI usage', () => {
    tree.write(
      'libs/ui/src/lib/badge/badge.tsx',
      `
import { Badge as ChakraBadge } from '@chakra-ui/react';

export const Badge = () => <ChakraBadge>New</ChakraBadge>;
`
    );

    const result = analyzeComponent(tree, 'libs/ui/src/lib/badge/badge.tsx');

    expect(result).not.toBeNull();
    expect(result!.usesChakra).toBe(true);
  });

  it('should detect React Query usage', () => {
    tree.write(
      'libs/ui/src/lib/data-list/data-list.tsx',
      `
import { useQuery } from '@tanstack/react-query';

export const DataList = () => {
  const { data } = useQuery({ queryKey: ['items'], queryFn: fetchItems });
  return <ul>{data?.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
};
`
    );

    const result = analyzeComponent(
      tree,
      'libs/ui/src/lib/data-list/data-list.tsx'
    );

    expect(result).not.toBeNull();
    expect(result!.usesReactQuery).toBe(true);
  });

  it('should handle components with no props', () => {
    tree.write(
      'libs/ui/src/lib/logo/logo.tsx',
      `
import React from 'react';

export const Logo = () => <img src="/logo.svg" alt="Logo" />;
`
    );

    const result = analyzeComponent(tree, 'libs/ui/src/lib/logo/logo.tsx');

    expect(result).not.toBeNull();
    expect(result!.name).toBe('Logo');
    expect(result!.props).toHaveLength(0);
    expect(result!.hasChildren).toBe(false);
  });

  it('should detect callback props starting with "on"', () => {
    tree.write(
      'libs/ui/src/lib/form/form.tsx',
      `
import React from 'react';

interface FormProps {
  onSubmit: (data: unknown) => void;
  onChange?: (value: string) => void;
}

export const Form = ({ onSubmit, onChange }: FormProps) => <form />;
`
    );

    const result = analyzeComponent(tree, 'libs/ui/src/lib/form/form.tsx');
    const onSubmit = result!.props.find((p) => p.name === 'onSubmit');
    const onChange = result!.props.find((p) => p.name === 'onChange');

    expect(onSubmit!.isCallback).toBe(true);
    expect(onSubmit!.required).toBe(true);
    expect(onChange!.isCallback).toBe(true);
    expect(onChange!.required).toBe(false);
  });
});
