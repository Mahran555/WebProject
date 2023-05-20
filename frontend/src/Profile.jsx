import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import "../src/Theme.css"

function Profile() {
  const [data, setData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    image: ''
    })
  useEffect(()=> {
    axios.get('http://localhost:5000/getManager')
    .then((res) => {
      if(res.data.Status === "Success") {
        setData({...data, 
          fname: res.data.Result.fname,
          lname:res.data.Result.lname,
          email: res.data.Result.email,
          password: res.data.Result.password,
          phone: res.data.Result.phone,
          address:res.data.Result.address,
          image: res.data.Result.image   
      })
      }
    })
    .catch(err => console.log("faild"));
  })
  return(
<div className="gradient-custom-2" style={{ backgroundColor: 'white' }}>
  <MDBContainer className="py-5 h-100">
    <MDBRow className="justify-content-center align-items-center h-100">
      <MDBCol lg="10" xl="15">
      <MDBCard style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#8E9B90', height: '200px' }}>
            <div className="ms-4 mt-5 position-relative" style={{ width: '150px' }}>
              <img src={`http://localhost:5000/images/`+data.image} 
                alt="Generic placeholder image" className="mt-2 mb-2 img-thumbnail" fluid style={{ width: '160px', zIndex: '1',height:'120px' }} />
                <MDBBtn outline className="position-absolute bottom-0" style={{height: '40px', overflow: 'visible', zIndex: '2',borderColor:'#93C0A4', backgroundColor: '#93C0A4',color:'whitesmoke' ,marginLeft:'10px',marginTop:'10px'}}>
                  Edit
                </MDBBtn>
            </div>
            <div className="ms-3" style={{ marginTop: '100px' }}>
              <MDBTypography tag="h3">{data.fname + " " + data.lname}</MDBTypography>
              
            </div>
          </div>
          <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex justify-content-end text-center py-1">
            </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-6">
                <MDBCard className="mb-5">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>First Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.fname}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Last Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.lname}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.phone}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Address</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{data.address}</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                </div>
                <MDBRow>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  )
}
//to be cont
export default Profile