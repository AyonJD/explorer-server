const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000
// app.use(cors());
const corsFonfig = {
    origin: true,
    Credentials: true,
}
app.use(cors(corsFonfig));
app.options("*", cors(corsFonfig));
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.gnh2i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("explorer");
        const blogCollection = db.collection("blogCollection");
        const themeCollection = db.collection("themeCollection");
        const usersCollection = db.collection("usersCollection");

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

        //API to get themes
        app.get("/theme", async (req, res) => {
            const theme = await themeCollection.find({}).toArray();
            res.send(theme);
        }
        );

        // API to put theme state to mongoDB
        app.put('/theme/:id', async (req, res) => {
            const id = req.params.id;
            const theme = req.body;
            // console.log(id, theme);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: theme
            };
            const result = await themeCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })

        //POST single user information into mongoDB
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        }
        );

        //GET All users from mongoDB
        app.get("/users", async (req, res) => {
            const users = await usersCollection.find({}).toArray();
            res.send(users);
        }
        );

        //PUT api for update an user by email
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const user = req.body
            // console.log(user?.photoURL)
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {

                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            // const getToken = jwt.sign({ email: email }, process.env.TOKEN, { expiresIn: '1d' })
            res.send(result)
        })




    }
    finally {
        // client.close(); 
    }
}

run().catch(console.dir);

app.listen(port, () => console.log(`Listening on port ${port}`));