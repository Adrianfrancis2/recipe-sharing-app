import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  //initialize state to hold loggedin user's ID
  const [loggedInUserID, setLoggedInUserID] = useState( (localStorage.getItem("userID")) ? localStorage.getItem("userID") : null);

  // Add isEditing state to track if user is editing for navbar rendering
  const [isEditing, setIsEditing] = useState(false);

  //handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userID"); //remove user ID from localStorage
    setLoggedInUserID(null); //update state: no user logged in
  };

  // pass in log in user ID to Navbar & log out 
  // update userID
  return (
    <div className="w-full p-6">
      <Navbar loggedIn={loggedInUserID} logout={handleLogout} isEditing={isEditing} /> 
      <Outlet context={{ loggedInUserID: loggedInUserID, setLoggedInUserID: setLoggedInUserID, isEditing, setIsEditing }} />
    </div>
  );
};

export default App;
