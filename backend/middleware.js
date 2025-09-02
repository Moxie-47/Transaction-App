const {JWT_SECRET} = require('./config')
const jwt = require("jsonwebtoken")

const authMiddlware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log(`auth typ : ${authHeader} \n`)
    if(!authHeader || !authHeader[0] == 'Bearer'){
        return res.status(403).json({
            message : "Invalid authorization format"
        }) ;
    }
    const token = authHeader.split(' ')[1];
    console.log(`Token : ${token}`)
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
        req.userId = decoded.userId
        console.log(`userId : ${req.userId}`)

        next();
    }catch(err){
        return res.status(403).json({
            message : "Something is wrong"
        }) ;
    }
};

module.exports = {
    authMiddlware
}