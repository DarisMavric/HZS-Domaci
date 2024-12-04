import express from "express"
import bodyParser from "body-parser";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

import userRoutes from "./api/routes/userRoutes.js"
import friendsRoutes from "./api/routes/friendsRoutes.js"

const app = express();

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser());

const PORT = process.env.PORT;

connectDB();

app.use('/api/user/',userRoutes);
app.use('/api/friends/',friendsRoutes);



app.listen(PORT,(error) => {
  if(!error)
    console.log("Server is Successfully Running, and App is listening on port "+ PORT)
  else 
      console.log("Error occurred, server can't start", error);
  }
);


