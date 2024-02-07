const express= require('express')
const router = express.Router()
const User = require('../models/User')
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const { getByPlaceholderText } = require('@testing-library/react');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'itisimportant';
const fetchuser = require('../middleware/fetchuser')

//Route1: create a User using: POST "/api/auth/createuser". Doesnt need authentiction
router.post('/createuser',[
     body('name', 'Enter Valid name').isLength({min: 5}),
     body('email', 'Enter Valid email').isEmail(),
     body('password', 'password must be atleast 5 characters').isLength({min: 5}),
], async (req, res) =>{
     let success = false;
     //If there are errors, return bad request and errors
     const errors= validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json({success, errors: errors.array()});
     }
     //Check whether the user with this email exists already
     try{
     let user = await User.findOne({email: req.body.email}); 
     if (user){
          return res.status(400).json({success, error: "Sorry the user with this Email already exists"})
     }
     const salt = await bcrypt.genSalt();
     const secPass = await bcrypt.hash(req.body.password, salt)
     user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
          })
          const data = {
               user:{
                    id: user.id
               }
          }
         const authtoken= jwt.sign(data, JWT_SECRET);
          // res.json(user)
          success=true;
          res.json({success, authtoken})
     }catch(error){
      console.log(error.message);
      res.status(500).send({error: "Internal Server Error"});
     }
})

//Route2: Authentication of user: POST "/api/auth/login". Doesnt need authentiction
router.post('/login',[
     body('email', 'Enter Valid email').isEmail(),
     body('password', 'password cannot be blank').exists(),
], async (req, res) =>{
     let success = false;
     //If there are errors, return bad request and errors
     const errors= validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json({errors: errors.array()});
     }
     const {email, password} = req.body;
     try {
          let user = await User.findOne({email});
          if(!user){
               return res.status(400).json({error: "Please try to login with correct Credentials"})
          }
          const passwordCompare= await bcrypt.compare(password, user.password);
          if(!passwordCompare){
               success = false;
               return res.status(400).json({success, error: "Please try to login with correct Credentials"})
          }
          const data = {
               user:{
                    id: user.id
               }
          }
         const authtoken= jwt.sign(data, JWT_SECRET);
         success = true;
         res.json({success, authtoken})
     }catch(error){
          console.log(error.message);
          res.status(500).send({error: "Internal Server Error"});
         }
})

//Route3: Get loggedIn user details using: POST "/api/auth/getuser". Need authentiction
router.post('/getuser', fetchuser, async (req, res) =>{
try {
     userId = req.user.id;
     const user = await User.findById(userId).select("-password")
     res.send(user);
} catch(error){
     console.log(error.message);
     res.status(500).send({error: "Internal Server Error"});
    }
})


module.exports = router