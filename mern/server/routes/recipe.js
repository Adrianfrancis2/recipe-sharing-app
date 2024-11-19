import express from "express";

//  Help connect to database
import db from "../db/connection.js";

//  Help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

import multer from "multer";

//  user router controls requests starting with /user
const router = express.Router();

//  needed to parse form data
const upload = multer();


//  Get a list of all recipes
router.get("/", async (req, res) =>  {
  let collection = await db.collection("recipes");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
});

//  Get a single recipe by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.status(404).send("Not found");
  else res.status(200).send(result);
});

//  Create a new recipe
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    let newRecipe = {
      title: req.body.title,
      desc: req.body.desc,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      image: req.file ? req.file.buffer : null,
    };
    let collection = db.collection("recipes");
    let result = await collection.insertOne(newRecipe);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding recipe");
  }
  }
  /*
  try {
    let newRecipe = {
      title: req.body.title,
      desc: req.body.desc,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      image: null,
    };
    let collection = await db.collection("recipes");
    let result = await collection.insertOne(newRecipe);
    res.status(204).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding recipe");
  }
    */
);

//  Update a recipe by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title: req.body.title,
        desc: req.body.desc,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        image: req.body.image,
      },
    };

    let collection = await db.collection("recipes");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating recipe");
  }
});

//  Delete a recipe by id
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("recipes");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch(err) {
    console.error(err);
    res.status(500).send("Error deleting recipe");
  }
});

export default router;