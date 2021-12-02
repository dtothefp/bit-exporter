import React from 'react';
import { verifySoftTag } from './verify-soft-tag';

export function ReturnsCorrectValue() {
  return <div>{verifySoftTag()}</div>;
}
