import React from 'react';

export type ComponentProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function Component({ text }: ComponentProps) {
  return (
    <div>
      {text}
    </div>
  );
}
