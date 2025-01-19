
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';

test('renders without crashing', async () => {
  render(<App />);
  const linkElement = screen.getByTestId('title');
  expect(document.body).toContainElement(linkElement);
});
