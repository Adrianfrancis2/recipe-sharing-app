# recipe-sharing-app
Recipe-sharing website created for Fall 2024 CS35L project

## To run the project locally: 
1. Clone this repository using the following terminal command: `git clone https://github.com/Adrianfrancis2/recipe-sharing-app`
2. Use `cd recipe-sharing-app` to change directory into the recipe-sharing-app directory
3. Setup and run the backend
    - In the current directory (recipe-sharing-app), run `cd ./mern/server`
    - Use `npm install` to install required node dependencies
    - To start the backend, run `node --env-file=config.env server`
4. Open a new terminal
5. Setup and run the frontend
    - From the recipe-sharing-app directory, use `cd ./mern/client` to change directory into the client directory
    - Use `npm install` to install required node dependencies
    - To start the frontend, run: `npm run dev`

The website will be hosted on http://localhost:5173/ if the port is available. If not, check the terminal output after npm run dev to see what port the site is hosted on.