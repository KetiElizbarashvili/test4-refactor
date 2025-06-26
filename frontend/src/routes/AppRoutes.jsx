import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ItemsPage from '../pages/ItemsPage';
import ItemDetailPage from '../pages/ItemDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ItemsPage />} />
      <Route path="/items/:id" element={<ItemDetailPage />} />
    </Routes>
  );
}
 