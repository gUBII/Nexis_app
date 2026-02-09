import React, { createContext, useState, useContext } from "react";

const PendingContext = createContext();

export const PendingProvider = ({ children }) => {
   const [pendingTasksCount, setPendingTasksCount] = useState(0);

  return (
    <PendingContext.Provider value={{ pendingTasksCount, setPendingTasksCount }}>
      {children}
    </PendingContext.Provider>
  );
};

export const usePending = () => useContext(PendingContext);
