import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {useToasts} from "react-bootstrap-toasts";

function SignUp() {
    const {user, login} = useAuth()
    const navigate = useNavigate();
    const toasts = useToasts();
    const nameRef = useRef("")
    const emailRef = useRef("")
    const passwordRef = useRef("")

    useEffect(() => {
        if (user) {
            navigate("/", {replace: true});
        }
    }, [user])

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            await axios.post("http://localhost:8080/users/sign-up", {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
            })

            setTimeout(() => {
                navigate("/login", {replace: true})
            }, 1);

            toasts.info({
                headerContent: "Success",
                bodyContent: "User is successfully created.",
                toastProps: {
                    autohide: true,
                    delay: 3000,
                },
            })
        } catch (e) {
            const status = e?.response?.status

            let content = "There's something wrong."
            switch (status) {
                case 400: {
                    content = e?.response?.data?.message ?? "Invalid request."
                    break;
                }
                case 409: {
                    content = "Email is already taken."
                    break;
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
        <>
            <Container className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" ref={nameRef}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={emailRef}/>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" ref={passwordRef}/>
                        <Form.Text id="passwordHelpBlock" muted>
                            Your password must be 8-20 characters long, contain letters and numbers,
                            and must not contain spaces, special characters, or emoji.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Re-enter password" ref={passwordRef}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </>
    )
}

export default SignUp;