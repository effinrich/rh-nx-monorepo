import { ComponentAnalysis } from '../../../utils/types';

import { generateInteractionTests } from './generate-interaction-tests';

function makeAnalysis(overrides: Partial<ComponentAnalysis> = {}): ComponentAnalysis {
  return {
    name: 'TestComponent',
    fileName: 'test-component',
    filePath: 'libs/shared/ui/src/lib/test-component/test-component.tsx',
    props: [],
    hasChildren: false,
    imports: [],
    usesRouter: false,
    usesReactQuery: false,
    usesChakra: false,
    exportType: 'named',
    ...overrides,
  };
}

describe('generateInteractionTests', () => {
  it('should always generate a RendersCorrectly test', () => {
    const lines = generateInteractionTests(makeAnalysis());
    const content = lines.join('\n');

    expect(content).toContain('export const RendersCorrectly: Story');
    expect(content).toContain('play: async ({ canvasElement })');
    expect(content).toContain('canvasElement.firstChild');
  });

  it('should check for text content in RendersCorrectly when hasChildren', () => {
    const lines = generateInteractionTests(makeAnalysis({ hasChildren: true }));
    const content = lines.join('\n');

    expect(content).toContain("children: 'Test content'");
    expect(content).toContain("canvas.getByText('Test content')");
    expect(content).toContain('toBeInTheDocument()');
  });

  it('should generate ClickInteraction test for onClick handler', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'onClick', type: '() => void', required: false, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).toContain('export const ClickInteraction: Story');
    expect(content).toContain('onClick: fn()');
    expect(content).toContain('userEvent.click(element)');
    expect(content).toContain('args.onClick');
    expect(content).toContain('toHaveBeenCalledTimes(1)');
  });

  it('should generate submit-specific test for onSubmit handler', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'onSubmit', type: '(data: unknown) => void', required: true, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).toContain('export const ClickInteraction: Story');
    expect(content).toContain("canvas.getByRole('button', { name: /submit/i })");
    expect(content).toContain('args.onSubmit');
  });

  it('should generate close-specific test for onClose handler', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'onClose', type: '() => void', required: false, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).toContain("canvas.getByRole('button', { name: /close/i })");
    expect(content).toContain('args.onClose');
  });

  it('should generate KeyboardNavigation test when click handlers exist', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'onClick', type: '() => void', required: false, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).toContain('export const KeyboardNavigation: Story');
    expect(content).toContain('userEvent.tab()');
    expect(content).toContain('toHaveFocus()');
    expect(content).toContain("userEvent.keyboard('{Enter}')");
    expect(content).toContain('args.onClick');
  });

  it('should not generate ClickInteraction or KeyboardNavigation for non-interactive components', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'label', type: 'string', required: true, isCallback: false },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).not.toContain('ClickInteraction');
    expect(content).not.toContain('KeyboardNavigation');
    // Should still have RendersCorrectly
    expect(content).toContain('RendersCorrectly');
  });

  it('should generate KeyboardNavigation for toggle props', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'checked', type: 'boolean', required: false, isCallback: false },
          { name: 'onClick', type: '() => void', required: false, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).toContain('KeyboardNavigation');
  });

  it('should handle onPress same as onClick', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'onPress', type: '() => void', required: false, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    expect(content).toContain('export const ClickInteraction: Story');
    expect(content).toContain('onPress: fn()');
    expect(content).toContain('args.onPress');
  });

  it('should not generate click tests for non-click callbacks like onChange', () => {
    const lines = generateInteractionTests(
      makeAnalysis({
        props: [
          { name: 'onChange', type: '(value: string) => void', required: false, isCallback: true },
        ],
      })
    );
    const content = lines.join('\n');

    // onChange alone doesn't trigger ClickInteraction
    expect(content).not.toContain('ClickInteraction');
    expect(content).toContain('RendersCorrectly');
  });
});
