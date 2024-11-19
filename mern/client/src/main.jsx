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
import UpdateHomePage from "./components/HomePage";

//  import Recipe from "./components/CreateRecipe";
//  import UserList from "./components/UserList";
import UserProfile from "./components/UserProfile";
import CreateRecipe from "./components/CreateRecipe";
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
    path: "/createuser",
    element: <App />,
    children: [
      {
        path: "/createuser",
        element: <CreateUser />,
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
    path: "/createrecipe",
    element: <App />,
    children: [
      {
        path: "/createrecipe",
        element: <CreateRecipe />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);