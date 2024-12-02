// research using useEffect
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";

export default function UserProfile() {
  const [messageData, setMessageData] = useState("");
  const { loggedInUserID: loggedInUserID } = useOutletContext();
  const { id: profilePageID } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle form visibility
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;   // regex pattern for password validation

  const [form, setForm] = useState({
    name: "",
    username: "",
    new_password: "",
    confirm_password: "",
    curr_password: "",
  });

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const handleEditButtonClick = () => {
    setForm({
      name: "",        // Reset to current user values or empty string
      username: "",                 
      new_password: "",         // Leave password fields empty for security
      confirm_password: "",
      curr_password: "",
    });
    setMessageData(""); // Clear any previous messages
    setIsEditing(true); // Show the form
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    // Reset message data
    setMessageData("");

    // check if something is being changed
    if (form.username.trim() === "" && form.name.trim() === "" && form.new_password.trim() === "") {
      setMessageData("you have to change something");
      return;
    }

    // check if username already exists (get request)
    if (form.username.trim() != "") {
      fetch("http://localhost:5050/user/usernames")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch usernames: " + response.statusText);
        }
        return response.json();
      })
      .then((usernames) => {
        // Check if the username already exists
        const usernameExists = usernames.includes(form.username);

        if (usernameExists) {
          setMessageData("username exists");
          return;
        }
      })
      .catch((error) => {
        setMessageData("An error occurred while checking usernames. Please try again.");
        console.error("Error fetching usernames:", error);
      });
    }

    // check if password is valid
    if (form.new_password.trim() != "") {
      if (!passwordPattern.test(form.new_password)) {
        setMessageData("password not complex");
        return;
      } else if (form.new_password != form.confirm_password) {
        setMessageData("new passwords do not match");
        return;
      }
    } 

    // check if current password matches
    if (form.curr_password.trim() === "") {
      setMessageData("current password empty");
      return;
    }

    // create payload
    const updatedFields = {};
    if (form.username.trim() !== "") updatedFields.username = form.username;
    if (form.name.trim() !== "") updatedFields.name = form.name;
    if (form.new_password.trim() !== "") updatedFields.new_password = form.new_password;
    if (form.curr_password.trim() !== "") updatedFields.password = form.curr_password;

    // PATCH request
    fetch(`http://localhost:5050/user/${loggedInUserID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
    })
      .then(async (response) => {
      const response_data = await response.json();
      if (!response.ok) {
          setMessageData(response_data.msg);
          console.log(response_data.msg);
          console.error("unable to log in");
          throw new Error("Failed to update user: " + response.statusText);
        }
        return response_data;
      })
      .then((result) => {
        console.log("User updated successfully:", result);
        setIsEditing(false); // Hide the form after submission
      })
      .catch((error) => {
      console.error("Error updating user:", error);
      });

    setUser((prevUser) => ({
      ...prevUser,
      ...updatedFields, // Merge updated fields into the existing user data
    }));
  };

  // Fetch user details
  useEffect(() => {
    if (!loggedInUserID) {
      navigate("/user/login");
      return;
    }
    if (profilePageID && profilePageID == loggedInUserID) {
      console.log(profilePageID);
      navigate("/user/profile");
      return;
    }

    // get single user
    const userID = profilePageID ? profilePageID : loggedInUserID;
    fetch(`http://localhost:5050/user/${userID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => console.error('Error fetching user:', error));
  }, [loggedInUserID, profilePageID, navigate]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading user profile...</p>;
  }


  // Gets recipes linked to user
  const RecipeList = () => {
    const [recipes, setRecipes] = useState([]); // Store fetched recipes
    const [error, setError] = useState(null);  // Store error message (if any)
    const [loading, setLoading] = useState(true); // Store loading state
  
    // Function to fetch recipes
    const fetchRecipes = async (ids) => {
      try {
        console.log(ids);
        // Fetch all recipes concurrently and parse JSON responses
        return await Promise.all(
          ids.map((id) =>
            fetch(`http://localhost:5050/recipe/${id}`).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch recipe with ID: ${id}`);
              return res.json();
            })
          )
        );
      } catch (error) {
        console.error("Error fetching recipes:", error);
        console.log(error);
        throw error; // Rethrow to handle in calling code
      }
    };
  
    useEffect(() => {
      // Fetch recipes when the component mounts
      fetchRecipes(user.recipe_ids)
        .then((fetchedRecipes) => {  // Update state with fetched recipes
          setRecipes(fetchedRecipes); // Update state with fetched recipes
          setLoading(false); // Update loading state
        })         
        .catch((err) => { // Update error state if fetch fails
          setError(err.message)
          setLoading(false)
        }); 
    }, []); // Empty dependency array ensures this runs once on mount

    // Render recipes or show error
    return (
      <div>
        <div className="border rounded-lg overflow-hidden p-4 mt-4 relative">
          <h3 className="text-lg font-semibold pb-2">
            My Recipes
          </h3>
          {(user._id == loggedInUserID) ? (
            <Link to="/recipe/create" className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4 absolute top-0 right-4">
              Create Recipe
            </Link>
          ) : (
            ""
          )}
          <div>
            {displayRecipes(error, recipes, loading)}
          </div>
        </div>
      </div>
    );
  };

  // Gets recipes saved by user
  const SavedRecipeList = () => {
    const [recipes, setRecipes] = useState([]); // Store fetched recipes
    const [error, setError] = useState(null);  // Store error message (if any)
    const [loading, setLoading] = useState(true); // Store loading state
  
    // Function to fetch recipes
    const fetchRecipes = async (ids) => {
      try {
        console.log(ids);
        // Fetch all recipes concurrently and parse JSON responses
        return await Promise.all(
          ids.map((id) =>
            fetch(`http://localhost:5050/recipe/${id}`).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch recipe with ID: ${id}`);
              return res.json();
            })
          )
        );
      } catch (error) {
        console.error("Error fetching recipes:", error);
        console.log(error);
        throw error; // Rethrow to handle in calling code
      }
    };
  
    useEffect(() => {
      // Fetch recipes when the component mounts
      fetchRecipes(user.saved_recipe_ids)
        .then((fetchedRecipes) => {  // Update state with fetched recipes
          setRecipes(fetchedRecipes); // Update state with fetched recipes
          setLoading(false); // Update loading state
        })         
        .catch((err) => { // Update error state if fetch fails
          setError(err.message)
          setLoading(false)
        }); 
    }, []); // Empty dependency array ensures this runs once on mount

    // Render recipes or show error
    return (
      <div>
        <div className="border rounded-lg overflow-hidden p-4 mt-4 relative">
          <h3 className="text-lg font-semibold pb-2">
            Saved Recipes
          </h3>
          <div>
            {displaySavedRecipes(error, recipes, loading)}
          </div>
        </div>
      </div>
    );
  };

  // changed such that RecipeList only renders when profile is not being edited
  return (
    <div>
      {!isEditing ? (profilePage(user, loggedInUserID, handleEditButtonClick, RecipeList, SavedRecipeList)) : (profileEdit(user, handleFormSubmit, form, setIsEditing, updateForm, messageData))}
    </div>
  );
}

function profilePage(user, loggedInUserID, handleEditButtonClick, RecipeList, SavedRecipeList) {
  return (
    <div>
      <div className="border rounded-lg overflow-hidden p-4 relative">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div className="col-span-1 grid grid-cols-1 gap-x-8 gap-y-2">
            <div className="flex items-center space-x-1">
              <h3 className="text-lg font-semibold pb-2">
                {user.name}'s profile
              </h3>
            </div>
            <div className="flex items-center space-x-1">
              <h2 className="text-base font-semibold leading-7 text-slate-900">
                Username:
              </h2>
              <span className="text-base text-slate-900" >
                {user.username}
              </span>
            </div>
            {/* LIST RECIPE IDS (DEPRECATE LATER) */}
            {/* <div className="flex items-center space-x-1">
              <h2 className="text-base font-semibold leading-7 text-slate-900">
                Recipe IDs:
              </h2>
              <span className="text-base text-slate-900" >
                {user.recipe_ids}
              </span>
            </div> */}
          </div>
          {(user._id == loggedInUserID) ? (
            <div className="text-right absolute top-0 right-4">
              <input
                type="button"
                value="Edit Profile"
                onClick={handleEditButtonClick}
                className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <RecipeList />
      {(user._id == loggedInUserID) ? (<SavedRecipeList />) : ("")}
    </div>
  )
}

function profileEdit(user, handleFormSubmit, form, setIsEditing, updateForm, messageData) {
  return (
    <form
      onSubmit={handleFormSubmit}
      className="grid gap-y-2 gap-x-8 border rounded-lg overflow-hidden p-4"
    >
      <h2 className="text-lg font-medium mb-4">Edit Profile</h2>
      {messageData == "you have to change something" ? <div className="text-sm text-red-600">A new username, name, or password must be specified.</div> : ""}

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
      {messageData == "username exists" ? <div className="text-sm text-red-600">Username already exists.</div> : ""}

      <label
        htmlFor="Name"
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

      <label
        htmlFor="new_password"
        className="block text-sm font-medium leading-6 text-slate-900"
      >
        New Password
      </label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input
            type="password"
            name="new_password"
            id="new_password"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Enter password"
            value={form.new_password}
            onChange={(e) => updateForm({ new_password: e.target.value })}
          />
        </div>
      </div>
      <div className="text-sm">
        Password must contain at least 8 characters, and at least one letter and one number.
      </div>
      {messageData == "password not complex" ? <div className="text-sm text-red-600">Password does not meet complexity requirements.</div> : ""}

      <label
        htmlFor="confirm_password"
        className="block text-sm font-medium leading-6 text-slate-900"
      >
        Confirm New Password
      </label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder=""
            value={form.confirm_password}
            onChange={(e) => updateForm({ confirm_password: e.target.value })}
          />
        </div>
      </div>
      {messageData == "new passwords do not match" ? <div className="text-sm text-red-600">Passwords do not match.</div> : ""}

      <label
        htmlFor="curr_password"
        className="block text-sm font-medium leading-6 text-slate-900"
      >
        Current Password
      </label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input
            type="password"
            name="curr_password"
            id="curr_password"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder=""
            value={form.curr_password}
            onChange={(e) => updateForm({ curr_password: e.target.value })}
          />
        </div>
      </div>
      {messageData == "current password empty" ? <div className="text-sm text-red-600">You must enter your current password.</div> : ""}
      {messageData == "incorrect password" ? <div className="text-sm text-red-600">Password does not match.</div> : ""}

      <div className="flex justify-end space-x-2">
        <input
          type="button"
          onClick={() => setIsEditing(false)}
          value="Cancel"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
        <input
          type="submit"
          value="Submit"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </div>
    </form>
  )
}

// Separate function to display recipes or error message
function displayRecipes(error, recipes, loading) {
  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  } else if (loading) {
    return <p>Loading recipes...</p>;
  } else if (!recipes || recipes.length === 0) {
    return <p>No recipes found. Try creating a recipe!</p>;
  }
  return (
    <div className="p-4">
      {/* Grid Container */}
      <div className="grid md:grid-cols-3 gap-4 sm:grid-cols-2">
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

// Separate function to display recipes or error message
function displaySavedRecipes(error, recipes, loading) {
  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  } else if (loading) {
    return <p>Loading recipes...</p>;
  } else if (!recipes || recipes.length === 0) {
    return <p>No recipes saved. Try saving a recipe!</p>;
  }
  return (
    <div className="p-4">
      {/* Grid Container */}
      <div className="grid md:grid-cols-3 gap-4 sm:grid-cols-2">
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