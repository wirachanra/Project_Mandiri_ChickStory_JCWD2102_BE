const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();

const http = require("http")
const server = http.createServer(app)
const {Server} = require("socket.io")
const io = new Server(server, {cors: {origin: "*"}})
global.io = io

module.exports = { io }

dotenv.config();

const PORT = process.env.PORT;
const { sequelize } = require("./lib/sequelize");
const {
  postRoutes,
  userRoutes,
  commentRoutes,
  likeRoutes,
} = require("./routes");

// sequelize.sync({ alter: true }); sintax dibawah digunakan untuk mapping colom table untuk mencek dan update. jika sudah kita bisa commant agar
// tidak berat saat  running
// sequelize.sync({ alter: true });


app.use(cors());
cors: 
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);

app.use("/post_images", express.static(`${__dirname}/public/post_images`));
app.use("/profile_pict", express.static(`${__dirname}/public/profile_pict`));

app.get("/", (req, res) => {
  res.send("API is running");
});
//res.send bisa kepakai untuk di send jadi seperti db.json/ fake api

app.listen(PORT, () => {
  console.log("server is running in port " + PORT);
});
