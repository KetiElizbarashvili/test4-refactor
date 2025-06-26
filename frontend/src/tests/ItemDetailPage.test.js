import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ItemDetailPage from '../pages/ItemDetailPage';

beforeAll(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  fetch.mockClear();
});

describe('ItemDetailPage', () => {
  test('loads and displays item', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1, name: 'Test Item', category: 'X', price: 123 }),
    });

    render(
      <MemoryRouter initialEntries={['/items/1']}>
        <Routes>
          <Route path="/items/:id" element={<ItemDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading item…');
    await waitFor(() => screen.getByText('Test Item'));
    expect(screen.getByText('Category:')).toBeInTheDocument();
  });
});
 