import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./CssFiles/ChatPage.css"
import "./CssFiles/Theme.css"

const ChatPage = () => {
    const [error, setError] = useState('');

    const [data, setData] = useState([]);

    const { Myid, id } = useParams();

    const [Response, setResponse] = useState(['string1', 'string2', 'string3']);

    const [Chats, setChats] = useState([]);

    

    const handleSend = (event) => {
        event.preventDefault();
        // Get the input element by ID
        const inputElement = document.getElementById('chat');

        // Read the value from the input element
        const inputValue = inputElement.value;

        console.log("inputValue=" + inputValue)

        axios.put('http://localhost:5000/Message/' + Myid + '/' + id, {
            data: {
                Message: inputValue,
                MessageDate: new Date(),
                SenderID: Myid
            }
        })
            .then(res => {
                if (res.data.status === "Success") {
                    console.log('Success')
                    console.log(res.data.chat);
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
        axios.get('http://localhost:5000/GetMessages/' + Myid + '/' + id)
            .then((res) => {
                if (res.data.status === 'Success') {
                    console.log('Success at GetMessages')
                    setResponse(res.data.chat.Messages);
                    console.log('Messages=' + res.data.chat);
                    console.log(typeof res.data.chat);
                }
            })
            .catch(err => console.log('Failed'));
    }, []);


    return (
        <div className="chatBoxWrapper">
            <div className="chatBoxTop">
                {Response.map((obj, index) => {
                    console.log('obj=' + JSON.stringify(obj));
                    console.log('')
                    return (
                        <div className={`${obj.SenderID == Myid ? 'message-own' : 'message-other'}`} key={index}>
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
                <button className="btn-design btn-bgc col text-white" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default ChatPage;