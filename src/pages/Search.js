import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useEffect, useRef, useState} from "react";
import Container from 'react-bootstrap/Container'
import {useAuth} from "../hooks/useAuth";
import axios from "axios";

const Search = () => {
    const {user, logout} = useAuth();
    const searchRef = useRef()
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)

    const reset = () => {
        setItems([])
        setPage(1)
        setHasMore(true)
    }

    const fetchData = async (page) => {
        const search = searchRef?.current?.value

        if (search === "") {
            return
        }

        try {
            const response = await axios.get(`http://localhost:8080/users?search=${search}&page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.data.length === 0) {
                setHasMore(false)
                setIsEmpty(true)
            } else {
                setPage(page + 1)
            }

            setItems(prevItems => [...prevItems, ...response.data]);
        } catch (error) {

        } finally {

        }
    };

    const handleClick = (index) => async (event) => {
        const item = items[index]

        let action
        if (item.is_followed) {
            action = "unfollow"
        } else {
            action = "follow"
        }

        try {
            await axios.patch(`http://localhost:8080/users/${action}/${item.id}`, {}, {
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

    const handleSearch = async () => {
        reset()
        await fetchData(1)
    }

    return (
        <>
            <Container className="mb-2 d-flex">
                <Form.Control type="text" placeholder="Input name to search users" ref={searchRef}/>
                <Button className="ms-2" onClick={handleSearch}>Search</Button>
            </Container>

            {items.length > 0
                ? <InfiniteScroll
                    dataLength={items.length} //This is important field to render the next data
                    next={async () => {
                        await fetchData(page)
                    }}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <h4 style={{textAlign: 'center'}}>Yay! You have seen it all.</h4>
                    }
                    // below props only if you need pull down functionality
                    refreshFunction={handleSearch}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h4 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h4>
                    }
                    releaseToRefreshContent={
                        <h4 style={{textAlign: 'center'}}>&#8593; Release to refresh</h4>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    {items.map((item, index) => (
                            <Card key={`${item.Name} ${index}`} className="mb-2">
                                <Card.Body className='d-flex justify-content-between'>
                                    {item.name}
                                    <Button
                                        onClick={handleClick(index)}
                                        variant={item.is_followed ? "white" : "primary"}
                                    >
                                        {item.is_followed ? "Unfollow" : "Follow"}
                                    </Button>
                                </Card.Body>
                            </Card>
                        )
                    )}
                </InfiniteScroll>
                : isEmpty
                    ? <h4 style={{textAlign: 'center'}}>Empty search result.</h4>
                    : <></>
            }
        </>
    )
};

export default Search;