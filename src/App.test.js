import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders app', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Basic smoke test - just verify the app renders without crashing
  expect(document.body).toBeInTheDocument();
});
