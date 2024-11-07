import express from "express";

//  Help connect to database
import db from "../db/connection.js";

//  Help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

//  user router controls requests starting with /user
const router = express.Router();


//  Fetch user login
router.post("/", async (req, res) => {
    console.log("trying");
    try {
      let loginUser = {
        username: req.body.username,
        password: req.body.password,
      };
      console.log(loginUser);
      let collection = await db.collection("users");
      let findUserName = await collection.findOne({ username: loginUser.username });
      console.log(findUserName);

      if (findUserName == null) {
        console.error("No user found.");
        res.status(400).json({ msg: "No user found." });
      } else if (findUserName.password != loginUser.password) {
        console.error("Password is incorrect.");
        res.status(400).json({ msg: "Password is incorrect." });
      } else {
        res.status(200).json({ msg: `Welcome back, ${findUserName.name}` });
      }
    } catch (err) {
        console.log("oopsies");
        console.error(err);
        res.status(500).send({ message: "Error fetching user: no user found" });
    };
  });

export default router;