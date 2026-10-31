import { Link, NavLink } from "react-router";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
export const logoSrc = asset("logo.png");

export function Wordmark() {
  return (
    <>
      abim<span>i</span>sme
    </>
  );
}

export function AppBar() {
  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link className="brand" to="/">
          <img src={logoSrc} alt="" width="34" height="29" />
          <b>
            <Wordmark />
          </b>
        </Link>
        <ThemeToggle />
        <nav className="nav" aria-label="Utama">
          <NavLink to="/kitab">Kitab</NavLink>
          <NavLink to="/kisah">Kisah</NavLink>
          <NavLink to="/kata-bapak">Kutipan</NavLink>
          <NavLink to="/tebak">Tebak</NavLink>
          <NavLink to="/acak" title="Bait acak" aria-label="Bait acak">
            <Icon name="dice" />
            <span className="wide">Acak</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
