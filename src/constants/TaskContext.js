import React, { createContext, useState, useContext } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [todayTaskCount, setTodayTaskCount] = useState(0);

  return (
    <TaskContext.Provider value={{ todayTaskCount, setTodayTaskCount }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
