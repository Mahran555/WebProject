const express = require('express')
const cors = require('cors')
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const { error } = require('console');
const PORT=process.env.PORT
const JWT_SECRET =process.env.JWT_SECRET

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET", "PUT"],
        credentials: true
    }
));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
  exposedHeaders: ['X-Custom-Header'],
}));

app.use(express.static('public'));
//MiddLeewares
app.use(express.json())
app.use(cors())
// Middleware to parse request bodies
app.use(bodyParser.json());

//Storage Setting
let storage = multer.diskStorage({
  destination:'./public/images', //directory (folder) setting
  filename:(req, file, cb)=>{
      cb(null, Date.now()+file.originalname) // file name setting
  }
})

//Upload Setting
let upload = multer({
 storage: storage,
 fileFilter:(req, file, cb)=>{
  if(
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/gif'

  ){
      cb(null, true)
  }
  else{
      cb(null, false);
      cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
  }
 }
})



db()

const Employee = require("./models/EmployeeDetails");

//Login page
app.post("/login", async (req, res) => {
  const { email, password,userType} = req.body;
  const user = await Employee.findOne({ email });
  if (!user) {
    return res.json({Status: "error", error: "Invalid email or password"  });
  }
  if (user.userType!==userType) {
    return res.json({ Status: "error",error: "Invalid email or password"  });
  }

  if (user.password!==password) {
      return res.status(400).json({Status: "error", error: 'Invalid email or password' });
  }

    return res.json({Status: "Success"});
  
});

const Schedules = require("./models/SaveSchedule");
app.post('/saveSchedule', async (req, res) => {
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    console.log(req.body);
    const { scheduleData, month } = req.body;

    if (!scheduleData) {
      return res.status(400).json({ Status: 'Error', Message: 'Missing scheduleData in request body' });
    }

    // Transform the data into an array of schedules
    const schedules = [];
    Object.entries(scheduleData).forEach(([day, shifts]) => {
      Object.entries(shifts).forEach(([shift, employeeIds]) => {
        employeeIds.forEach(employeeId => {
          schedules.push({
            day: Number(day),
            month: month,
            shift: shift === 'shift1' ? 'morning' : 'evening',
            EmployeeID: Number(employeeId),
            
          });

        });
        
      });
    });

    // Save all schedules
    for (const schedule of schedules) {
      const newSchedule = new Schedules(schedule); 
      try {
        await newSchedule.save();
      } catch (error) {
        console.error('Error saving schedule:', error);
      }
    }

    res.json({ Status: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: 'Error', Message: 'Unable to save schedules' });
  }
});

////////
//delete employee
app.get('/delete/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const id = Number(req.params.id);
  try {
     await Employee.findOneAndDelete({id});
    return res.send({ Status: "Success"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Delete employee error in MongoDB' });
  }
});
    

// create new employee
app.post("/create",upload.single('image') ,async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const newEmployee =mongoose.model("EmployeeInfo") ({
      id: req.body.id,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
      address: req.body.address,
      salary: req.body.salary,
      image: req.file.filename
    });
   // ( *** must add if ID or Email is already exists)
    newEmployee.save()// Save new Employee document to MongoDB
  .then(() => {
    return res.send({ Status: 'Success' });
  })
  .catch((error) => {
    return res.status(500).json({ error: "Can't Add this employee" });
  });
  });

/*
//Get dashboard
app.get('/dashboard',verifyUser, (req, res) => {
  return res.json({Status: "Success", userType: req.userType, id: req.id})
})
*/

//Get Employee List
app.get("/getEmployee", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const employee = await Employee.find({});
    return res.send({ Status: "Success", Result: employee });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
  }
});

 //Get Employee Information
app.get('/getInfo/:id', async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const id = Number(req.params.id);
  try {
    const result = await Employee.findOne( { id } )
    return res.send({ Status: "Success", Result: result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
  }
});


//Update employee info
app.put('/update/:id', async(req, res) => {
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
 res.header('Access-Control-Allow-Credentials', true);
  try {
   const id = Number(req.params.id);
   const OldEmployee =await Employee.findOne({ id });
   const updateEmployee = {
    id: Number(req.body.id),
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    userType: req.body.userType,
    address: req.body.address,
    salary: Number(req.body.salary),
    image: req.body.image
  };
    Employee.findOneAndUpdate({id}, updateEmployee, { new: true })
    console.log(OldEmployee)
    console.log(updateEmployee)
    return res.send({ Status: "Success"});
  } catch (error) {
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
  }
});

//logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: "Success"});
})

app.listen(PORT, () => {
  console.log('You are listening to port:',PORT);
})  
///test mohamad
// schdule updated 16/05 19:27