import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

// clean whitespaces to create array of keywords
function parseSearchTerm(searchTerm) {
  if (!searchTerm || typeof searchTerm !== "string") {
    return [];
  }

  return searchTerm
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
}

const App = () => {
  //initialize state to hold loggedin user's ID
  const [loggedInUserID, setLoggedInUserID] = useState( (localStorage.getItem("userID")) ? localStorage.getItem("userID") : null);

  // Moved isEditing state to here for navbar rendering
  const [isEditing, setIsEditing] = useState(false);

  // state to hold search terms
  const [searchTerm, setSearchTerm] = useState([]);

  //handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userID"); //remove user ID from localStorage
    setLoggedInUserID(null); //update state: no user logged in
  };

  const handleSearch = (term) => {
    const parsedTerms = parseSearchTerm(term);
    setSearchTerm(parsedTerms);
  };

  // pass in log in user ID to Navbar & log out 
  // update userID
  return (
    <div className="w-full p-6">
      <Navbar loggedIn={loggedInUserID} logout={handleLogout} isEditing={isEditing} onSearch={handleSearch} /> 
      <Outlet context={{ loggedInUserID: loggedInUserID, setLoggedInUserID: setLoggedInUserID, isEditing, setIsEditing, searchTerm }} />
    </div>
  );
};

export default App;
