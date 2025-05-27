import logo from "../assets/images/Logo 1.png"
import "../assets/css/Navbar.css";
function Navbar() {
  return (
    <nav>
      <img src={logo} alt="AnimeHUB" className="Logo"/>
      <h2 className="h2Navbar">Benvenuti su AnimeHUB</h2>
    </nav>
  );
}

export default Navbar;
