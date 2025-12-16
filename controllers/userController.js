const users = require("../models/userModel")
const jwt = require("jsonwebtoken")

// register
exports.registerController =async (req,res)=>{
    // logic
    const {username,email,password} = req.body
    console.log(username,email,password);

    try{
        const existingUser = await  users.findOne({email})
        if(existingUser){
            res.status(400).json("Already registered user..")
        }else{
            const newUser = new users({
                username,email,password,profile:""
            })
            await newUser.save() // saved to mongoDB
            res.status(200).json(newUser)
        }

    }catch(err){
        res.status(500).json(err)
    }
    
}

// login
exports.loginController =async (req,res)=>{
    // logic
    const {email,password} = req.body
    console.log(email,password);

    try{
        const existingUser = await  users.findOne({email})
        if(existingUser){
            if(existingUser.password == password){
                const token =jwt.sign({userMail:existingUser.email},process.env.secretKey)
                 res.status(200).json({existingUser,token})
            }else{
                res.status(401).json("Password doesnot match") 
            }
        }else{
             res.status(401).json("User Does not exist...")         
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}

// google login
exports.googleLoginController =async (req,res)=>{
  
    const {username,email,password,photo} = req.body
    console.log(username,email,password,photo);

    try{
        const existingUser = await  users.findOne({email})
        console.log(existingUser);
        
        if(existingUser){   
                const token =jwt.sign({userMail:existingUser.email},"secretKey")
                 res.status(200).json({existingUser,token})           
        }else{
            const newUser = new users({
                username,email,password,profile:photo
            })
            console.log(newUser);
            
            await newUser.save() // saved to mongoDB
            const token = jwt.sign({userMail:existingUser.email},"secretKey")
            res.status(200).json({existingUser:newUser,token})
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}

// /.......................Admin........

// get all users
exports.getAlluserController =async (req,res)=>{
    console.log("inside getAll UserController");
    const email = req.payload
    try{
        const allUsers = await users.find({email:{$ne:email}})
        res.status(200).json(allUsers)
    }catch(err){
        res.status(500).json(err)
    }
    
}

// edit Admin Profile
exports.editAdminProfileController =async (req,res)=>{
    console.log("inside editAdminProfileController");
    const {username,password,profile} = req.body
    const prof = req.file? req.file.filename : profile
    // console.log(req.file.filename);
    
    const email = req.payload
    console.log(email);
    
    try{
        const adminDetails  = await users.findOneAndUpdate({email},{username,email,password,profile:prof},{new:true})
        // await adminDetails.save()
        res.status(200).json(adminDetails)
    }catch(err){
        res.status(500).json(err)
    }
    
}

// edit User Profile
exports.editUserProfileController =async (req,res)=>{
    console.log("inside editUserProfileController");
    const {username,password,profile,bio} = req.body
    const prof = req.file? req.file.filename : profile
    // console.log(req.file.filename);
    
    const email = req.payload
    console.log(email);
    
    try{
        const userDetails  = await users.findOneAndUpdate({email},{username,email,password,profile:prof,bio},{new:true})
        // await userDetails.save()
        res.status(200).json(userDetails)
    }catch(err){
        res.status(500).json(err)
    }
}