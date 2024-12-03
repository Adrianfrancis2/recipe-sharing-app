import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar({ loggedIn, logout, isEditing, onSearch }) {

  const location = useLocation()
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value); // update search term in App.jsx
  }
  //banner at top --> link to home page 
  return (
    <div>
      <nav className="flex gap-3 grid-cols-6 justify-between mb-6"> 
         {/* check NOT on homepage OR logged in --> display navbar logo */}
         {location.pathname != "/" || loggedIn ? (
          <NavLink to="/">
          <div 
            className="py-1 px-1 text-6xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-500 text-transparent bg-clip-text hover:from-blue-900 hover:via-indigo-800 hover:to-blue-600" style={{ fontFamily: 'Pacifico, cursive'}}>
            cooked.  {/* logo in the left hand corner of the screen */}
          </div>
        </NavLink>
         ) : (
          <div 
            className="py-1 px-1 text-6xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-500 text-transparent bg-clip-text hover:from-blue-900 hover:via-indigo-800 hover:to-blue-600" style={{ fontFamily: 'Pacifico, cursive'}}>
             {/* empty logo to shift buttons to the right */}&nbsp;
          </div>
         )}
         {/* check if logged in --> display searchbar*/}
         {loggedIn && !(location.pathname.startsWith("/recipe/") || location.pathname === "/recipe/create" || isEditing ) && (
        <div className="flex justify-center items-center w-full sm:w-3/4 md:w-1/2">
          <input
            type="text"
            placeholder="Search recipes..."
            className="border border-input bg-background hover:bg-slate-100 h-12 rounded-md px-4 w-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-center"
            onChange={handleChange}
          />
        </div>
         )}
        {loggedIn ? (LoggedInNavBar(loggedIn, logout)) : (guestNavBar())}
      </nav>
    </div>
  );
}

//react functional component
  //defines navigation bar for a logged-in user (display)
function LoggedInNavBar(ID, logout) {
  return (
    <div className="flex items-center sm:flex-row sm:justify-end space-x-1">
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to={`/recipe/create`}>
        Create Recipe
      </NavLink>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to={`/user/profile`}>
        User Profile
      </NavLink>
      <button className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

//react functional component
  //defines navigation bar for guest user (display)
function guestNavBar() {
  return (
    <div className="flex items-center sm:flex-row sm:justify-end space-x-1">
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/user/create">
        Create New User
      </NavLink>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/user/login">
        Login
      </NavLink>
    </div>
  )
}
