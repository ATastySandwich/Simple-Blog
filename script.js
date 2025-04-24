import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const API_URL = "http://localhost:4000";
const app = express();
const port = 3000;

// Creating middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Starting the script.js, it is awaiting for something to get/post/patch/delete
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

// Get the posts from the database to show on the page apon loading into the website.
app.get("/", async (req, res) => {
  try {
    // This sends a request to the server, and stores the response in the variable
    // The respone should be all the blogs/posts
    const response = await axios.get("http://localhost:4000/posts");
    console.log(response);
    // This then renders the main page with the response data from the server
    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// The method to add a new blog
app.get("/add", (req, res) => {
  // This renders the "add" new blog ejs template
  res.render("add.ejs");
});

// Sending the blog data from the ejs file to the serer.
app.post("/post", async (req, res) => {
  // Getting the blogObject data from the ejs file.
  const blogObject = req.body;
  // Try catch to catch any errors incase the server goes wrong
  try {
    // This is sending the data that it got from the ejs file params, and throwing it into the server for processing
    const response = await axios.post(
      "http://localhost:4000/posts",
      blogObject,
    );
    // Then after that it returns to the main page
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating a post!" });
  }
});

// This is the delete the blog/post it uses a post method to send the id to the script then from there it goes to the server
app.post("/delete/:id", async (req, res) => {
  try {
    // This sends the id to the server and then the server will delete it
    await axios.delete(`http://localhost:4000/delete/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "The post could not be deleted" });
  }
});


//This is the edit method it sends the id to the server, the server responds with the post, then the script sends it to the edit page
app.get("/edit/:id" , async (req, res) =>{
  try {
    // Getting the post from the server, the server will respond with the data of the post
    const response = await axios.get(`http://localhost:4000/posts/${req.params.id}`);
    // Rendering the edit ejs and sending the response to the edit page to fill it out
    res.render("edit.ejs", {post: response.data});
  } catch (error) {
    res.status(500).send("Failed to load the edit form!")
  }
})

// Method to update a post
app.post("/update/:id", async (req, res) => {
  try {
    // Sends data to the server and the server updates it 
    await axios.patch(`http://localhost:4000/update/${req.params.id}`, {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    });
    //After updating it, it will render the index ejs again with the posts.
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to update the post.");
  }
});