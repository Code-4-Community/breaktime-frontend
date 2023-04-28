import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { routes } from '../../utils';

function NavBar() {
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="/"><img src="https://static.wixstatic.com/media/1193ef_371853f9145b445fb883f16ed7741b60~mv2.jpg/v1/crop/x_0,y_2,w_1842,h_332/fill/w_233,h_42,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Breaktime%20Logo%20Comfortaa-2.jpg" alt="Breaktime" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              {routes.map(
                (dropDownItem, index) =>
                (
                  <NavDropdown.Item key={index} href={dropDownItem.link}>
                    {dropDownItem.title}
                  </NavDropdown.Item>
                )
              )}
            </NavDropdown>
            <Nav.Link href="/logout">Sign Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;