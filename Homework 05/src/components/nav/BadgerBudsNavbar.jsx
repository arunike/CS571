
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import crest from '../../assets/uw-crest.svg'

export default function BadgerBudsNavbar(props) {
    return <Navbar bg="dark" variant="dark" sticky="top" expand="sm" collapseOnSelect>
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand as={Link} to="/">
                <img
                    alt="Badger Buddies Logo"
                    src={crest}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Badger Buddies!
            </Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav" className="me-auto">
                <Nav>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/available-cats">Available Cats</Nav.Link>
                    <Nav.Link as={Link} to="/basket">My Basket</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
}
