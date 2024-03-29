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
const session = require('express-session');
const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sessionSecret = generateSecretKey();

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

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
var ImagesArray = ['', '', '']
var ImagesSet = new Set()
const Employee = require("./models/EmployeeDetails");
const Manager = require("./models/ManagerDetails");
const Vacations = require("./models/VacationDetails");
const Schedules = require("./models/SaveSchedule");
const Shifts = require('./models/SaveSchedule');
const Chats = require("./models/Chats");
//UserLogin page
app.post("/login", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const { email, password} = req.body;
  const userEmployee = await Employee.findOne({ email });
  const userManager = await Manager.findOne({ email });

  if (userManager && userManager.password === password) {
    const token = jwt.sign({ role: "Manager",id: userManager._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    return res.json({ Status: "Success", role: "Manager", token });
  }

  if (userEmployee && userEmployee.password === password) {
    const token = jwt.sign({ role: "Employee", id: userEmployee.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    return res.send({ Status: "Success", role: "Employee", Result: userEmployee , token});
  }

  return res.send({ Status: "error", error: "Invalid email or password" });
});
//vacationrequest sending
app.post('/submitVacationRequest/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const id = Number(req.params.id);


  // Create a new VacationRequest document
  const vacationRequest = new Vacations({
    id:id,
    dayFrom:req.body.dayFrom,
    dayTo:req.body.dayTo,
    fname:req.body.fname,
    lname:req.body.lname,
    monthFrom:req.body.monthFrom,
    monthTo:req.body.monthTo,
    reason:req.body.reason,
  });
  // Save the document to the database
  vacationRequest.save()
    .then(() => {
      // Vacation request saved successfully
      res.status(200).json({ message: 'Vacation request submitted successfully' });
    })
    .catch((error) => {
      // Failed to save the vacation request
      console.error('Failed to save vacation request:', error);
      res.status(500).json({ message: 'Failed to submit vacation request' });
    });
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
// create new employee
app.post("/create", upload.single('image'), async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  let image = req.file ? req.file.filename : 'User.jpg';


  try {
    const newEmployee = mongoose.model("EmployeeInfo")({
      id: req.body.id,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      salary: req.body.salary,
      phone: req.body.phone,
      image: image
      
    });

    const check1 = await Employee.findOne({ id: newEmployee.id });
    const check2 = await Employee.findOne({ email: newEmployee.email });

    if (check1 || check2) {
      return res.send({ Status: "error", error: "This ID or email already exists" });
    }

    await newEmployee.save() // Save new Employee document to MongoDB
    return res.send({ Status: "Success" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Can't Add this employee" });
  }
});


  
  
// Verify User
const verifyUser = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const token = req.cookies.token;
  if (!token) {
    return res.json({ error: "You are not authenticated" });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.send({ Error: "Token is invalid" });
      req.role = decoded.role;
      req.id = decoded.id;
      next();
    });
  }
};
// verify user for Manager
app.get('/verifyManager', verifyUser, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', true);
  try {
    return res.json({ Status: "Success", role: req.role });
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling middleware)
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  return res.status(500).json({ Status: "Error", error: "Internal Server Error" });
});

//verify user for Employee
app.get('/verifyEmployee', verifyUser, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', true);
  try {
    return res.json({ Status: "Success", role: req.role ,id:req.id});
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handling middleware)
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  return res.status(500).json({ Status: "Error", error: "Internal Server Error" });
});




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
    res.json({ Status: 'Success', Result: updatedManager });
  } catch (err) {
    console.log('Failed to update manager:', err);
    res.status(500).json({ Status: 'Error', message: 'Failed to update manager' });
  }
});


 //Get Employee Information
app.get('/getInfo/:id', async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const id = req.params.id;
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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
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
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle the error accordingly
    }
    res.clearCookie('token');
    return res.send({ Status: 'Success' });
  });
});

app.listen(PORT, () => {
  console.log('You are listening to port:',PORT);
})  
app.get("/EmployeesInCurrentShift/:id", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);
  try {
    id=req.params.id
    const date = new Date()
    const day = date.getDate();
    const month = date.getMonth() + 1;  // Adding 1 to account for zero-based indexing
    const hour = date.getHours();
    let ShiftTime;
    if (hour >= 0 && hour < 12) {
      ShiftTime = 'morning'
    } else {
      ShiftTime = 'evening'
    }
    const shifts = await Shifts.findOne({ day: day, month: month, shift: ShiftTime });
    const EmployeesIDs = shifts.toObject().EmployeeID
    let EmployeesArray = [];
    for (const EmployeeID of EmployeesIDs) {
      const Emp = await Employee.findOne({ id: EmployeeID });
      if(EmployeeID!=id)
      {
      EmployeesArray.push(Emp)
      }
    }
    
    return res.json({ Status: "Success", Result: EmployeesArray });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve vacations requests" });
  }
});

//Get Employees that are working at the current shift
app.get("/Shifts/", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);
  try {
    const date = new Date()
    const day = date.getDay();
    const month = date.getMonth();
    const hour = date.getHours();
    let ShiftTime;
    if (hour >= 0 && hour < 12) {
      ShiftTime = 'morning'
    } else {
      ShiftTime = 'evening'
    }
    
    const shifts = await Shifts.findOne({ day: day, month: month, shift: ShiftTime });
    
    return res.json({ Status: "Success", Result: shifts });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve vacations requests" });
  }
});


//Get Chats for specefic employee with another employees
app.get('/GetChats/:id', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Add this line
  const id = Number(req.params.id);
  const ImagesArray=[]
  try {
    var chats = await Chats.find({ $or: [{ EmployeeID1: id }, { EmployeeID2: id }] }); 
    for (let chat of chats) {
      if(chat.EmployeeID1==id){
        const img = await Employee.findOne({ id: chat.EmployeeID2 }, 'image');
        ImagesArray.push(img);
      }else{
        const img = await Employee.findOne({ id: chat.EmployeeID1 }, 'image');
        ImagesArray.push(img);
      }

    }

    for (let chat of chats) {
      let chatObj = chat.toObject(); // Convert each Mongoose document to a plain JS object
      chatObj.Image = ImagesArray.shift(); // Add the ImagesArray property
      chats[chats.indexOf(chat)] = chatObj; // Replace the original document in the array with the modified object
    }
    return res.send({ Status: "Success", Result: chats });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Status: "Error", Message: "Unable to retrieve employees" });
  }
});


//get messages
app.get('/GetMessages/:id1/:id2', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Add this line
  const id1 = req.params.id1;
  const id2 = req.params.id2;


  try {
    // Find the document by the specified IDs and update the Messages field
    const Messages = await Chats.findOne(
      {
        $or: [
          {
            $and: [
              { EmployeeID1: id2 },
              { EmployeeID2: id1 }
            ]
          },
          {
            $and: [
              { EmployeeID1: id1 },
              { EmployeeID2: id2 }
            ]
          }
        ]
      }
    );

    res.status(200).json({ status: 'Success', chat: Messages });
  } catch (error) {
    res.status(500).json({ status: 'Error', error: error.message });
  }

});
// Handle Message Recieved
app.put('/Message/:id1/:id2', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', true);

  try {
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const data = req.body.data;
    data.MessageDate = new Date(data.MessageDate);
    // Find the document by the specified IDs and update the Messages field
    let updatedChat = await Chats.findOneAndUpdate(
      { $or: [{ $and: [{ EmployeeID1: id1 }, { EmployeeID2: id2 }] }, { $and: [{ EmployeeID1: id2 }, { EmployeeID2: id1 }] }] },
      { $push: { Messages: data } },
      { new: true }
    );

    if (!updatedChat) {
      const newChat = new Chats({ EmployeeID1: id1, EmployeeID2: id2, Messages: [data] })
      await newChat.save();
      updatedChat = newChat.toObject();
    }



    res.status(200).json({ status: 'Success', chat: updatedChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Error', error: error.message });
  }
});
///test mohamad
// schdule updated 16/05 19:27
//test amran from amransBranch
