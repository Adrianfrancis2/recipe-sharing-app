#!/bin/bash
cd ./mern/client
(
    npm run dev
) &
cd ../server
node --env-file=config.env server
