import { NavLink, useLocation } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Navbar({ loggedIn, logout }) {

  const location = useLocation()
  //banner at top --> link to home page 
  return (
    <div>
      <nav className="flex gap-3 grid-cols-6 justify-between mb-6"> 
         {/* check NOT on homepage --> display navbar*/}
         {location.pathname != "/" ? (
          <NavLink to="/">
          <div 
            className="py-1 px-1 text-6xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-500 text-transparent bg-clip-text hover:from-blue-900 hover:via-indigo-800 hover:to-blue-600" style={{ fontFamily: 'Pacifico, cursive'}}>
            cooked.  {/* logo in the left hand corner of the screen */}
          </div>
        </NavLink>
         ) : (
          <div 
            className="py-1 px-1 text-6xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-500 text-transparent bg-clip-text hover:from-blue-900 hover:via-indigo-800 hover:to-blue-600" style={{ fontFamily: 'Pacifico, cursive'}}>
             {/* empty logo to shift buttons to the right */}
          </div>
         )}
        {loggedIn ? (LoggedInNavBar(loggedIn, logout)) : (guestNavBar())}
      </nav>
    </div>
  );
}


function LoggedInNavBar(ID, logout) {
  return (
    <div>
      <div className="col-span-4"> </div>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3 mr-2" to={`/recipe/create`}>
        Create Recipe
      </NavLink>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3 mr-2" to={`/user/profile`}>
        User Profile
      </NavLink>
      <button className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" onClick={logout}>
        Logout
      </button>
    </div>
  )
}


function guestNavBar() {
  return (
    <div>
      <div className="col-span-3"> </div>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3 mr-2" to="/user/create">
        Create New User
      </NavLink>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/user/login">
        Login
      </NavLink>
    </div>
  )
}
