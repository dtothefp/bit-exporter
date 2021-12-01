import React from 'react';
import { script } from './script';

export function ReturnsCorrectValue() {
  return <div>{script()}</div>;
}
