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
        <div>
          <h1>User Profile</h1>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>
      );
    }