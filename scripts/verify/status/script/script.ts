import { execSync } from 'child_process';
import path from 'path';
import { readFileSync } from 'fs';
import { parse } from 'jsonc-parser';

export function script() {
  const output = execSync('bit status --json', { cwd: process.cwd() });
  const { newComponents, softTaggedComponents, modifiedComponent } = JSON.parse(output.toString());

  // enforce that new components have a version and message
  const newComponentNames = newComponents.map(({name}) => name);

  // enforce that non-new modified components have a version and message
  const modifiedComponentNames = modifiedComponent.map((component) => component.replace(/^.+?\/(.+?)@.+$/, '$1'));

  const fp = path.join(process.cwd(), '.bitmap');
  const bitmap = parse(readFileSync(fp, 'utf8'));
  const errors = [];

  for (const [key, value] of Object.entries(bitmap)) {
    const message = value?.nextVersion?.message;
    const hasMessage = typeof message === 'string' && message.length > 0;

    if (hasMessage) continue;

    if (softTaggedComponents.includes(key)) {
      errors.push(`add a --message for the --soft tagged component ${key}`);
    } else if (newComponentNames.includes(key)) {
      errors.push(`add a --soft tag with --message for new component ${key}`);
    } else if (modifiedComponentNames.includes(key)) {
      errors.push(`add a --soft tag with --message for modified component ${key}`);
    }
  }

  return errors;
}
