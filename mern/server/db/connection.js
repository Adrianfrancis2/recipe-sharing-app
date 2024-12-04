import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";
//create new MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  //connect client to the server
  await client.connect();
  //Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
    "Successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

//set up reference to "recipe-sharing" database 
let db = client.db("recipe-sharing");

//export database instance for use in other files
export default db;