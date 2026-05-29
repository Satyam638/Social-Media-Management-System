import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>SMMS</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/platforms">Platforms</Link>
      </div>
    </nav>
  );
}

export default Navbar;