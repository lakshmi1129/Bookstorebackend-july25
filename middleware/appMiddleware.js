const appMiddleware = (req,res,next)=>{
    // logic
    console.log("inside Application middleware");
    next()
    
}

module.exports = appMiddleware