import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import { join, dirname, resolve } from 'path'
import { Low, JSONFile } from 'lowdb'
import bodyParser from 'body-parser'
import ejs from 'ejs';

var urlencodedParser = bodyParser.urlencoded({ extended: false })  
const __dirname = dirname("./");

const file = join(__dirname, 'db.json')
const defaultFile = `{
    "posts": []
}`;

// création du fichier DB si manquant
try {
    if(!fs.existsSync(file)) {
        console.log('The file does not exist.');
        fs.writeFileSync(file, defaultFile);
        console.log('File is created successfully.');
    }
} catch (err) {
    console.error({err});
}

//initialisation
const adapter = new JSONFile(file)
const db = new Low(adapter)

const app = express();
const PORT = process.env.PORT

await db.read()

db.data = db.data || { posts: [] } 
var { posts } = db.data

app.set('view engine', 'ejs');
app.set('views', resolve( __dirname, 'views') );

app.get("/",(req,res) => {
    res.redirect("/home")
})

app.get("/home",(req,res) => {
    res.render("index", {})
})

app.get("/users",(req,res) => {
    res.render("users", {posts})
})

//getAll
app.get("/getAll",(req,res) => {
    res.send(posts)
})

//getCount
app.get("/getCount",(req,res) => {
    res.send({count:posts.length})
})

//registerUser
app.post('/registerUser',urlencodedParser, async (req,res) => {
    const {email, firstName, lastName} = req.body;
    console.log("POST/registerUser",{email, firstName, lastName})

    if( email == undefined || email == "" ||
        firstName == undefined || firstName == "" ||
        lastName == undefined || lastName == ""
    ){
        res.status(400).send("Champs manquants")
        return
    }
    if(posts == undefined){
        res.status(500).send("erreur database")
    }
    if(!posts.find(item => item.email == email)){
        posts.push({
            email,
            firstName,
            lastName
        })
        await db.write()
        res.status(201).send("Enregistré")
    }else{
        res.send("Déjà enregistré")
    }
})

//clear
app.delete("/",async (req,res) => {
    console.log("call delete")
    db.data = { posts: [] } 
    posts = db.data.posts
    await db.write()
    res.send("DB CLEAR")
})

app.listen(PORT, () => console.log(`Server started on port : ${PORT}`))
