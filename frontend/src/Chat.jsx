import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Chat.css"

const ChatComponent = () => {
    //states + variables
    const [ShowChats, setShowChats] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const [data, setData] = useState([]);

    const [error, setError] = useState('');
    const navigate = useNavigate()
    const { id } = useParams();

    const [Chats, setChats] = useState([]);

    const notifications = [
        'afs3 ',
        'afs3 ',
        'afs3 ',
    ];

    var flag = false;

    // request to get the Chats that are available between my employee id and another employee
    useEffect(() => {
        axios.get('http://localhost:5000/GetChats/' + id)
            .then((res) => {
                if (res.data.Status === 'Success') {
                    setChats(res.data.Result);
                    console.log('Chats=' + JSON.stringify(res.data.Result));
                    console.log(typeof res.data.Result);
                    console.log('isArray ' + Array.isArray(res.data.Result))
                }
            })
            .catch(err => console.log('Failed'));
    }, []);

    const handleIconClick = () => {
        setShowChats(!ShowChats);
        console.log('Chats=' + JSON.stringify(Chats))
    };

    // Filter the data based on the search term
    const filteredData = data.filter(employee =>
        employee.fname.toLowerCase().includes(searchTerm.toLowerCase())
    );


    //return
    return (
        <>
            <div>
                <FontAwesomeIcon icon={faComments} onClick={handleIconClick} style={{ cursor: 'pointer' }} />
            </div>
            {ShowChats && (
                <div className="d-flex align-items-start justify-content-start" style={{ position: 'absolute', top: '50px', right: '20px', background: 'white', padding: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                    <div className="myContainer">
                        {Chats.map((Chat, index) => {
                         
                            return (
                                <div className="conversation" key={Chat._id}> {/* Add alignItems: 'flex-start' */}
                                    <img
                                        src={`http://localhost:5000/images/` + Chat.Image.image}
                                        className='conversationImg'
                                        alt='Cinque Terre'
                                    />
                                    <Link className='conversationName' to={"/ChatPage/" + Chat.EmployeeID1 + '/' + Chat.EmployeeID2} style={{ margin: '10px 0',backgroundColor: '#f5f5f5', borderRadius: '4px', padding: '10px', cursor: 'pointer', transition: '.3s', '&:hover': { backgroundColor: '#ddd' }, textDecoration: 'none', color: 'black' }}>
                                        <span key={index} style={{ margin: '10px 0', backgroundColor: '#f5f5f5', borderRadius: '4px', padding: '10px', cursor: 'pointer', transition: '.3s', '&:hover': { backgroundColor: '#ddd' }, textAlign: 'left', marginTop: 0 }}> {/* Add textAlign: 'left', marginTop: 0 */}
                                            {Chat.Messages[Chat.Messages.length - 1].Message}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}

                    </div>
                </div>
            )
            }
        </>
    );
};

export default ChatComponent;