import {useAuth} from "../hooks/useAuth";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

export const Profile = () => {
    const {user, logout} = useAuth();

    const handleLogout = async () => {
            try {
                const response = await axios.delete("http://localhost:8080/sessions/log-out", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
                logout();
            } catch
                (e) {
                console.log(e)
            }
        }
    ;

    return (
        <>
            <ListGroup className="mb-3">
                <ListGroup.Item>Name: User Name</ListGroup.Item>
                <ListGroup.Item>Email: user@email.com</ListGroup.Item>
            </ListGroup>
            <Button variant="primary" onClick={handleLogout}>
                Log Out
            </Button>
        </>
    )
        ;
};