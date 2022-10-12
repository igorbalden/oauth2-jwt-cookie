import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../../context/authContext";
import { useSpinner } from "../Spinner/Spinner";

export function Navigation(props) {
  const { authObj, dispatch } = useAuth();
  const setSpin = useSpinner(false);

  function logout(e) {
    e.preventDefault();
    setSpin(true);
    setTimeout(() => {
      dispatch({ type: "cleanUser" });
      setSpin(false);
      return true;
    }, 1000);
  }

  return (
    <header>
      <Navbar className="navbar-dark bg-primary" collapseOnSelect  expand="md">
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link eventKey="1" as={Link} to="/">Home</Nav.Link>
            <Nav.Link eventKey="2" as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link eventKey="3" as={Link} to="/preferences">Preferences</Nav.Link>
            {
              (authObj?.user?.userId)
              ?
                <Nav.Link eventKey="4" onClick={logout} as={Link} to="/">
                  Logout
                </Nav.Link>
              :
                <Nav.Link eventKey="4" as={Link} to="/auth/login">Login</Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}