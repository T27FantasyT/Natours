const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB)


const port = 3000;
const hostName = "127.0.0.1";

app.listen(port, hostName, () => {
  console.log(`App running on port ${port}`);
});
