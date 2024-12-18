import express from "express";
import cors from "cors";
import recipe from "./routes/recipe.js";
import user from "./routes/user.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/recipe", recipe);
app.use("/createrecipe", recipe);
app.use("/user", user);
app.use("/user/login", user);

//  Start Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});