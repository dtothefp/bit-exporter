import { execSync } from 'child_process';
import path from 'path';
import { readFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import { cyan } from 'chalk';

export function verifySoftTag() {
  const output = execSync('bit status --json', { cwd: process.cwd() });
  const { newComponents, softTaggedComponents, modifiedComponent } = JSON.parse(output.toString());

  // enforce that new components have a version and message
  const newComponentNames = newComponents.map(({ name }) => name);

  // enforce that non-new modified components have a version and message
  const modifiedComponentNames = modifiedComponent.map((component) => component.replace(/^.+?\/(.+?)@.+$/, '$1'));

  const fp = path.join(process.cwd(), '.bitmap');
  const content = readFileSync(fp, 'utf8');
  const bitmap = parse(content);

  return Object.entries(bitmap).reduce((list, [key, value]) => {
    const message = value?.nextVersion?.message;
    const isMessageMissing = typeof message !== 'string' || message.length === 0;

    if (isMessageMissing) {
      if (softTaggedComponents.includes(key)) {
        list.push(`a --message is required for the --soft tagged component ${cyan(key)}`);
      } else if (newComponentNames.includes(key)) {
        list.push(`add a --soft tag with --message for new component ${cyan(key)}`);
      } else if (modifiedComponentNames.includes(key)) {
        list.push(`add a --soft tag with --message for modified component ${cyan(key)}`);
      }
    }

    return list;
  }, []);
}
