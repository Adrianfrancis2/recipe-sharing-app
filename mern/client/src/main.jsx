import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import App from "./App";
import NewUser from "./components/CreateUser";
import NewRecipe from "./components/CreateRecipe";
import LoginUser from "./components/LoginUser";
import UpdateHomePage from "./components/HomePage";

//  import UserList from "./components/UserList";
import UserProfile from "./components/UserProfile";
import "./index.css";
import { useState } from "react";

//  Lists routes for webpage
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        // element: <UserList />,
      },
    ],
    
  },
  {
    path: "/user/:id",
    element: <App />,
    children: [
      {
        path: "/user/:id",
        // element: <UserProfile />,
      },
    ],
  },
  {
    path: "/newuser",
    element: <App />,
    children: [
      {
        path: "/newuser",
        element: <NewUser />,
      },
    ],
  },
  {
    path: "/login",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginUser />,
      },
    ]
  },
  {
    path: "/userprofile",
    element: <App />,
    children: [
      {
        path: "/userprofile",
        element: <UserProfile />,
      },
    ]
  },
  {
    path: "/newrecipe",
    element: <App />,
    children: [
      {
        path: "/newrecipe",
        element: <NewRecipe />,
      },
    ],
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);