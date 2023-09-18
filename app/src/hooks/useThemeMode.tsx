import { THEME } from "../types";
import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

const defaultVal: {
  mode: THEME;
  setMode: Dispatch<SetStateAction<THEME>>;
} = {
  mode: THEME.LIGHT,
  setMode: () => {},
};

export const ThemeModeContext = React.createContext(defaultVal);

export default function useThemeMode() {
  return React.useContext(ThemeModeContext);
}

export const ThemeModeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mode, setMode] = useState<THEME>(THEME.DARK);

  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};
