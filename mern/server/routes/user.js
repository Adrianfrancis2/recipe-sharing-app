import express from "express";

//  Help connect to database
import db from "../db/connection.js";

//  Help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

//  user router controls requests starting with /user
const router = express.Router();

//  Get a list of all users
router.get("/", async (req, res) =>  {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
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
  console.log("post request to /user routed")
  try {
    let newUser = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
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
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        recipe_ids: req.body.recipe_ids,
        views: req.body.views,
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
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