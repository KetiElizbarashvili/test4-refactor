import React, { createContext, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  return (
    <DataContext.Provider value={{}}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
 