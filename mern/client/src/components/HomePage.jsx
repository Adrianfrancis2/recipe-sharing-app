import { useState, useEffect } from "react";
import { NavLink, useOutletContext, Link } from "react-router-dom";

export default function HomePage() {
  const { loggedInUserID: loggedInUserID } = useOutletContext();

  return (
    <div>
      {loggedInUserID ? (loggedInHomePage(displayRecipes)) : (guestHomePage())}
    </div>
  )
}

// homepage for logged-in user: display recipe cards
function loggedInHomePage (displayRecipes) {
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // get all recipes
    fetch("http://localhost:5050/recipe")
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipes: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error)
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {displayRecipes(error, recipes, loading)}
    </div>
  );
}

// function to display recipes or error message
function displayRecipes(error, recipes, loading) {
  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  } else if (loading) {
    return <p>Loading recipes...</p>;
  } else if (!recipes || recipes.length === 0) {
    return <p>No recipes found. Try creating a new one!</p>;
  }
  return (
    <div className="p-4">
      {/* Grid Container */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {/* Map over items */}
        {recipes.map((recipe, index) => (
          <Link
            key={index}
            to={`/recipe/${recipe._id}`}
            className="bg-gray-50 rounded shadow-md text-center flex flex-col items-center justify-center p-4 transition-transform transform hover:scale-105 duration-300"
          >
            {/* Image */}
            <div className="w-full h-40 flex items-center justify-center rounded">
              <img src={'data:image/jpeg;base64,' + recipe.image} 
                  className="max-w-full max-h-full object-contain rounded"
                  alt={`Recipe: ${recipe.title}`}/>
            </div>

            <h3 className="text-lg font-semibold mt-2">
              {recipe.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

// homepage for guest user
function guestHomePage () {
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
            left: 'calc(60% + 50px)',
            bottom: '70px',
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
            top: '10px',
            left: 'calc(40% + 50px)',
            bottom: '-140px',
            transform: 'rotate(5deg) translateX(190%) translateY(-130%)',
          }}
        /> 
        <img 
          src="https://cdn.icon-icons.com/icons2/1792/PNG/512/recipescookingbook_114713.png" // Replace with your image URL
          alt="Cook Book Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            top: '250px',
            left: 'calc(15% + 50px)',
            bottom: '-300px',
            transform: 'rotate(5deg)',
          }}
        />
        <img
          src="https://pixy.org/src/478/4786356.png" // Replace with your image URL
          alt="Ingredients Image"
          className="w-80 h-100 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            top: '250px',
            left: 'calc(-50% + 50px)',
            bottom: '-140px',
            transform: 'translateX(190%) translateY(-130%)',
          }}
        />
        <img
          src="https://pluspng.com/img-png/png-vegetables-and-fruits-black-and-white-pretty-local-fruit-vegetables-200.png" // Replace with your image URL
          alt="Vegtables Image"
          className="w-40 h-50 mt-60 ml-17"  // Add styling as needed
          style={{
            position: 'absolute',
            left: 'calc(25% + 50px)',
            bottom: '-200px',
            transform: 'rotate(5deg) translateX(190%) translateY(-130%)',
          }}
        /> 
        {/* {loggedInUserID ? (LoggedInNavBar(loggedInUserID, logout)) : ""} */}
      </nav>
    </div>
  );
}