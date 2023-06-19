import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./ChatBar.css"
import "../../CssFiles/Theme.css"

const ChatBar = ({ SenderId, RecieverId }) => {
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [response, setResponse] = useState(['string1', 'string2', 'string3']);
    const chatBoxRef = useRef(null);

    // Handle sending a message
    const handleSend = (event) => {
        event.preventDefault();

        if (inputValue.trim() === '') {
            // Input value is empty or contains only whitespace
            return;
        }

        axios.put('http://localhost:5000/Message/' + SenderId + '/' + RecieverId, {
            data: {
                Message: inputValue,
                MessageDate: new Date(),
                SenderID: SenderId
            }
        })
            .then(res => {
                if (res.data.status === "Success") {
                    setResponse(res.data.chat.Messages);
                    setInputValue(''); // Clear the input value
                    scrollToBottom(); // Scroll to the bottom of the chat after sending a message
                    
                }
                else {
                    setError(res.data.error);
                }
            })
            .catch(err => console.log(err));
    }

    // Request the messages between both the employees
    useEffect(() => {
        axios.get('http://localhost:5000/GetMessages/' + SenderId + '/' + RecieverId)
            .then((res) => {
                if (res.data.status === 'Success') {
                    setResponse(res.data.chat.Messages);
                    scrollToBottom(); // Scroll to the bottom of the chat on initial load
                }
            })
            .catch(err => {
                console.log('Failed')
                setResponse([])
            });
    }, [RecieverId]);

    // Scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom when the chat messages change
    }, [response]);

    return (
        <div className="chatBoxWrapper">
            <div className="chatBoxTop" ref={chatBoxRef}>
                {response.map((obj, index) => {
                    return (
                        <div className={`${obj.SenderID == SenderId ? 'message-own' : 'message-other'}`} key={index}>
                            <div className="messageTop">
                                <p className="messageText">{obj.Message}</p>
                            </div>
                            <div className="messageBottom">{obj.MessageDate}</div>
                        </div>
                    );
                })}
            </div>
            <form className="row w-100 d-flex" onSubmit={handleSend}>
                <input
                    type="text"
                    className="col-10 input-design ms-3 rounded"
                    id="chat"
                    placeholder="chat"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="btn btn-bgc text-white col btn-send" type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatBar;
