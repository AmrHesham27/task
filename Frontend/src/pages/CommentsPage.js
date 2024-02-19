import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

function CommentsPage() {
    const navigate = useNavigate();

    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // for edit/delete comment
    const [comments, setComments] = useState([]);
    const [commentId, setCommentId] = useState()

    const [comment, setComment] = useState('');
    const [name, setName] = useState('');

    // for loading more comments
    const [currentCommentsCount, setCurrentCommentsCount] = useState(15);
    const [loading, setLoading] = useState(false);

    const editComment = (id, name, comment) => {
        setCommentId(id)
        setName(name)
        setComment(comment)
        handleShow()
    };

    const handleEditComment = async () => {
        try {
            await axios.put(process.env.REACT_APP_BACKEND_URL + `/comments/${commentId}`, {
                id: commentId,
                name,
                comment
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });

            const newComments = comments
            newComments.map(c => {
                if (c.id == commentId) {
                    c.name = name
                    c.comment = comment
                }
                return c
            });
            setComments(newComments)

            setName('')
            setComment('')
            handleClose()
        }
        catch (error) {
            console.log(error)
        }

    }

    const handleDeleteComment = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_BACKEND_URL + `/comments/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            setComments(prevComments => prevComments.filter(c => c.id != id))
        }
        catch (error) {
            console.log(error)
        }

    }

    const getComments = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + `/comments`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            setComments(response.data['data'])
        }
        catch (error) {
            console.log(error)
        }
    };

    const getMoreComments = async () => {
        try {
            setLoading(true)
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + `/comments/getMoreComments`, {
                current_comments_count: currentCommentsCount
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            setCurrentCommentsCount(prevCommentsCount => prevCommentsCount + 15)
            setComments(prevComments => [...prevComments, ...response.data.data]);
            setLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }

    const addComment = async (event) => {
        try {
            event.preventDefault();
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/comments", { name, comment }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setComments([response.data['data'], ...comments])
        }
        catch (error) {
            console.log(error)
        }

    }

    const logout = async () => {
        await axios.post(process.env.REACT_APP_BACKEND_URL + "/logout", {}, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        navigate("/login")
    }

    useEffect(() => {
        getComments()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 100 && !loading) {
                getMoreComments();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    return (
        <>
            <Navbar bg="light" expand="lg" className='mx-2 px-2 '>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Button variant="outline-danger" onClick={logout}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="card mx-2 px-2 my-2 py-2">
                <div className="comment-form-container">
                    <form id="comment-form" onSubmit={e => addComment(e)}>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input onChange={(e) => setName(e.target.value)} type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment:</label>
                            <textarea onChange={(e) => setComment(e.target.value)} id="comment" name="comment" required></textarea>
                        </div>
                        <button style={{ maxWidth: "200px" }} type="submit">Post Comment</button>
                    </form>
                </div>

                <div id="comments-container">
                    {
                        comments.map((comment, index) => {
                            return <div className="comment" key={index}>
                                <div className="comment-name">{comment.name}</div>
                                <div className="comment-text">{comment.comment}</div>
                                {localStorage.getItem("user_id") == comment.user_id && <div>
                                    <button className='edit' onClick={() => editComment(comment.id, comment.name, comment.comment)}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button className='delete' onClick={() => handleDeleteComment(comment.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>}
                            </div>
                        })
                    }
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="comment-form-container">
                            <form id="comment-form" onSubmit={e => handleEditComment(e)}>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" id="name" name="name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="comment">Comment:</label>
                                    <textarea onChange={(e) => setComment(e.target.value)} value={comment} id="comment" name="comment" required></textarea>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button onClick={e => handleEditComment(e)} variant="primary">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default CommentsPage;