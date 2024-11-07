import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex grid gap-3 grid-cols-6 justify-between mb-6">
        <NavLink to="/">
          <img alt="Sonic breaking it down for you" className="col-span-2 h-100 inline" src="https://media.tenor.com/T_vVVjbxS8sAAAAj/sonic-the-hedgehog-break-dance.gif"></img>
        </NavLink>
        <div className="col-span-3">
        </div>
        <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/login">
          Login
        </NavLink>
        <NavLink className="inline-flex justify-center items-center col-span-1 whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/newuser">
          Create New User
        </NavLink>
      </nav>
    </div>
  );
}