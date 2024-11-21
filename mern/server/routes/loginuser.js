import express from "express";
import bcrypt from "bcrypt";

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
        console.error("user not found");
        res.status(400).json({ msg: "user not found" });
      } else {
        const isPasswordCorrect = await bcrypt.compare(loginUser.password, findUserName.password);
        console.log(isPasswordCorrect);
        console.log(loginUser.password);
        console.log(findUserName.password);
        if (!isPasswordCorrect) {
          console.error("incorrect password");
          res.status(400).json({ msg: "incorrect password" });
        } else {
          res.status(200).json({ msg: findUserName });
        }
      }
    } catch (err) {
        console.log("oopsies");
        console.error(err);
        res.status(500).send({ message: "Error fetching user: no user found" });
    };
  });

export default router;