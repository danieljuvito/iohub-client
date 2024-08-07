import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useAuth} from "../hooks/useAuth";
import ProgressBar from 'react-bootstrap/ProgressBar'
import Container from "react-bootstrap/Container";
import {useToasts} from "react-bootstrap-toasts";
import {motion, useScroll} from "framer-motion"

const Stories = () => {
    const navigate = useNavigate()
    const {user, logout} = useAuth()
    const [story, setStory] = useState()
    const {id} = useParams()
    const [progress, setProgress] = useState(0)
    const toasts = useToasts();
    const [stories, setStories] = useState()
    const [index, setIndex] = useState(undefined)

    useEffect(() => {
        if (story !== undefined) {
            if (progress === 100) {
                setStory(undefined)
                setIndex(index => index + 1)
            } else {
                const interval = setInterval(() => {
                    setProgress(progress => progress + 1)
                }, 1)

                return () => clearInterval(interval)
            }
        }
    }, [story, progress])

    useEffect(() => {
        if (index !== undefined) {
            const story_id = stories[index]?.story_id
            if (story_id === undefined) {
                navigate("/", {replace: true})
                return
            }

            axios.get(`${process.env.REACT_APP_API_URL}/stories/${story_id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }).then((response) => {
                setStory(response.data)
                setProgress(0)
            })
        }
    }, [index])

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/stories?user_id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })

                setStories(response.data)
                setIndex(0)
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
            <motion.div style={{width: progress + "%", background: "red", height: "5px"}}></motion.div>
            {story
                ? <>
                    {/*<ProgressBar now={progress} min={0} max={100}/>*/}
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