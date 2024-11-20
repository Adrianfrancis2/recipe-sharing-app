// research using useEffect
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function UserProfile() {
  const [messageData, setMessageData] = useState("");
  const { loggedInUserID } = useOutletContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle form visibility

  // regex pattern for password validation
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    new_password: "",
    confirm_password: "",
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
      password: "",                 // Leave password fields empty for security
      new_password: "",
      confirm_password: "",
    });
    setMessageData(""); // Clear any previous messages
    setIsEditing(true); // Show the form
  };



  const handleFormSubmit = (e) => {
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
    if (form.password.trim() === "") {
      setMessageData("current password empty");
      return;
    } else {
        if (form.password != user.password) {
        setMessageData("password does not match");
        return;
        }
    } 


    setIsEditing(false); // Hide the form after submission

    // check if something 

    // add form submission logic here (patch)
  };

  useEffect(() => {
    if (!loggedInUserID) {
      navigate(`/login`);
      return;
    }

    console.log(loggedInUserID);
    // get 
    fetch(`http://localhost:5050/user/${loggedInUserID}`)
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
  }, [loggedInUserID, navigate]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
      {!isEditing ? (profilePage(user, handleEditButtonClick)) : (profileEdit(user, handleFormSubmit, form, setIsEditing, updateForm, messageData))}
    </div>
  );
}

function profilePage(user, handleEditButtonClick) {
  return (
    <div className="border rounded-lg overflow-hidden p-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 border-b border-slate-900/10 pb-12 md:grid-cols-2">
        <div className="col-span-1 grid grid-cols-1 gap-x-8 gap-y-2">
          <div className="flex items-center space-x-1">
            <h3 className="text-lg font-semibold">
              User Profile
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Name:
            </h2>
            <span className="text-base text-slate-900" >
              {user.name}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Username:
            </h2>
            <span className="text-base text-slate-900" >
              {user.username}
            </span>
          </div>
        </div>
        <div className="col-span-1 text-right">
          <input
            type="button"
            value="Edit Profile"
            onClick={handleEditButtonClick}
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
          />
        </div>
      </div>
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
            type="text"
            name="password"
            id="password"
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
            type="text"
            name="username"
            id="username"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder=""
            value={form.confirm_password}
            onChange={(e) => updateForm({ confirm_password: e.target.value })}
          />
        </div>
      </div>
      {messageData == "new passwords do not match" ? <div className="text-sm text-red-600">Passwords do not match.</div> : ""}

      <label
        htmlFor="current_password"
        className="block text-sm font-medium leading-6 text-slate-900"
      >
        Current Password
      </label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          <input
            type="text"
            name="current_password"
            id="current_password"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder=""
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
          />
        </div>
      </div>
      {messageData == "current password empty" ? <div className="text-sm text-red-600">You must enter your current password.</div> : ""}
      {messageData == "password does not match" ? <div className="text-sm text-red-600">Password does not match.</div> : ""}

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