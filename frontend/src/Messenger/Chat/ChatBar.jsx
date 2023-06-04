import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./ChatBar.css"
import "../../CssFiles/Theme.css"

const ChatBar = ({ SenderId, RecieverId }) => {
    const [error, setError] = useState('');

    const [data, setData] = useState([]);


    const [Response, setResponse] = useState(['string1', 'string2', 'string3']);

    const [Chats, setChats] = useState([]);


    console.log('********** i did re-render *************** SenderId = ' + SenderId + ' RecieverId = ' + RecieverId)
    const handleSend = (event) => {
        event.preventDefault();
        // Get the input element by ID
        const inputElement = document.getElementById('chat');

        // Read the value from the input element
        const inputValue = inputElement.value;

        console.log("inputValue=" + inputValue)

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
                }
                else {
                    setError(res.data.error);
                }
            })
            .catch(err => console.log(err));
    }

    // request the messages between both the employees
    // request to get the Chats that are available between my employee id and another employee
    useEffect(() => {
        axios.get('http://localhost:5000/GetMessages/' + SenderId + '/' + RecieverId)
            .then((res) => {
                if (res.data.status === 'Success') {
                    console.log('im at client get messages')
                    console.log('SenderId = ' + SenderId + ' RecieverId = ' + RecieverId)
                    console.log('res.data.chat.Messages=' + res.data.chat.Messages)
                    setResponse(res.data.chat.Messages);

                }
            })
            .catch(err => {
                console.log('Failed')
                setResponse([])
            });
    }, [RecieverId]);



    return (
        <div className="chatBoxWrapper">
            <div className="chatBoxTop">
                {Response.map((obj, index) => {
                    console.log('obj=' + JSON.stringify(obj));
                    console.log('')
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
            <div className="row w-100 d-flex">
                <input type="text" className="col-10 input-design ms-3" id="chat" placeholder="chat" />
                <button className="btn btn-bgc text-white col btn-send" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default ChatBar;