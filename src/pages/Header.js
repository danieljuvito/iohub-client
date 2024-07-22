import {Outlet} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import {LinkContainer} from "react-router-bootstrap"

const Header = () => {
    return (
        <div>
            <Nav variant="pills" defaultActiveKey="#first">
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
                    <LinkContainer to="/secret">
                        <Nav.Link>Secret</Nav.Link>
                    </LinkContainer>
                </Nav.Item>
            </Nav>

            <Outlet/>
        </div>
    )
};

export default Header;