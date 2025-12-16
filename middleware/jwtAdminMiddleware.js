const jwt = require("jsonwebtoken")

const jwtAdminMiddleware = (req,res,next)=>{
    console.log("Inside  jwtAdminMiddleware");
   
    const token = req.headers['authorization'].split(' ')[1]
    console.log(token);

    try{
        const jwtResponse  = jwt.verify(token,process.env.secretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        if(req.payload =="bookAdmin@gmail.com"){
             next()
        }else{
             res.status(401).json("Invalid User....")

        }

    }catch(err){
        res.status(401).json("invalid token")
    }  
  
    
}

module.exports = jwtAdminMiddleware