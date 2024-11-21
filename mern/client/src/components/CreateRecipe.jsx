import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const [messageData, setMessageData] = useState("");
  const userID = localStorage.getItem("userID");

  /*
  Error if user is not logged in
  */

  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
    image: null,
    userid: userID,
  });

  const [newIngredient, setNewIngredient] = useState("");

  const [newStep, setNewStep] = useState("");

  function addIngredient() {
      if (newIngredient === "") return;
      updateForm({ ingredients: [...form.ingredients, newIngredient ]})
      setNewIngredient("");
  }

  function removeIngredient(ingredient) {
    updateForm({ ingredients: form.ingredients.filter((i) => i !== ingredient)});
  }

  function addStep() {
    if (newStep === "") return;
    updateForm({ steps: [...form.steps, newStep ]});
    setNewStep("");
  }

  function removeStep(step) {
    updateForm({ steps: form.steps.filter((s) => s !== step)});
  }

  function removeImage() {
    updateForm({ image: null });
  }

  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.desc || !form.ingredients || !form.steps || !form.image) {
      setMessageData("form empty");
      return;
    }

    let recipe_response;
    
    //  Upload recipe (POST request)
    try {

      const recipe = new FormData();
      recipe.append("title", form.title);
      recipe.append("desc", form.desc);
      recipe.append("ingredients", JSON.stringify(form.ingredients));
      recipe.append("steps", JSON.stringify(form.steps));
      recipe.append("image", form.image);
      recipe.append("userid", form.userid);

      console.log("New recipe: \n" + recipe);

      recipe_response = await fetch("http://localhost:5050/createrecipe", {
        method: "POST",
        body: recipe,
      });

      if (recipe_response.status === 400) {
        setMessageData("recipe exists");
      } else if (!recipe_response.ok) {
        throw new Error(`HTTP error! status: ${recipe_response.status}`);
      } else {
        setMessageData("recipe created");
        setForm({ title: "", desc: "", ingredients: [], steps: [], image: null });
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    }

    const recipe_response_data = await recipe_response.json();
    const recipe_id = recipe_response_data.id;

    console.log("New recipe id: " + recipe_id);
    console.log("User id: " + userID);

    const user_url = "http://localhost:5050/user/" + userID;
    let user_get_response;
    let user_obj;

    //  Fetch user data (GET request)
    try {
      user_get_response = await fetch(user_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!user_get_response.ok) {
        throw new Error(`HTTP error! status: ${user_get_response.status}`);
      } else {
        setMessageData("user data fetched");
      }
    } catch (error) {
      console.error('A problem occured with your second fetch operation: ', error);
    }

    user_obj = await user_get_response.json();
    const payload = {
      password: user_obj.password,
      recipe_ids: [...user_obj.recipe_ids, recipe_id],
    };
    console.log(" Updated Recipe IDs: " + payload.recipe_ids);
    let user_patch_response;

    try {
      user_patch_response = await fetch(user_url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!user_patch_response.ok) {
        throw new Error(`HTTP error! status: ${user_patch_response.status}`);
      } else {
        setMessageData("user data patched");
      };
    } catch (error) {
      console.error('A problem occured with your third fetch operation: ', error);
    }

    console.log("reached here");
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create New Recipe</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Recipe Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              <strong>Title: </strong> {form.title || "Not provided"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              <strong>Description: </strong> {form.desc || "Not provided"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              <strong>Ingredients:</strong> {form.ingredients.length > 0
              ? form.ingredients.map((ingredient, index) => <li className="list-circle list-inside pl-4" key={index}>{ingredient} 
              <button className="ml-2 bg-gray-200 rounded-md px-1" onClick={() => removeIngredient(ingredient)} >Remove</button></li>)
              : "No ingredients added"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              <strong>Instructions:</strong> {form.steps.length > 0
              ? form.steps.map((step, index) => <li className="list-circle list-inside pl-4" key={index}>{step} 
              <button className="ml-2 bg-gray-200 rounded-md px-1" onClick={() => removeStep(step)} >Remove</button></li>)
              : "No steps added"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              <strong>Image:</strong> {form.image ? <button className="ml-2 bg-gray-200 rounded-md px-1" onClick={() => removeImage()} >
                Remove</button> : ""}
              {form.image ? <img className="max-w-40 max-h-40" src={URL.createObjectURL(form.image)}></img>: "Not provided"}
            </p>
          </div>

          <div className="grid max-w-2x2 grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-1">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Recipe title"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                  />
                </div>
              </div>
              {messageData == "recipe exists" ? <div className="text-sm text-red-600">Recipe already exists.</div> : ""}
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="desc"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Description
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="desc"
                    id="desc"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Recipe description"
                    value={form.desc}
                    onChange={(e) => updateForm({ desc: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Ingredients
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="ingredients"
                    id="ingredients"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Ingredients list"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                  />
                  <button type="button" onClick={addIngredient} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-md">
                    Add 
                  </button>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Instructions
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="steps"
                    id="steps"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Instructions"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                  />
                  <button type="button" onClick={addStep} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-md">
                    Add 
                  </button>
                </div>
              </div>
            </div>
            <div className="sm:col-span-1">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Image
              </label>
              <div className="mt-2">
                <div>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    placeholder="Recipe image"
                    onChange={(e) => updateForm({ image: e.target.files[0] })}
                  />
                  {/*Image preview*/}
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Create New Recipe"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}