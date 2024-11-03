const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string
const uri =  
  "mongodb+srv://grouprojectsignup:JKkcnHlvLiDn7qKH@recipe-sharing-app.xa9wl.mongodb.net/?retryWrites=true&w=majority&appName=recipe-sharing-app";

const client = new MongoClient(uri);
                      
 async function run() {
    try {
        // Connect to the Atlas cluster
         await client.connect();

         // Get the database and collection on which to run the operation
         const db = client.db("recipe-sharing");
         const col = db.collection("users");

         // Create new documents                                                                                                                                         
         const userDocuments = [
           {
             "name": { "first": "Alan", "last": "Turing" },
             "password": "password",
             "recipe_ids": [ "Turing machine", "Turing test", "Turingery" ],
             "views": 1250000
           },
           {
             "name": { "first": "Grace", "last": "Hopper" },
             "password": "password",
             "recipe_ids": [ "Turing machine", "Turing test", "Turingery" ],
             "views": 3860000
           }
         ]

         // Insert the documents into the specified collection        
         const p = await col.insertMany(userDocuments);

         // Find the document
         const filter = { "name.last": "Turing" };
         const document = await col.findOne(filter);

         // Print results
         console.log("Document found:\n" + JSON.stringify(document));

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
