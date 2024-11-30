import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

//handles login functionality
export default function LoginUser({ setLogin }) {
  const [messageData, setMessageData] = useState("");
  const {loggedInUserID, setLoggedInUserID} = useOutletContext();

  //contents of the form
  //form is an object representing login form fields
  const [form, setForm] = useState({
      username: "",
      password: "",
  });

  //redirect users after a succeessful login to homepage
  const navigate = useNavigate();

  function updateForm(value) {
      return setForm((prev) => {
        return { ...prev, ...value };
      });
  }

  // redirect to user profile page if user is logged in
  if (loggedInUserID) {
    navigate(`/user/${loggedInUserID}`);
  } 

  async function onSubmit(e) {
    //no reloading page when form submitted
    e.preventDefault();
    //function to reset messageData to empty string before processing the form
    setMessageData("");

    if (!form.username || !form.password) {
      setMessageData("form empty");
      return;
    }

    //create person object with username & password
    const person = { 
      username: form.username,
      password: form.password,
    };

    try {
      let response;
      response = await fetch("http://localhost:5050/login", { //sends HTTP POST request to login
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      let response_data = await response.json();

      //validating response then continues based on boolean evalution 
      if (!response.ok) {
        setMessageData(response_data.msg);
        console.log(messageData);
        console.log("unable to log in");
        // throw new Error(`HTTP error! status: ${response_data.msg}`);
      } else {
        setMessageData(response_data.msg.name);

        localStorage.setItem("userID", response_data.msg._id); // TODO: implement JWT? 
        setLoggedInUserID(response_data.msg._id);
        
        setForm({ username: "", password: "" });
        navigate("/");
        return;
      }

    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    }

  }

  //display the form that takes the input from the user.
    //each part of form broken down into sections
      //can change specifications of each display section
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Login to Existing Account</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
                Login
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Welcome back! Log in to see the latest new recipes!
            </p>
          </div>

          <div className="grid max-w-2x2 grid-cols-1 gap-x-6 gap-y-8 ">
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
              {messageData == "user not found" ? <div className="text-sm text-red-600">Username not found.</div> : ""}
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Password
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                  />
                </div>
              </div>
              {messageData == "incorrect password" ? <div className="text-sm text-red-600">Password is Incorrect.</div> : ""}
            </div>
            
          </div>
        </div>
        <input
          type="submit"
          value="Login"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
        {messageData == "form empty" ? <div className="text-sm text-red-600">Please fill out all fields.</div> : ""}
      </form>
    </>
  );
}