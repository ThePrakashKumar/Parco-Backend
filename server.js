const express = require("express");
const env = require("dotenv");

const connect = require("./db/connect");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");

// configure
const app = express();
env.config();
connect();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Parco Backend ");
});

// Routes
app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(process.env.PORT || 5050, () => {
    console.log("Server Has Started ");
});
