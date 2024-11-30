import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import App from "./App";
import CreateUser from "./components/CreateUser";
import LoginUser from "./components/LoginUser";
import UserProfile from "./components/UserProfile";
import CreateRecipe from "./components/CreateRecipe";
import RecipeCard from "./components/RecipeCard";
import HomePage from "./components/HomePage";     //to connect to HomePage.jsx
import "./index.css";

import UpdateHomePage from "./components/HomePage";

//  Lists routes for webpage
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        //added new element for the HomePage
        element: <HomePage />,
      },
    ],
    
  },
  {
    path: "/user/",
    element: <App />,
    children: [
      {
        path: ":id",
        element: <UserProfile />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "create",
        element: <CreateUser />,
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);