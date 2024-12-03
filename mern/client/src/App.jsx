import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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

  // check current location
  const location = useLocation();

  useEffect(() => {
    // reset the search term when the route changes
    setSearchTerm("");
  }, [location, isEditing]);

  //handle user logout
  const handleLogout = () => {
    localStorage.removeItem("userID"); //remove user ID from localStorage
    setLoggedInUserID(null); //update state: no user logged in
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const parsedSearchTerms = parseSearchTerm(searchTerm);

  // pass in log in user ID to Navbar & log out 
  // update userID
  return (
    <div className="w-full p-6">
      <Navbar loggedIn={loggedInUserID} logout={handleLogout} isEditing={isEditing} onSearch={handleSearch} searchTerm={searchTerm} /> 
      <Outlet context={{ loggedInUserID: loggedInUserID, setLoggedInUserID: setLoggedInUserID, isEditing, setIsEditing, searchTerm: parsedSearchTerms }} />
    </div>
  );
};

export default App;
