import { execSync } from 'child_process';
import { join } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import { cyan } from 'chalk';

type BitMapComponent = {
  nextVersion: Record<'message', string>;
};
type BitMap = Record<string, BitMapComponent>;

// TODO: make this regex more robust
const replaceScopeAndSemver = (name: string): string => name.replace(/^.+?\/(.+?)@.+$/, '$1');

export function verifySoftTag() {
  const output = execSync('bit status --json', { cwd: process.cwd() });
  const { newComponents, softTaggedComponents, modifiedComponent } = JSON.parse(
    output.toString(),
  );

  // enforce that new components have a version and message
  const newComponentNames = newComponents.map(({ name }) => replaceScopeAndSemver(name));

  // enforce that non-new modified components have a version and message
  const modifiedComponentNames = modifiedComponent.map(replaceScopeAndSemver);
  const softTaggedComponentNames = softTaggedComponents.map(replaceScopeAndSemver);

  const fp = join(process.cwd(), '.bitmap');
  const content = readFileSync(fp, 'utf8');
  const bitmap = parse(content) as BitMap;

  return Object.entries(bitmap).reduce((list, [key, value]) => {
    const message = value?.nextVersion?.message;
    const isMessageMissing = typeof message !== 'string' || message.length === 0;

    if (isMessageMissing) {
      if (softTaggedComponentNames.includes(key)) {
        list.push(
          `a --message is required for the --soft tagged component ${cyan(key)}`,
        );
      } else if (newComponentNames.includes(key)) {
        list.push(
          `add a --soft tag with --message for new component ${cyan(key)}`,
        );
      } else if (modifiedComponentNames.includes(key)) {
        list.push(
          `add a --soft tag with --message for modified component ${cyan(key)}`,
        );
      }
    }

    return list;
  }, []);
}
