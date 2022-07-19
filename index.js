const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.gnh2i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("explorer");
        const blogCollection = db.collection("blogCollection");

        // API to Run Server 
        app.get("/", async (req, res) => {
            res.send("Server is Running");
        });

        // API to Get All Blogs
        app.get("/blogs", async (req, res) => {
            const blogs = await blogCollection.find({}).toArray();
            res.send(blogs);
        }
        );

        // API to Get Blog by Id
        app.get("/blogs/:id", async (req, res) => {
            const id = req.params.id;
            const blog = await blogCollection.findOne({ _id: ObjectId(id) });
            res.send(blog);
        }
        );
        

    }
    finally {
        // client.close(); 
    }
}

run().catch(console.dir);

app.listen(port, () => console.log(`Listening on port ${port}`));