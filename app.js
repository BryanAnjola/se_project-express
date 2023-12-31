require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const { limiter } = require("./utils/limiter");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");
app.use(express.json());
app.use(cors());
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.use(limiter);
// //app.use((err, req, res, next) => {
//   res.status(500).send({ message: 'An error occurred on the server' });
// });
app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
  console.log("this is working");
});
