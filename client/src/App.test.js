import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');
jest.mock('./Barcode', () => () => null);

test('renders the app title and patient tabs', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  expect(screen.getByRole('heading', { name: 'Aiuto Medicine' })).toBeInTheDocument();
  expect(await screen.findByRole('tab', { name: /Alberto/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /Dina/i })).toBeInTheDocument();
});
