import { MongoClient, ServerApiVersion } from "mongodb";

//adding comments
//second comment
const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  //  Connect client to the server
  await client.connect();
  //  Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
    "Successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("recipe-sharing");

export default db;