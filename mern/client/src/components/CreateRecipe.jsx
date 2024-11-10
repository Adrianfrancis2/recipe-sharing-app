import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
    image: null,
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   async function fetchData() {
  //     const id = params.id?.toString() || undefined;
  //     if(!id) return;
  //     setIsNew(false);
  //     const response = await fetch(
  //       `http://localhost:5050/user/${params.id.toString()}`
  //     );
  //     if (!response.ok) {
  //       const message = `An error has occurred: ${response.statusText}`;
  //       console.error(message);
  //       return;
  //     }
  //     const user = await response.json();
  //     if (!user) {
  //       console.warn(`Record with id ${id} not found`);
  //       navigate("/");
  //       return;
  //     }
  //     setForm(user);
  //   }
  //   fetchData();
  //   return;
  // }, [params.id, navigate]);

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
      alert("Please fill out all fields");
      return;
    }

    const recipe = { 
      title: form.title,
      desc: form.desc,
      ingredients: form.ingredients,
      steps: form.steps,
      image: form.image,
    };
    try {
      let response;

      response = await fetch("http://localhost:5050/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      if (response.status === 400) {
        alert("Recipe already exists"); //  change
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setForm({ title: "", desc: "", ingredients: [], steps: [], image: null });
      navigate("/");
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create New User Account</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
                Account Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              that is a made up name. what is your real name? 
            </p>
          </div>

          <div className="grid max-w-2x2 grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder=""
                    value={form.username}
                    onChange={(e) => updateForm({ username: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Set Password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Password must contain at least 8 characters, and at least one letter and number"
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="confirm_password"
                    id="confirm_password"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Re-enter your password"
                    value={form.confirm_password}
                    onChange={(e) => updateForm({ confirm_password: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Create New User"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}