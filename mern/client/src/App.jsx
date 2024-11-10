import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  const [loggedInUserID, setLoggedInUserID] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUserID(null);
  };

  return (
    <div className="w-full p-6">
      <Navbar loggedInUserID={loggedInUserID} />
      <Outlet context={{ loggedInUserID, setLoggedInUserID }} />
    </div>
  );
};

export default App;
