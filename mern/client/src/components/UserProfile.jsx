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

    useEffect(() => {
    if (!loggedInUserID) {  
        navigate(`/login`);
        return;
      }     
    
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
        <div className="border rounded-lg overflow-hidden p-4">

          <div className="grid grid-cols-1 gap-x-8 gap-y-2 border-b border-slate-900/10 pb-12 md:grid-cols-2">
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
        </div>
      );
    }