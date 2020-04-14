const express = require("express");
const path = require("path");
const hbs = require("hbs");
require('dotenv').config({ path: '.env' });
const Shorten = require("./modules/shorten.js");
const localurl = process.env.LOCALURL;


PORT = process.env.PORT || 5000;
const app = express();

const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const publicPath = path.join(__dirname, "../public");


app.set("view engine", "hbs");
app.set("views", viewsPath);

hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));
app.use(express.urlencoded())


app.post("/shorten", (req, res) => {
  var short = new Shorten(req.body)
  if (!short.isURL) {
    return res.send()
  }
  short.add()
  return res.render("index", {
    hash: short.hash,
    host: localurl,
    url: localurl + "go/" + short.hash
  })
})

app.get("/go/:hash", (req, res) => {
  var short = new Shorten()
  if (req.params.hash.length <= 8) {  // prevent server-load if user enter wrong hash format
    return res.send("Uuh Ooh Uuh - Not found")
  };
  var found = short.findByHash(req.params.hash)
  if (!found) {
    return res.send("Uuh Ooh Uuh - Not found")
  };
  res.redirect(found.url)
})

app.get("", (req, res) => {
  return res.render("index")
})

app.get("*", (req, res) => {
  return res.send("Uuh ooh Uuh - Not found");
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
