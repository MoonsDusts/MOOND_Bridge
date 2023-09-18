import LogoDark from "../assets/logo-dark.svg";
import LogoLight from "../assets/logo-light.svg";
import ConnectWallet from "../components/ConnectWallet";
import ThemeButton from "../components/ThemeButton";
import useThemeMode from "../hooks/useThemeMode";
import { THEME } from "../types";

const Header = () => {
  const {mode} = useThemeMode()

  return (
    <div className="w-full flex justify-center border-b border-black/10">
      <div className="container flex justify-between items-center p-3">
        <a href={"/"} className="hover:-rotate-[8deg] transition-all">
          <img src={mode === THEME.DARK ? LogoDark : LogoLight} alt="moond" className="w-[50px]" />
        </a>
        <div className="flex items-center space-x-[8px]">
          <ConnectWallet />
          <ThemeButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
