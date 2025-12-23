import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes/router.js";
import connectDB from "./config/db.js";

const app = express(); // create express app
const PORT = process.env.PORT || 3000; // default port 3000

connectDB(); // connect to database



app.use(express.json()); // to parse json data
app.use(express.urlencoded({extended:true})); // to parse urlencoded data

app.use("/api/v1",router) // use the router for API routes

app.listen(PORT, ()=>{
  console.log("server started at Port ,", PORT);  // start the server
})