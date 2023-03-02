import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar() {
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="#home">Breaktime</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
			<NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="/timecard">
				TimeSheets
				</NavDropdown.Item>
              <NavDropdown.Item href="">
                Search
              </NavDropdown.Item>
              <NavDropdown.Item href="/">
				Home
			  </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="">Sign Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;