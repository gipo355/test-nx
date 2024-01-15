import { readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { myGeneratorGenerator } from './generator';
import { MyGeneratorGeneratorSchema } from './schema';

describe('my-generator generator', () => {
  let tree: Tree;
  const options: MyGeneratorGeneratorSchema = {
    name: 'test',
    directory: 'my-plugin',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await myGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
