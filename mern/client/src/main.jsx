import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import NewUser from "./components/CreateUser";
//  import Login from "./components/LoginUser";
//  import Recipe from "./components/CreateRecipe";
//  import UserList from "./components/UserList";
import "./index.css";
import LoginUser from "./components/LoginUser";

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
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <NewUser />,
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
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);