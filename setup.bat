cd ./mern/client
start cmd.exe /k "npm run dev"
cd ../server 
start cmd.exe /k "node --env-file=config.env server"
