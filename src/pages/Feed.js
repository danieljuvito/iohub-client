import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useEffect, useRef, useState} from "react";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import {useAuth} from "../hooks/useAuth";
import {useToasts} from "react-bootstrap-toasts";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import {useNavigate} from "react-router-dom";

const Feed = () => {
    const navigate = useNavigate()
    const {user, logout} = useAuth();
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const contentRef = useRef()
    const toasts = useToasts();
    const [storyCount, setStoryCount] = useState(0)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const hasRunInit = useRef(false)

    const reset = () => {
        setItems([])
        setPage(1)
        setHasMore(true)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSave = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/stories`, {
                content: contentRef.current.value,
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setTimeout(() => {
                setShow(false)
                setStoryCount(count => count + 1)
            }, 1);

            toasts.info({
                headerContent: "Success",
                bodyContent: "Story successfully created.",
                toastProps: {
                    autohide: true,
                    delay: 3000,
                },
            })
        } catch (e) {

        }
    }

    const fetchData = async (page) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/feed?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.data.length === 0) {
                setHasMore(false)
                setIsEmpty(true)
            } else {
                setPage(page + 1)
                setIsEmpty(false)
            }

            setItems(prevItems => [...prevItems, ...response.data]);
        } catch (error) {

        } finally {

        }
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/stories`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }).then((response) => {
            setStoryCount(response.data.length)
        }).catch((e) => {
        })
    }, [storyCount])

    useEffect(() => {
        if (!hasRunInit.current) {
            fetchData(1).then()
        }
        return () => {
            hasRunInit.current = true
        }
    }, []);

    const handleFollow = (index) => async (event) => {
        const item = items[index]

        let action
        if (item.is_followed) {
            action = "unfollow"
        } else {
            action = "follow"
        }

        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/users/${action}/${item.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
        } catch (e) {

        }

        setItems(items => {
            const newItems = [...items];
            const item = newItems[index]

            newItems[index] = {
                ...item,
                is_followed: !item.is_followed
            }
            return newItems
        })
    }

    const handleRefresh = async () => {
        reset()
        await fetchData(1)
    }

    const handleViewStory = (userId) => () => {
        navigate(`/stories/${userId}`, {replace: true})
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control type="text" as="textarea" placeholder="Write your story here." ref={contentRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Story
                    </Button>
                </Modal.Footer>
            </Modal>
            <Card className="mb-2">
                <Card.Body className='d-flex justify-content-between'>
                    <Stack direction="horizontal" gap={2}>
                        <Badge bg={storyCount === 0 ? "primary" : "danger"}>{storyCount}</Badge>
                        Your Stories
                    </Stack>
                    <Button onClick={handleShow}>Create Story +</Button>
                </Card.Body>
            </Card>
            <InfiniteScroll
                dataLength={items.length} //This is important field to render the next data
                next={async () => {
                    await fetchData(page)
                }}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{textAlign: 'center'}}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                // below props only if you need pull down functionality
                refreshFunction={handleRefresh}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                    <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                    <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
                }
            >
                {items.map((item, index) => (
                        <Card key={`${item.Name} ${index}`} className="mb-2">
                            <Card.Body className='d-flex justify-content-between'>
                                <Stack direction="horizontal" gap={2}>
                                    <Badge bg={item.story_count === 0 ? "primary" : "danger"}>{item.story_count}</Badge>
                                    {item.name}
                                </Stack>
                                <Button onClick={handleViewStory(item.user_id)}>View Story</Button>
                                <Button
                                    onClick={handleFollow(index)}
                                    variant={item.is_followed ? "white" : "primary"}
                                >
                                    {item.is_followed ? "Unfollow" : "Follow"}
                                </Button>
                            </Card.Body>
                        </Card>
                    )
                )}
            </InfiniteScroll>
        </>
    )
};

export default Feed;