import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {
  createBrowserRouter, //define routes 
  RouterProvider, //wraps application with routing function
  Outlet, //placeholder for rendering child routes
} from "react-router-dom";

//import App and other componenets
import App from "./App"; //main app 
import CreateUser from "./components/CreateUser"; //user registration
import LoginUser from "./components/LoginUser"; //user login
import UserProfile from "./components/UserProfile"; //user profile display
import CreateRecipe from "./components/CreateRecipe"; //create a recipe 
import RecipeCard from "./components/RecipeCard"; //individual recipe display
import HomePage from "./components/HomePage";     //to connect to HomePage.jsx
import "./index.css";

import UpdateHomePage from "./components/HomePage";

//  Lists routes for webpage
const router = createBrowserRouter([
  {
    path: "/", //base path
    element: <App />, //renders App component
    children: [
      {
        path: "", //default child route (same as "/")
        //added new element for the HomePage
        element: <HomePage />, //renders HomePage component
      },
    ],
    
  },
  {
    path: "/user/",
    element: <App />,
    children: [
      {
        path: ":id",
        element: <UserProfile />, //renders UserProfile component
      },
      {
        path: "profile", //route for viewing/editing user profile when logged in 
        element: <UserProfile />, 
      },
      {
        path: "create",
        element: <CreateUser />, //route for user registration
      },
      {
        path: "login",
        element: <LoginUser />,
      },
    ],
  },
  {
    path: "/recipe/",
    element: <App />,
    children: [
      {
        path: ":id",
        element: <RecipeCard />,
      },
      {
        path: "create",
        element: <CreateRecipe />,
      },
    ]
  },
]);

//render application with routing
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);