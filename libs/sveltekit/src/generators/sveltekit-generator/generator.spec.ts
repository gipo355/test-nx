import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { sveltekitGeneratorGenerator } from './generator';
import { SveltekitGeneratorGeneratorSchema } from './schema';

describe('sveltekit-generator generator', () => {
  let tree: Tree;
  const options: SveltekitGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await sveltekitGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
