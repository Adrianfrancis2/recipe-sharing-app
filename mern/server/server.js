import express from "express";
import cors from "cors";
import recipes from "./routes/recipe.js";
import users from "./routes/user.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/recipe", recipes);
app.use("/user", users);

//  Start Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});