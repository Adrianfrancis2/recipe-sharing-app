cd ./mern/client
start cmd.exe /k "npm install && npm run dev"
cd ../server
start cmd.exe /k "npm install && node --env-file=config.env server"