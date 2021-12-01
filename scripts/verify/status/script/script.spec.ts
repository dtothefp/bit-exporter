import { script } from './script';

it('should return the correct value', () => {
  expect(script().toString()).toBeTruthy();
});
