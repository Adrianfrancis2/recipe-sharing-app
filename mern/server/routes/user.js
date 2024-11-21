import express from "express";
import bcrypt from "bcrypt";

//  Help connect to database
import db from "../db/connection.js";

//  Help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

//  user router controls requests starting with /user
const router = express.Router();

// bryce for password hashing

//  Get a list of all users
router.get("/", async (req, res) =>  {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
});

// Get only usernames
router.get("/usernames", async (req, res) => {
  try {
    const collection = await db.collection("users");
    const usernames = await collection.find({}, { projection: { username: 1, _id: 0 } }).toArray();
    res.status(200).send(usernames.map(user => user.username));
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).send({ message: "Error fetching usernames" });
  }
});

// Get only one user
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("users");

    // Use findOne to fetch the user with the given ID
    const user = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Return the user
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching user" });
  }
});

// //  Fetch user login
// router.post("/", async (req, res) => {
//   try {
//     let loginUser = {
//       username: req.body.username,
//       password: req.body.password,
//     };
//     let collection = await db.collection("users");
//     let findUserName = await collection.findOne({ username: newUser.username });
//     console.log(findUserName);
//     result = findUserName;
//     res.status(204).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Error fetching user: no user found" });
//   };
// });

//  Create a new user
router.post("/", async (req, res) => {
  // console.log("post request to /user routed")
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  try {
    let newUser = {
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
      recipe_ids: [],
      views: 0,
    };
    let collection = await db.collection("users");
    let findUserName = await collection.findOne({ username: newUser.username });
    if (findUserName == null) {
      let result = await collection.insertOne(newUser);
      res.status(204).send(result);
    } else {
      console.error("Username already exists");
      res.status(400).send("Username already exists");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user");
  }
});

//  Update a record by id
router.patch("/:id", async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  console.log(req.body.curr_password);
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = await db.collection("users");

    // const updates = {
    //   $set: {
    //     name: req.body.name,
    //     username: req.body.username,
    //     password: req.body.password,
    //     recipe_ids: req.body.recipe_ids,
    //     views: req.body.views,
    //   },
    // };
    const findUserName = await collection.findOne(query);
    console.log(findUserName);
    if (findUserName == null) {
      console.error("user not found");
      res.status(400).json({ msg: "user not found" });
    } else {
      const isPasswordCorrect = await bcrypt.compare(req.body.curr_password, findUserName.password);     
      if (!isPasswordCorrect) {
        console.error("incorrect password");
        res.status(400).json({ msg: "incorrect password" });
      } else {
        const updates = { $set: {} };
        // Dynamically add fields to the $set object
        for (const key in req.body) {
          if (key !== "password" && req.body[key] !== undefined) {
            updates.$set[key] = req.body[key];
          }
        }
        const result = await collection.updateOne(query, updates);
        res.status(200).send(result);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

//  Delete a record by id
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("users");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch(err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

export default router;

/*
These router requests may be simulated.
1. Web dev tools -> Network -> New request
2. Request type e.g. POST, PATCH, DELETE
3. Update request URL: http://localhost:5050/user/...
4. Match headers (Send a real request, edit & resend
-> automatically fills out needed headers)
5. Edit payload
POST: newUser as a json
PATCH: json with fields for user + new values
DELETE: json with id only
*/