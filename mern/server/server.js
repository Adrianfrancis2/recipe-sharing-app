import express from "express";
import cors from "cors";
import recipes from "./routes/recipe.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/recipe", recipes);

//  Start Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});