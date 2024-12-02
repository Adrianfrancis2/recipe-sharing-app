import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";

//RecipeCard: displays information about specific recipe 

//defines React component 
export default function RecipeCard() {
  const { loggedInUserID } = useOutletContext();
  const { id: recipeID } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [recipeAuthor, setRecipeAuthor] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // TODO: add functionality to copy/edit recipes?

  useEffect(() => {
    if (!loggedInUserID) {
      navigate("/user/login"); //navigate to user login page
      return;
    }

    // get recipe
    fetch(`http://localhost:5050/recipe/${recipeID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipe: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setRecipe(data);
      })
      .catch(error => console.error('Error fetching recipe:', error));
    
    if (recipe) {
      // get recipe author
      fetch(`http://localhost:5050/user/${recipe.userid}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipe author: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setRecipeAuthor(data);
      })
      .catch(error => console.error('Error fetching recipe author:', error));
    }

  }, [loggedInUserID, recipeID, navigate]);

  useEffect(() => {
    if (recipe && recipe.userid) { //checks object is not null or undefined
      //get recipe author (with userid)
      fetch(`http://localhost:5050/user/${recipe.userid}`) //construct URL using userid and recipe
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipe author: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setRecipeAuthor(data); //updates recipeAuthor
      })
      .catch(error => console.error('Error fetching recipe author:', error));
    }
  }, [recipe]);

  //error handling
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipe) {
    return <p>Loading recipe...</p>;
  } 

  // console.log("recipeAuthor: " + recipeAuthor._id);
  // console.log("loggedIn: " + loggedInUserID);

  return (
    <div>
      {/* {!isEditing ? (profilePage(user, loggedInUserID, handleEditButtonClick)) : (profileEdit(user, handleFormSubmit, form, setIsEditing, updateForm, messageData))} */}
      {recipePage(recipe, recipeAuthor, loggedInUserID, navigate)}
    </div>
  );
}


//display detailed informationa bout recipe 
  //author, ingredients, steps, image etc
function recipePage(recipe, recipeAuthor, loggedInUserID, navigate) {
  const authorLine = recipeAuthor ? `Contributed by ${recipeAuthor.name} (@${recipeAuthor.username})` : "Contributer unknown"; //creates string with author's name & username
  const imageSrc = (recipe.image) ? (`data:image/jpeg;base64,${recipe.image}`) : null; //converts image data into a data URI
  const ingredients = JSON.parse(recipe.ingredients);
  const ingredientsLeft = ingredients.slice(0, Math.ceil(ingredients.length / 2));
  const ingredientsRight = ingredients.slice(Math.ceil(ingredients.length / 2), ingredients.length);
  const steps = JSON.parse(recipe.steps); //convert JSON string into array of steps used to dispaly recipe instructions

  async function deleteRecipe(recipe, recipeAuthor, navigate) {
    try {
      const response = await fetch(`http://localhost:5050/recipe/${recipe._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        const userPayload = {
          password: recipeAuthor.password,
          recipe_ids: recipeAuthor.recipe_ids.filter(id => id !== recipe._id),
        };
        try {
          const response = await fetch(`http://localhost:5050/user/${recipeAuthor._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPayload),
          });
          if (response.ok) {
            const userResult = await response.json();
            console.log("Recipe deleted successfully:", result);
            alert("Recipe deleted successfully!");
            navigate("/user/profile");
          } else {
            console.error("Failed to update user:", await response.text());
            alert("Failed to delete recipe. Please try again.");
          };
        } catch (error) {
          console.error("Failed to update user:", await response.text());
        }
      } else {
        console.error("Failed to delete recipe:", await response.text());
        alert("Failed to delete recipe. Please try again.");
      }
    } catch (err) {
      console.error("Error during deletion:", err);
      alert("An error occurred while deleting the recipe. Please try again.");
    }
  }

  async function saveRecipe(recipe) {
    const user_url = "http://localhost:5050/user/" + loggedInUserID;
    let user_get_response;
    let user_obj;

    //  Fetch user data (GET request)
    try {
      //make HTTP Request
      user_get_response = await fetch(user_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //check if boolean response was successful 
      if (!user_get_response.ok) {
        throw new Error(`HTTP error! status: ${user_get_response.status}`);
      } else {
        console.log("user data fetched");
      }
    } catch (error) {
      console.error('A problem occured with your second fetch operation: ', error);
    }

    user_obj = await user_get_response.json();
    //prepare payload for updating user data
    const payload = {
      //password retains the current password from user data
      password: user_obj.password,
      saved_recipe_ids: user_obj.saved_recipe_ids.includes(recipe._id) ? [...user_obj.saved_recipe_ids] : [...user_obj.saved_recipe_ids, recipe._id],
    };
    
    //perform a patch request to update user data
    let user_patch_response;

    try {
      user_patch_response = await fetch(user_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        //converts payload aboject into JSON string 
        body: JSON.stringify(payload),
      });
      if (!user_patch_response.ok) {
        throw new Error(`HTTP error! status: ${user_patch_response.status}`); //throw error with HTTP status code 
      } else {
        console.log("user data patched");
      };
    } catch (error) {
      console.error('A problem occured with your third fetch operation: ', error);
    }
  }
  

  //display
  return (
    <div className="flex justify-center min-h-full items-center">
      <div className="border rounded-lg overflow-hidden p-4 w-full h-full max-w-2xl bg-white shadow-md grid">
        <div className="col-span-1 grid grid-cols-1 gap-x-8 gap-y-2">
          <div className="flex items-center space-x-1">
            <h2 className="text-xl font-semibold">
              {recipe.title}
            </h2>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base text-slate-900">
              {recipe.desc}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-base text-slate-900">
              {recipeAuthor ? (
                <>
                  Contributed by <strong className="font-semibold">
                    {recipeAuthor.name}
                    </strong> (<Link to={`/user/${recipeAuthor._id}`}>
                    @{recipeAuthor.username}
                    </Link>)
                </>
              ) : ("Contributer unknown")}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {imageSrc ? 
              <img className="w-full py-4 max-w-full max-h-full object-contain rounded" 
                src={imageSrc} 
                alt="very scrumptious image of recipe" /> 
              : ""}
          </div>

          <h2 className="text-base font-semibold leading-7 text-slate-900 pt-4">
            Ingredients:
          </h2>
          <div className="grid grid-cols-2 divide-x divide-slate-300">
            <div className="pr-4">
              {ingredientsLeft.map((ingredient, index) => (
                <span key={index} className="text-slate-900">
                  {ingredient}
                  {index < ingredientsLeft.length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="pl-4">
              {ingredientsRight.map((ingredient, index) => (
                <span key={index} className="text-slate-900">
                  {ingredient}
                  {index < ingredientsRight.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-base font-semibold leading-7 text-slate-900 pt-4">
            Directions:
          </h2>
          <div className="flex items-center space-x-1">
            <span className="list-decimal pl-4 space-y-2">
              {steps.map((step, index) => (
                <li key={index} className="text-slate-900">{step}</li>
              ))}
            </span>
          </div>
          <div className="pt-4 flex justify-end">
            {recipeAuthor && loggedInUserID == recipeAuthor._id ? (
              <button className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-400 bg-red-400 text-white hover:bg-red-600 h-9 rounded-md p-4" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
                  deleteRecipe(recipe, recipeAuthor, navigate);
                }
              }}>
                Delete
              </button>) 
              : (
              <button className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-400 bg-blue-400 text-white hover:bg-blue-600 h-9 rounded-md p-4" 
              onClick={() => {
                if (window.confirm('Save recipe?')) {
                  saveRecipe(recipe);
                }
              }}>
                Save
              </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
