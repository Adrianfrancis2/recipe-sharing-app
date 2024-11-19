// research using useEffect
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function UserProfile() {
    const { loggedInUserID } = useOutletContext();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // State to toggle form visibility

    const [form, setForm] = useState({
      name: "",
      username: "",
      password: "",
      new_password: "",
      confirm_password: "",
    });

    const handleEditButtonClick = () => {
      setIsEditing(true); // Show the form
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      setIsEditing(false); // Hide the form after submission
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
          {!isEditing ? (profilePage(user, handleEditButtonClick)) : (profileEdit(user, handleFormSubmit, form, setIsEditing))}
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

function profileEdit(user, handleFormSubmit, form, setIsEditing) {
  return (
  <form 
    onSubmit={handleFormSubmit} 
    className="grid gap-y-2 gap-x-8 border rounded-lg overflow-hidden p-4"
  >
    <h2 className="text-lg font-medium mb-4">Edit Profile</h2>

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

    <div className="flex justify-end space-x-2">
      <input
          type="submit"
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