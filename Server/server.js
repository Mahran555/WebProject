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
const Vacations = require("./models/VacationDetails");
const WorkData = require("./models/WorkInfo");
const Schedules = require("./models/SaveSchedule");
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
      return res.send({Status: "Success", Role:"Employee", Result: userEmployee });
  }
    return res.send({Status: "error", error: "Invalid email or password"  });
});


//update edit employee
app.post('/updateEmployee/:id', upload.single('image'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const { _id, fname, lname, email, password, phone, address } = req.body;
  let { image } = req.body;

  if (req.file) {
    image = req.file.filename; // Use the filename of the uploaded image
  }

  try {
    let updatedFields = { fname, lname, email, password, phone, address, image };

    const updatedEmployee = await Employee.findByIdAndUpdate(_id, updatedFields, { new: true });
    console.log('Successfully updated Employee:', updatedEmployee);
    res.json({ Status: 'Success', Result: updatedEmployee });
  } catch (err) {
    console.log('Failed to update Employee:', err);
    res.status(500).json({ Status: 'Error', message: 'Failed to update Employee' });
  }
});



//update edit manager
app.post('/updateManager', upload.single('image'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const { _id, fname, lname, email, password, phone, address } = req.body;
  let { image } = req.body;

  if (req.file) {
    image = req.file.filename; // Use the filename of the uploaded image
  }

  try {
    let updatedFields = { fname, lname, email, password, phone, address, image };

    const updatedManager = await Manager.findByIdAndUpdate(_id, updatedFields, { new: true });
    console.log('Successfully updated manager:', updatedManager);
    res.json({ Status: 'Success', Result: updatedManager });
  } catch (err) {
    console.log('Failed to update manager:', err);
    res.status(500).json({ Status: 'Error', message: 'Failed to update manager' });
  }
});



// Update vacation request status
app.put('/vacationRequests/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const status = req.body.status;

    // Find the vacation request by ID and update the status
    await Vacations.findByIdAndUpdate(requestId, { status });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating vacation request status:', error);
    res.sendStatus(500);
  }
});


//Get VacationRequests 
app.get("/vacationRequests", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const vacations = await Vacations.find({});
    return res.send({ Status: "Success", Result: vacations });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve vacations requests" });
  }
});

// salaries
app.get('/salaries', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const employees = await Employee.find({}, 'salary'); // get only 'salary' field of all employees  
    const salaries = employees.map(employee => employee.salary);
    res.json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred while fetching individual salaries');
  }
});
//count employee numbers
app.get('/employeeCount', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const employeeCount = await Employee.countDocuments({});
    res.json({ count: employeeCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred while counting employees');
  }
});

//schdule creation/update

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
      image: req.file.filename,
      phone: req.body.phone
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

//Get employee Working hours and wages
app.get('/workData/:id', async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const id = Number(req.params.id);
  try {
    const result = await WorkData.find( { EmployeeID:id } )
    console.log(result)
    return res.send({ Status: "Success", Result: result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
  }
});

 //Get Employee Schedule
 app.get('/employeeSchedule/:id', async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const id = Number(req.params.id);
  try {
    const result = await Schedules.find( { EmployeeID:id } )
    console.log(result)
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
    image: req.body.image,
    phone: Number(req.body.phone)
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
///test mohamad
// schdule updated 16/05 19:27
//test amran from amransBranch
