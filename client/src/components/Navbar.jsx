import logo from "../assets/images/Logo 1.png"
import "../assets/css/Navbar.css";
import { Link } from "react-router-dom";

function Navbar({ onLogoClick }) {
  return (
    <nav>
      <Link to="/" onClick={onLogoClick}>
        <img src={logo} alt="AnimeHUB" className="Logo"/>
      </Link>
      <h2 className="h2Navbar">Benvenuti su AnimeHUB</h2>
    </nav>
  );
}

export default Navbar;
