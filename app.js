const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const bodyParser=require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
app.use(jsonParser);
app.use(urlencodedParser);
const db = mongoose.connection;
main().catch(err => console.log(err));
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log("we are connected") });
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ContactGymWebsite');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const port = 80;
const firstSchema = new mongoose.Schema({
     name: String,
     age:String,
     gender:String,
     phone:String,
     email:String
    });
const first = mongoose.model('first', firstSchema);
app.use(`/static`, express.static(`static`));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('home.pug', params)
})
app.get('/contact', (req, res) => {
    const params = {}
    res.status(200).render('contact.pug', params)
})
app.post('/contact', (req, res) => {
    console.log(req.body);
    var myData=new first(req.body);
    myData.save().then(()=>{res.send("item could be saved")
    }).catch(()=>{res.status(400).send("item could not be saved")});
})
app.listen(port, () => { console.log(`the application started succesfully on port ${port}`) })