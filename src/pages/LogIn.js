import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useEffect, useRef} from "react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {useToasts} from "react-bootstrap-toasts";

function LogIn() {
    const {user, login} = useAuth()
    const navigate = useNavigate();
    const toasts = useToasts();
    const emailRef = useRef("")
    const passwordRef = useRef("")

    useEffect(() => {
        if (user) {
            navigate("/", {replace: true});
        }
    }, [user])

    const onClick = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("http://localhost:8080/sessions/log-in", {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            })
            login(response.data)
        } catch (e) {
            const status = e?.response?.status

            let content = "There's something wrong."
            switch (status) {
                case 400: {
                    content = e?.response?.data?.message ?? "Invalid request."
                    break;
                }
                case 401: {
                    content = "Email or password is incorrect."
                }
            }
            toasts.danger({
                headerContent: "Failed",
                bodyContent: content,
                toastProps: {
                    autohide: true,
                    delay: 3000,
                },
            })
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
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

                <Button variant="primary" type="submit" onClick={onClick}>
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default LogIn;