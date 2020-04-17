const express = require("express");
const path = require("path")
const exphbs = require("express-handlebars")
const configRoutes = require("./routes");


const app = express();
app.use("/static", express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//handling syntax error throwed by body-parser
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).send({ status: 400, message: "Invalid json recieved." })
  } else {
    next();
  }
});
app.engine("hbs", exphbs({
  extname:'.hbs',
  defaultLayout: "main",
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, '/views'))
// exphbs.registerPartials(__dirname+'/views/partials')

configRoutes(app);

// const dbConnection = require('./config/mongoConnection');
// const data = require('./data/');

//test cases
const main = async () => {
  // const db = await dbConnection();
  // await db.dropDatabase();
  //  console.log('Done seeding database');
};
// main().catch((error) => {
//   console.log(error);
// });
app.listen(3000, () => {
  console.log("Initialization successed.");
  console.log("Routes is running on http://localhost:3000");
});