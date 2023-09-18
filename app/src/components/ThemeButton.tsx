import useThemeMode from "../hooks/useThemeMode";
import SunSVG from "./svg/Sun";
import MoonSVG from "./svg/Moon";
import { THEME } from "../types";

const ThemeButton = () => {
  const { mode, setMode } = useThemeMode();

  const onTheme = () => {
    if (mode === THEME.DARK) document.body.classList.remove("dark");
    else document.body.classList.add("dark");
    setMode(mode === THEME.DARK ? THEME.LIGHT : THEME.DARK);
  };

  return (
    <button
      className="outline-none bg-[#edeef2] dark:bg-[#40444f] text-black dark:text-white p-2 rounded-lg hover:brightness-90 active:brightness-95 transition-all"
      onClick={onTheme}
    >
      {mode === THEME.DARK ? <MoonSVG /> : <SunSVG />}
    </button>
  );
};

export default ThemeButton;
