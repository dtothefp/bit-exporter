#!/usr/bin/env node

const errors = require('..').verifySoftTag();

if (errors.length) {
  console.log(
    errors.join('\n'),
  );

  process.exit(1);
} else {
  process.exit(0);
}
