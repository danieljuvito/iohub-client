import {Outlet} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from "react-router-bootstrap"
import Navbar from 'react-bootstrap/Navbar';
import Container from "react-bootstrap/Container";
import {useAuth} from "../hooks/useAuth";

const Header = () => {
    const {user} = useAuth()
    return (
        <div>
            <Navbar>
                <Container>
                    <Navbar.Brand href="#home"><h1>IOHub</h1></Navbar.Brand>
                    {user
                        ? <Nav variant="pills">
                            <Nav.Item>
                                <LinkContainer to="/">
                                    <Nav.Link>Feed</Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                            <Nav.Item>
                                <LinkContainer to="/search">
                                    <Nav.Link>Search</Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                            <Nav.Item>
                                <LinkContainer to="/profile">
                                    <Nav.Link>Profile</Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                        </Nav>
                        : <Nav variant="pills">
                            <Nav.Item>
                                <LinkContainer to="/login">
                                    <Nav.Link>Log In</Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                            <Nav.Item>
                                <LinkContainer to="/signup">
                                    <Nav.Link>Sign Up</Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                        </Nav>}
                </Container>
            </Navbar>

            <Outlet/>
        </div>
    )
};

export default Header;