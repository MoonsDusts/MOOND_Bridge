import React from "react";

import Header from "./header";
import useThemeMode from "../hooks/useThemeMode";
import { THEME } from "../types";

type LayoutType = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutType> = ({ children }) => {
  const { mode } = useThemeMode();

  return (
    <main
      className={`w-full min-h-screen bg-[0_-30vh] transition-all ${
        mode === THEME.DARK ? "bg-back-dark bg-[#2c2f36]" : "bg-back-light"
      }`}
    >
      <Header />
      {children}
    </main>
  );
};

export default Layout;
