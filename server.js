import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In memory store of some blogs to make it not seem so empty apon starting up

let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
  },
];

let lastId = 3;

// Creating middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get all the posts from the server
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Adding a new post
app.post("/posts", (req, res) => {
  const newId = (lastId += 1);
  const data = req.body;
  const post = {
    id: newId,
    title: data.title,
    content: data.blogContent,
    author: data.author,
  };
  lastId = newId;
  posts.push(post);
  res.status(201).json(post);
});

// Delete a post
app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  // After it finds it, it will remove it from the array
  if (searchIndex > -1) {
    posts.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({
      error: `Post with id: ${id} not found.
      No posts were deleted.`,
    });
  }
});

app.listen(port, () => {
  console.log(
    "Server/Api is running on port at http://localhost:" + port + " Enjoy!",
  );
});

// This method gets a single post to allow you to fill out the edit page with its data
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  // If the post is found, it sends it to the it back to the script
  if(post){
    res.json(post);
  } else {
    res.status(404).json({message: "Post could not be found!"});
  }
})

// This updates a post, it takes the data from the edit page and then updates the post
app.patch("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    };
    res.status(200).json(posts[index]);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});
