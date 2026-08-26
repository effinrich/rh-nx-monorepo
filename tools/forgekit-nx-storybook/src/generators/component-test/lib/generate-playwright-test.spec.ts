import { ComponentAnalysis } from '../../../utils/types';
import { generatePlaywrightTest } from './generate-playwright-test';

describe('generatePlaywrightTest', () => {
  const baseAnalysis: ComponentAnalysis = {
    name: 'Button',
    fileName: 'button',
    filePath: 'libs/shared/ui/src/lib/button/button.tsx',
    props: [
      { name: 'label', type: 'string', required: true, isCallback: false },
      { name: 'onClick', type: '() => void', required: false, isCallback: true },
    ],
    hasChildren: false,
    imports: [],
    usesRouter: false,
    usesReactQuery: false,
    usesChakra: false,
    exportType: 'named',
  };

  it('should generate basic playwright test structure', () => {
    const result = generatePlaywrightTest({
      analysis: baseAnalysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain("from '@playwright/experimental-ct-react'");
    expect(result).toContain("from '@axe-core/playwright'");
    expect(result).toContain("import { Button } from './button'");
    expect(result).toContain("test.describe('Button'");
    expect(result).toContain('mounts and renders without crashing');
    expect(result).toContain('matches visual snapshot');
    expect(result).toContain('meets accessibility standards');
  });

  it('should generate click interaction test when onClick prop exists', () => {
    const result = generatePlaywrightTest({
      analysis: baseAnalysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain('handles click interaction');
    expect(result).toContain('clicked = true');
    expect(result).toContain('component.click()');
  });

  it('should generate variant screenshot tests', () => {
    const analysis: ComponentAnalysis = {
      ...baseAnalysis,
      props: [
        ...baseAnalysis.props,
        {
          name: 'variant',
          type: "'solid' | 'outline'",
          required: false,
          isCallback: false,
          unionValues: ['solid', 'outline'],
        },
      ],
    };

    const result = generatePlaywrightTest({
      analysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain('variant variants');
    expect(result).toContain('variant="solid" matches snapshot');
    expect(result).toContain('variant="outline" matches snapshot');
    expect(result).toContain('button-variant-solid.png');
  });

  it('should generate disabled state test', () => {
    const analysis: ComponentAnalysis = {
      ...baseAnalysis,
      props: [
        ...baseAnalysis.props,
        { name: 'disabled', type: 'boolean', required: false, isCallback: false },
      ],
    };

    const result = generatePlaywrightTest({
      analysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain('renders disabled state correctly');
    expect(result).toContain('disabled={true}');
    expect(result).toContain('button-disabled.png');
  });

  it('should not generate disabled state test for legacy isDisabled prop', () => {
    const analysis: ComponentAnalysis = {
      ...baseAnalysis,
      props: [
        ...baseAnalysis.props,
        { name: 'isDisabled', type: 'boolean', required: false, isCallback: false },
      ],
    };

    const result = generatePlaywrightTest({
      analysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).not.toContain('renders disabled state correctly');
    expect(result).not.toContain('isDisabled={true}');
    expect(result).not.toContain('button-disabled.png');
  });

  it('should include story-driven tests when stories exist', () => {
    const result = generatePlaywrightTest({
      analysis: baseAnalysis,
      importPath: './button',
      hasStories: true,
      storyImportPath: './button.stories',
    });

    expect(result).toContain("import * as stories from './button.stories'");
    expect(result).toContain('story-driven tests');
    expect(result).toContain('renders Default story');
  });

  it('should handle default export components', () => {
    const analysis: ComponentAnalysis = {
      ...baseAnalysis,
      exportType: 'default',
    };

    const result = generatePlaywrightTest({
      analysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain("import Button from './button'");
  });

  it('should include children content when component has children', () => {
    const analysis: ComponentAnalysis = {
      ...baseAnalysis,
      hasChildren: true,
      props: [
        ...baseAnalysis.props,
        { name: 'children', type: 'React.ReactNode', required: false, isCallback: false },
      ],
    };

    const result = generatePlaywrightTest({
      analysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain('Button content');
  });

  it('should generate axe-core a11y test', () => {
    const result = generatePlaywrightTest({
      analysis: baseAnalysis,
      importPath: './button',
      hasStories: false,
    });

    expect(result).toContain('AxeBuilder');
    expect(result).toContain('a11yResults.violations');
    expect(result).toContain('toEqual([])');
  });
});
