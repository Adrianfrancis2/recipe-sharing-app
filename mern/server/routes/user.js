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

//  Get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOneAndUpdate(query);

  if (!result) res.status(404).send("Not found");
  else res.status(200).send(result);
});

//  Create a new user
router.post("/", async (req, res) => {
  try {
    let newUser = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      recipe_ids: [],
      views: 0,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newUser);
    res.status(204).send(result);
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