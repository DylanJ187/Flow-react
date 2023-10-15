import React, { useState, useEffect } from "react";
import SaveContext from "./savecontext";
import { useNavigate, useLocation } from "react-router-dom";
const SaveProvider = ({ children }) => {
  const [shouldSave, setShouldSave] = useState(false);

  const requestSave = () => {
    setShouldSave(true);
  };

  useEffect(() => {
    window.addEventListener("focus", requestSave);
    window.addEventListener("blur", requestSave);
    window.addEventListener("beforeunload", requestSave);

    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(requestSave, 15000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    resetTimer(); // initialize the timer for the first time

    return () => {
      window.removeEventListener("focus", requestSave);
      window.removeEventListener("blur", requestSave);
      window.removeEventListener("beforeunload", requestSave);
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, []);

  useLocation(); // Use useLocation directly here without useEffect

  return (
    <SaveContext.Provider value={{ shouldSave, setShouldSave }}>
      {children}
    </SaveContext.Provider>
  );
};

export default SaveProvider;
