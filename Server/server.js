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
const Manager = require("./models/ManagerDetails");

//UserLogin page
app.post("/login", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const { email, password} = req.body;
  const userEmployee = await Employee.findOne({ email });
  const userManager = await Manager.findOne({ email });
  if (userManager && userManager.password == password ) {
    return res.json({Status:"Success", Role:"Manager"});
  }
  if ( userEmployee && userEmployee.password==password) {
      return res.json({Status: "Success", Role:"Employee", Result: userEmployee.id });
  }
    return res.send({Status: "error", error: "Invalid email or password"  });
});

const Schedules = require("./models/SaveSchedule");
app.post('/saveSchedule', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    console.log(req.body);
    const { scheduleData } = req.body;

    if (!scheduleData) {
      return res.status(400).json({ Status: 'Error', Message: 'Missing scheduleData in request body' });
    }

    // Transform the data into an array of schedules
    const schedules = [];
    scheduleData.forEach(({day, month, shift, EmployeeID}) => {
        schedules.push({
          day: Number(day),
          month: month,
          shift: shift === 'shift1' ? 'morning' : 'evening',
          EmployeeID: EmployeeID,  
        });
    });

    // Save or update all schedules
    for (const schedule of schedules) {
      const filter = { 
        day: schedule.day, 
        month: schedule.month, 
        shift: schedule.shift 
      };
      const update = { 
        EmployeeID: schedule.EmployeeID 
      };
      const options = { 
        upsert: true, // create a new document if no documents match the filter
        new: true // return the updated document
      };

      try {
        await Schedules.findOneAndUpdate(filter, update, options);
      } catch (error) {
        console.error('Error saving or updating schedule:', error);
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
    const check1 = await Employee.findOne({id:newEmployee.id});
    const check2 = await Employee.findOne({ email:newEmployee.email });
   if (check1  || check2 ) {
     return res.send({Status: "error", error: "This ID or email already exists"  });
   }
    newEmployee.save()// Save new Employee document to MongoDB
  .then(() => {
    return res.send({ Status : "Success" });
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

//Get Manager
app.get("/getManager", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const fname="Gus";
    const manager = await Manager.findOne({fname});
    return res.send({ Status: "Success", Result: manager });
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
  const updateEmployee = ({
    id: Number(req.body.id),
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    userType: req.body.userType,
    address: req.body.address,
    salary: Number(req.body.salary),
    image: req.body.image
  });
  const check = await Employee.findOne({id});
  const check1 = await Employee.findOne({id:updateEmployee.id});
  const check2 = await Employee.findOne({ email:updateEmployee.email });
 if ((check1 && id!=updateEmployee.id) || (check2 && check.email!=updateEmployee.email)) {
   return res.send({Status: "error", error: "This ID or email already exists"  });
 }
  const result = await Employee.updateOne({id}, { $set:  updateEmployee });
  return res.send({ Status: "Success"});
} catch (error) {
  return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
}
});

//logout
app.get('/logout', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.clearCookie('token');
  return res.json({Status: "Success"});
})

app.listen(PORT, () => {
  console.log('You are listening to port:',PORT);
})  
///GG mohamad