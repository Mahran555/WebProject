const express = require('express')
const cors = require('cors')
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const cookieParser = require('cookie-parser')
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const { error } = require('console');
const jwt = require('jsonwebtoken');
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
app.use(cookieParser());
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
const Shifts = require('./models/SaveSchedule');
//UserLogin page
app.post("/login", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const { email, password} = req.body;
  const userEmployee = await Employee.findOne({ email });
  const userManager = await Manager.findOne({ email });

  if (userManager && userManager.password === password) {
    const token = jwt.sign({ role: "Manager" }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ Status: "Success", role: "Manager", token });
  }

  if (userEmployee && userEmployee.password === password) {
    const token = jwt.sign({ role: "Employee", id: userEmployee.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    return res.send({ Status: "Success", role: "Employee", Result: userEmployee });
  }

  return res.send({ Status: "error", error: "Invalid email or password" });
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
    const Employee = await Vacations.findByIdAndUpdate(requestId, { status }); 
    for(let i = Employee.monthFrom; i <= Employee.monthTo; i++) {
      for (let j = Employee.dayFrom; j <= Employee.dayTo; j++) {
        const shifts = await Schedules.find( {day:j ,month:i ,EmployeeID:Employee.id} )
        for (const shift of shifts) {
          await Schedules.updateOne(
            { _id : shift._id }, // Specify the document to update
            { $pull: { EmployeeID: { $in: [Employee.id] } } } // remove/update from array in object collection
          )
        }
      }
    }
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
    const employeesSalary = await Employee.find({}, 'salary'); // get 'salary' field of all employees 
    const employeesNames = await Employee.find({}, 'fname'); // get 'first name' field of all employees   
    const salaries = employeesSalary.map(employeesSalary => employeesSalary.salary);
    const names=employeesNames.map(employeesNames => employeesNames.fname);
    res.json( {Salaries : salaries, Names :names});
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

//count Shifts
app.get('/shiftsCount', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const date = new Date();
    const thisMonth = date.getMonth() + 1; // Adding 1 to adjust for zero-based index
    const id = Number(req.params.id);
    const morningCount=[0]
    const eveningCount=[0]
    for(let i=1;i<=thisMonth;i++)
    {
    morningCount[i-1] = await Shifts.countDocuments({month:i,shift:"morning"});
    eveningCount[i-1] = await Shifts.countDocuments({month:i,shift:"evening"});
    }
    res.json({ MorningShifts: morningCount,EveningShifts :eveningCount});
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

  
  
// Verify User
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.json({ Error: "Token is invalid" });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};


app.get('/dashboard', verifyUser, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
 res.header('Access-Control-Allow-Credentials', true);
  try {
    
    return res.json({Status: "Success", role: req.role});
  } catch (error) {
    console.log("hi")
    return res.status(500).json({ Status: "Error", error: "Internal Server Error" });
  }
});


/*app.get('/IsLoginManager', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  try {
    const fname="Gus";
    const manager = await Manager.findOne({fname});
    if(manager.IsLogin==1){
    return res.send({ Status: "Success" });
    }else{
      res.send({ Status: "Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
  }
})*/

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

//update edit manager
app.post('/updateManager', upload.single('image'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const { _id, fname, lname, email, password, phone, address } = req.body;
  const imageData = req.file;

  try {
    let updatedFields = { fname, lname, email, password, phone, address };

    // Check if there is an uploaded image
    if (imageData) {
      updatedFields.image = imageData.filename;
    }

    const updatedManager = await Manager.findByIdAndUpdate(_id, updatedFields, { new: true });
    console.log('Successfully updated manager:', updatedManager);
    res.json({ Status: 'Success', Result: updatedManager });
  } catch (err) {
    console.log('Failed to update manager:', err);
    res.status(500).json({ Status: 'Error', message: 'Failed to update manager' });
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

//Get employee Working hours 
app.get('/daysCount/:id', async(req, res) => {
  const date = new Date();
  const thisMonth = date.getMonth() + 1; // Adding 1 to adjust for zero-based index
  const id = Number(req.params.id);
  const count=0
  const arrCount=[0]
  try {
    for(let i = 1; i <= thisMonth; i++) {
    const count= await Shifts.countDocuments( { month:i ,EmployeeID:id } ) 
    arrCount[i-1]=count*8
    }
      // Count the matching documents
    return res.send({ Status: "Success", ThisMonth: arrCount[thisMonth-1]/8, AllMonths:arrCount });
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
  return res.send({Status: "Success"});
})

app.listen(PORT, () => {
  console.log('You are listening to port:',PORT);
})  
///test mohamad
// schdule updated 16/05 19:27
//test amran from amransBranch
