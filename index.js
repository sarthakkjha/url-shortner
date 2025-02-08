const URL = require('./models/url')
const express = require('express');
const app = express();
const path = require('path')
const {restrictTrestrictToLoggedInUserOnly, checkAuth} = require('./middlewares/auth.js')
const urlRoute = require('./routes/url');
const cookieParser = require('cookie-parser')
const PORT = 8001;
const { connectToMongoDB } = require('./connect.js');
const staticRoute = require("./routes/staticrouter.js")
const userRoute = require(
  './routes/user'
)



app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));


app.use(express.json())
app.use(express.urlencoded({extended : false}));

app.use(cookieParser)


app.use("/url", restrictToLoggedInUserOnly,urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth,staticRoute);



app.get("tests", async(req, res)=>{
  const URLs = await URL.find({});

  res.render("home", {
    urls : allURLs,
  })
})

app.get('/url/:shortId', async (req, res)=>{
    const shortID = req.params.shortId;

    const entry = await URL.findOneAndUpdate({
        shortID,
    }, {
        $push:{
            visitHistory : {timestamp : Date.now()},
        }

    })
    res.redirect(entry.redirectURL);
})

connectToMongoDB('mongodb://localhost:27017/short-url')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});

