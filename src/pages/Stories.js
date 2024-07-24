import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth";
import ProgressBar from 'react-bootstrap/ProgressBar'
import Container from "react-bootstrap/Container";
import {useToasts} from "react-bootstrap-toasts";

const Stories = () => {
    const navigate = useNavigate()
    const {user, logout} = useAuth()
    const [story, setStory] = useState()
    const {id} = useParams()
    const [progress, setProgress] = useState(0)
    const toasts = useToasts();

    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(progress => progress + 1)
        }, 50)

        return () => clearInterval(interval)
    })

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/stories?user_id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })

                for (let {story_id} of response.data) {
                    setProgress(0)
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/stories/${story_id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        }
                    })
                    setStory(response.data)
                    await delay(5000)
                }
                navigate("/", {replace: true})
            } catch (e) {
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
            }
        })()
    }, []);

    return (
        <>
            {story
                ? <>
                    <ProgressBar now={progress}/>
                    <Container
                        className="d-flex justify-content-center align-content-center"
                        style={{
                            height: "70vh"
                        }}
                    >
                        <p style={{
                            margin: "auto",
                        }}>{story.content}</p>
                    </Container>
                </>
                : <></>
            }
        </>
    )
}
export default Stories