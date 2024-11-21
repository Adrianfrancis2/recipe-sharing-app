import { NavLink } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Navbar({ loggedInUserID }) {

  //banner at top --> link to home page 
  return (
    <div className="h-screen flex items-center justify-center">
      <nav className="flex gap-3 grid-cols-6 justify-between mb-6"> 
         {/* Clickable banner that links to the home page */}
        <NavLink to="/">
          <div 
            className="py-2 px-2 text-9xl font-bold bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-500 text-transparent bg-clip-text hover:from-blue-900 hover:via-indigo-800 hover:to-blue-600" 
            style={{ 
              fontFamily: 'Pacifico, cursive', 
              marginBottom: '200px',
              position: 'absolute', //absolute positioning of the text
              top: '30%', // Adjust as needed to place it vertically
              left: '50%', // Centers the text horizontally
              transform: 'translateX(-50%)', // Ensures it is truly centered
            }}
          >
            cooked. {/* needs to move in the middle of the screen */}
          </div>
        </NavLink>
        <img
          src="https://www.pngmart.com/files/15/Toque-Chef-Hat-PNG-File.png" // Replace with your image URL
          alt="Chef Hat Image"
          className="w-40 h-50 mt-60 ml-20"  // Add styling as needed
          style={{
            transform: 'rotate(20deg) translateX(190%) translateY(-130%)', // Slight tilt, change the degree for more tilt
          }}
        />
        <img
          src="https://static.vecteezy.com/system/resources/previews/012/377/747/non_2x/cooking-pot-icon-sign-symbol-png.png" // Replace with your image URL
          alt="Pot Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            left: '15px',
            bottom: '70px',
            transform: 'rotate(-20deg) translateX(190%) translateY(-130%)', // Slight tilt, change the degree for more tilt
          }}
        />
        <img
          src="https://webstockreview.net/images/clipart-restaurant-spoon-fork-18.png" // Replace with your image URL
          alt="Utensils Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            left: '-190px',
            bottom: '-140px',
            transform: 'rotate(5deg) translateX(190%) translateY(-130%)',
          }}
        />
        {/* <img
          src="HERE" // Replace with your image URL
          alt="HERE Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            left: '-190px',
            bottom: '-140px',
            transform: 'rotate(5deg) translateX(190%) translateY(-130%)',
          }}
        />
        <img
          src="HERE" // Replace with your image URL
          alt="HERE Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            left: '-190px',
            bottom: '-140px',
            transform: 'rotate(5deg) translateX(190%) translateY(-130%)',
          }}
        />
        <img
          src="HERE" // Replace with your image URL
          alt="HERE Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            left: '-190px',
            bottom: '-140px',
            transform: 'rotate(5deg) translateX(190%) translateY(-130%)',
          }}
        /> */}
        {loggedInUserID ? (LoggedInNavBar(loggedInUserID, logout)) : ""}
      </nav>
    </div>
  );
}


function LoggedInNavBar(ID) {
  return (
    <div>
      <div className="col-span-4"> </div>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to={`/user/${ ID }`}>
        User Profile
      </NavLink>
    </div>
  )
}



function guestNavBar() {
  return (
    <div>
      <div className="col-span-3"> </div>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/login">
        Login
      </NavLink>
      <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/newuser">
        Create New User
      </NavLink>
    </div>
  )
}


