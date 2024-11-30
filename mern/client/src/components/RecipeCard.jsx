import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

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

  return (
    <div>
      {/* {!isEditing ? (profilePage(user, loggedInUserID, handleEditButtonClick)) : (profileEdit(user, handleFormSubmit, form, setIsEditing, updateForm, messageData))} */}
      {recipePage(recipe, recipeAuthor)}
    </div>
  );
}


//display detailed informationa bout recipe 
  //author, ingredients, steps, image etc
function recipePage(recipe, recipeAuthor) {
  const authorLine = recipeAuthor ? `Contributed by ${recipeAuthor.name} (@${recipeAuthor.username})` : "Contributer unknown"; //creates string with author's name & username
  const imageSrc = (recipe.image) ? (`data:image/jpeg;base64,${recipe.image}`) : null; //converts image data into a data URI
  const ingredients = JSON.parse(recipe.ingredients);
  const ingredientsLeft = ingredients.slice(0, Math.ceil(ingredients.length / 2));
  const ingredientsRight = ingredients.slice(Math.ceil(ingredients.length / 2), ingredients.length);
  const steps = JSON.parse(recipe.steps); //convert JSON string into array of steps used to dispaly recipe instructions


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
                  Contributed by <strong className="font-semibold">{recipeAuthor.name}</strong> (@{recipeAuthor.username})
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
        </div>
      </div>
    </div>
  );
}
