import React from 'react';
import { render } from '@testing-library/react';
import { BasicComponent } from './component.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicComponent />);
  const rendered = getByText('hello from Component');
  expect(rendered).toBeTruthy();
});
