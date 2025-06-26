import React from "react";
import { Link } from "react-router-dom";
import { DataProvider } from "./state/DataContext";
import AppRoutes from "./routes/AppRoutes";
export default function App() {
  return (
    <DataProvider>
      <nav style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Items</Link>
      </nav>
      <AppRoutes />
    </DataProvider>
  );
}
