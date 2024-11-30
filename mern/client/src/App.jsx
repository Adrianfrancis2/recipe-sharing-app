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
    <div className="w-full">
      <div className="fixed top-0 w-full max-h-24 z-10 bg-white p-4 pr-8 shadow">
        <Navbar loggedIn={loggedInUserID} logout={handleLogout} />
      </div>
      <div className="pt-28 p-4">
        <Outlet context={{ loggedInUserID: loggedInUserID, setLoggedInUserID: setLoggedInUserID }} />
      </div>
    </div>
  );
};

export default App;
