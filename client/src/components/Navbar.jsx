import logo from "../assets/images/Logo 1.png"
import logoRicerca from "../assets/images/Logo Ricerca.png";
import "../assets/css/Navbar.css";
import { Link } from "react-router-dom";

function Navbar({ onLogoClick }) {
  return (
    <nav>
      <Link to="/" onClick={onLogoClick}>
        <img src={logo} alt="AnimeHUB" className="Logo"/>
      </Link>
      <h2 className="h2Navbar">Benvenuti su AnimeHUB</h2>
      <img src={logoRicerca} alt="Logo Ricerca" className="LogoRicerca" />
    </nav>
  );
}

export default Navbar;
