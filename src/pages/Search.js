import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useEffect, useState} from "react";

const Search = () => {
    const [items, setItems] = useState([]);

    const fetchData = async () => {
        try {
//            const response = await fetch(`https://api.example.com/items?page=${page}`);
//            const data = await response.json();

            const data = Array(10).fill(0).map((_, i) => {
                return {
                    name: `User ${i}`,
                    isFollowed: (Math.random() * 2) | 0,
                }
            })

            setItems(prevItems => [...prevItems, ...data]);
        } catch (error) {

        } finally {

        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    const onClick = (index) => (event) => {
        setItems(items => {
            const newItems = [...items];
            const item = newItems[index]

            newItems[index] = {
                ...item,
                isFollowed: !item.isFollowed
            }
            return newItems
        })
    }

    return (
        <>
            <Form.Control className="mb-2" type="text" placeholder="Input name to search users"/>
            <InfiniteScroll
                dataLength={items.length} //This is important field to render the next data
                next={() => {
                    setItems(items => items.concat(
                            ...Array(10).fill(0).map((_, i) => {
                                return {
                                    name: `User ${i}`,
                                    isFollowed: (Math.random() * 2) | 0,
                                }
                            })
                        )
                    )
                }}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{textAlign: 'center'}}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                // below props only if you need pull down functionality
                refreshFunction={() => {
                }}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                    <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                    <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
                }
                scrollableTarget="scrollableDiv"
            >
                {items.map((item, index) => (
                        <Card key={`${item.Name} ${index}`} className="mb-2">
                            <Card.Body className='d-flex justify-content-between'>
                                {item.name}
                                <Button
                                    onClick={onClick(index)}
                                    variant={item.isFollowed ? "white" : "primary"}
                                >
                                    {item.isFollowed ? "Unfollow" : "Follow"}
                                </Button>
                            </Card.Body>
                        </Card>
                    )
                )}
            </InfiniteScroll>
        </>
    )
};

export default Search;