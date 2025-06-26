import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemsPage from '../pages/ItemsPage';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]),
  })
);

describe('ItemsPage', () => {
  beforeEach(() => fetch.mockClear());

  test('renders loading and then list', async () => {
    render(
      <BrowserRouter>
        <ItemsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading items…');
    await waitFor(() => screen.getByText('Item 1'));
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('search updates query', async () => {
    render(
      <BrowserRouter>
        <ItemsPage />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText('Search…');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');
  });
}); 