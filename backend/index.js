const express = require("express");
const cors = require('cor')
const rootRouter = require("./routes/index");
const userRouter = require("./routes/user")
const app = express() ;
const port = 3000
app.use(express.json()); // express's build in middleware other way is to use body-parser package
app.use(cors())
app.use("/api/v1", rootRouter) ;
app.use("/api/v1/user", userRouter) ;

app.listen(port , ()=>{
    console.log(`Listening on port : ${port}`)
})
