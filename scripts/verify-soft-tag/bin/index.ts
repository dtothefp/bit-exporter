#!/usr/bin/env node

import { bgRed } from 'chalk';
import { verifySoftTag } from '..';

const errors = verifySoftTag();

errors.forEach((error) => {
  // eslint-disable-next-line no-console
  console.log(`${bgRed('Error:')} ${error}`);
});

if (errors.length === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
