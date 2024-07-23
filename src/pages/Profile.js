import {useAuth} from "../hooks/useAuth";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import {useToasts} from "react-bootstrap-toasts";
import {useEffect, useState} from "react";

export const Profile = () => {
    const {user, logout} = useAuth();
    const toasts = useToasts();
    const [name, setName] = useState()
    const [email, setEmail] = useState()

    useEffect(() => {
        axios.get("http://localhost:8080/users/identity", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }).then((response) => {
            setName(response.data.name)
            setEmail(response.data.email)
        }).catch((e) => {
            console.log(e)
            const status = e?.response?.status

            let content = "There's something wrong."
            switch (status) {
                case 400: {
                    content = e?.response?.data?.message ?? "Invalid request."
                    break;
                }
                case 401: {
                    content = "Unauthorized"
                    setTimeout(() => {
                        logout();
                    }, 1);
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
        })
    }, [name, email]);

    const handleLogout = async () => {
            try {
                await axios.delete("http://localhost:8080/sessions/log-out", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })

                setTimeout(() => {
                    logout();
                }, 1);

                toasts.info({
                    headerContent: "Success",
                    bodyContent: "Successfully logged out.",
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
    ;

    return (
        <>
            <ListGroup className="mb-3">
                <ListGroup.Item>Name: {name}</ListGroup.Item>
                <ListGroup.Item>Email: {email}</ListGroup.Item>
            </ListGroup>
            <Button variant="primary" onClick={handleLogout}>
                Log Out
            </Button>
        </>
    )
        ;
};