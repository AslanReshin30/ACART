import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import "../CSS/nav.css";

function NavScrollExample() {
  const { cartCount, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const firstLetter = user?.name?.trim()?.charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    clearCart(); // Empty the cart
    logout(); // Log out the user
    navigate("/"); // Redirect to Home
  };

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ACART
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>

            <Nav.Link as={Link} to="/cart">
              Cart
              <span className="badge bg-primary ms-2">{cartCount}</span>
            </Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>

                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            ) : (
              <NavDropdown
                align="end"
                id="profile-dropdown"
                title={<span className="profile-avatar">{firstLetter}</span>}
              >
                <NavDropdown.Item disabled>{user.name}</NavDropdown.Item>

                <NavDropdown.Item disabled>{user.email}</NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
