import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const [messageData, setMessageData] = useState("");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
    image: null,
  });

  const [newIngredient, setNewIngredient] = useState("");

  const [newStep, setNewStep] = useState("");

  function addIngredient() {
      updateForm({ ingredients: [...form.ingredients, newIngredient ]})
      setNewIngredient("");
  }

  function addStep() {
    updateForm({ steps: [...form.steps, newStep ]})
    setNewStep("");
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

    const recipe = { 
      title: form.title,
      desc: form.desc,
      ingredients: form.ingredients,
      steps: form.steps,
      image: form.image,
    };

    console.log(recipe);
    
    try {
      let response;

      response = await fetch("http://localhost:5050/newrecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (response.status === 400) {
        setMessageData("recipe exists");
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        setMessageData("recipe created");
        setForm({ title: "", desc: "", ingredients: [], steps: [], image: null });
        navigate("/");
      }
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    }
  }

  console.log(form.ingredients);
  console.log(form.steps);

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
              someone cooked here 
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
                    onChange={(e) => updateForm({ image: e.target.value })}
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