// index.js

import app from "./app.js";
import dotenv from "dotenv"
dotenv.config("../../env")

const Port = 8000 || process.env.PORT

app.listen(Port,()=>{

    console.log(` the server is listening at http://localhost:${Port}`)
}) 






