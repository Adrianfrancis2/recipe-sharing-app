import express from "express";
import cors from "cors";
import recipe from "./routes/recipe.js";
import user from "./routes/user.js";
import loginuser from "./routes/loginuser.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/recipe", recipe);
app.use("/newrecipe", recipe);
app.use("/user", user);
app.use("/newuser", user);
app.use("/login", loginuser);

//  Start Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});