import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  const [loggedInUserID, setLoggedInUserID] = useState( (localStorage.getItem("userID")) ? localStorage.getItem("userID") : null);

  const handleLogout = () => {
    localStorage.removeItem("userID");
    setLoggedInUserID(null);
  };

  return (
    <div className="w-full p-6">
      <Navbar loggedIn={loggedInUserID} logout={handleLogout} />
      <Outlet context={{ loggedInUserID: loggedInUserID, setLoggedInUserID: setLoggedInUserID }} />
    </div>
  );
};

export default App;
