import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import { FiEdit2 } from 'react-icons/fi'; // pencil icon
import { MdCameraAlt } from 'react-icons/md'; // camera icon
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Eye icons for show/hide password
import { useParams } from 'react-router-dom';


import './Profile.css';

function EmployeeProfile() {
  const [imageKey, setImageKey] = useState(Date.now());
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const [data, setData] = useState({
        id:'',
        fname: '',
        lname: '',
        email: '',
        password: '',
        salary: '',
        address: '',
        image: ''
        })
        let { id } = useParams();
	const [editable, setEditable] = useState({
    email: false,
    phone: false,
    address: false,
    password: false,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const handleEditClick = (field) => {
    setEditable({ ...editable, [field]: !editable[field] });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const localImageUrl = URL.createObjectURL(file);
  
    // Set local URL of selected image immediately
    setData((prevData) => ({ ...prevData, image: localImageUrl }));
    setSelectedFile(file); // Store the selected file in state
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append('fname', data.fname);
      formData.append('lname', data.lname);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('salary', data.salary);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('image', selectedFile);
  
      try {
        const response = await axios.post('http://localhost:5000/updateEmployee/'+id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.Status === 'Success') {
          console.log('Successfully updated data');
          // Update the data state with the updated manager info
          setData(response.data.Result);
          setEditable({ email: false, phone: false, address: false, password: false }); // Close all fields
        }
      } catch (error) {
        console.log('Failed to update data:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/updateEmployee/'+id, {
          _id: data._id,  
         fname: data.fname,
          lname: data.lname,
          email: data.email,
          password: data.password,
          address: data.address,
          salary:data.salary,
          phone: data.phone,
        });
  
        if (response.data.Status === 'Success') {
          console.log('Successfully updated data');
          // Update the data state with the updated manager info
          setData(response.data.Result);
          setEditable({ email: false, phone: false, address: false, password: false }); // Close all fields
        }
      } catch (error) {
        console.log('Failed to update data:', error);
      }
    }
  };
  useEffect(() => {
    axios.get('http://localhost:5000/getInfo/'+id)
    .then((res) => {
          if (res.data.Status === 'Success') {
            setData(res.data.Result);
          }
        })
        .catch((err) => console.log('Failed to fetch data'));
    }, [editable.email, editable.phone, editable.address, editable.password]);
  




      return (
        <div className="gradient-custom-2" style={{ backgroundColor: '#3333' }}>
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="10" xl="15">
                <MDBCard style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div
                    className="rounded-top text-white d-flex flex-row"
                    style={{ backgroundColor: '#000', height: '200px' }}
                  >
                          <div className="ms-4 mt-5 position-relative" style={{ width: '150px' }}>
                  <img
                    key={imageKey}
                    src={data.image.includes("blob:") ? data.image : `http://localhost:5000/images/` + data.image}
                    alt="Generic placeholder image"
                    className="mt-2 mb-2 img-thumbnail"
                    fluid
                    style={{ width: '160px', zIndex: '1', height: '120px' }}
                  />
                  <MdCameraAlt className="camera-icon" onClick={handleImageClick} />
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
                </div>
                    <div className="ms-3" style={{ marginTop: '100px' }}>
                    <MDBTypography tag="h3">{data && data.fname + ' ' + data.lname}</MDBTypography>

                    </div>
                  </div>
                  <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex justify-content-end text-center py-1"></div>
                  </div>
                  <MDBCardBody className="text-black p-4">
                    <div className="mb-6">
                      <MDBCard className="mb-5">
                        <MDBCardBody>
                          <form onSubmit={handleFormSubmit}>
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>First Name</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                <div>{data.fname}</div>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>Last Name</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                <div>{data.lname}</div>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>Salary</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                <div>{data.salary}</div>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>Email</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                {editable.email ? (
                                  <>
                                    <input
                                      type="text"
                                      name="email"
                                      value={data.email}
                                      onChange={handleInputChange}
                                    />
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('email')} />
                                  </>
                                ) : (
                                  <>
                                    <div>{data.email}</div>
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('email')} />
                                  </>
                                )}
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>Phone</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                {editable.phone ? (
                                  <>
                                    <input
                                      type="text"
                                      name="phone"
                                      value={data.phone}
                                      onChange={handleInputChange}
                                    />
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('phone')} />
                                  </>
                                ) : (
                                  <>
                                    <div>{data.phone}</div>
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('phone')} />
                                  </>
                                )}
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>Address</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                {editable.address ? (
                                  <>
                                    <input
                                      type="text"
                                      name="address"
                                      value={data.address}
                                      onChange={handleInputChange}
                                    />
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('address')} />
                                  </>
                                ) : (
                                  <>
                                    <div>{data.address}</div>
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('address')} />
                                  </>
                                )}
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            <MDBRow>
                              <MDBCol sm="3">
                                <MDBCardText>Password</MDBCardText>
                              </MDBCol>
                              <MDBCol sm="9" className="d-flex align-items-center">
                                {editable.password ? (
                                  <>
                                    <input
                                      type={showPassword ? "text" : "password"}  // Dynamically change type based on the state
                                      name="password"
                                      value={data.password}
                                      onChange={handleInputChange}
                                    />
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('password')} />
                                    {showPassword ? 
                                      <FiEyeOff onClick={() => setShowPassword(!showPassword)} /> :  // if password is visible, display the "eye-off" icon
                                      <FiEye onClick={() => setShowPassword(!showPassword)} />  // if password is hidden, display the "eye" icon
                                    }
                                  </>
                                ) : (
                                  <>
                                    <div>{showPassword ? data.password : '*'.repeat(data.password.length)}</div>
                                    <FiEdit2 className="edit-icon" onClick={() => handleEditClick('password')} />
                                  </>
                                )}
                              </MDBCol>
                            </MDBRow>
                            <hr />
    
                            <button type="submit">Save</button>
                          </form>
                        </MDBCardBody>
                      </MDBCard>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-4"></div>
                    <MDBRow></MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      );
    }

export default EmployeeProfile
