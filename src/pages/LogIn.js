import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useEffect, useRef} from "react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";

function LogIn() {
    const {user, login} = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/", {replace: true});
        }
    }, [user])

    const emailRef = useRef("")
    const passwordRef = useRef("")

    const onClick = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("http://localhost:8080/sessions/log-in", {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            })
            login(response.data)
        } catch (e) {
            console.log(e.response.status)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" ref={emailRef}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={passwordRef}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out"/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={onClick}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default LogIn;