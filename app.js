import 'dotenv/config'
import express from 'express'
import fs from 'fs'
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import bodyParser from 'body-parser'

var urlencodedParser = bodyParser.urlencoded({ extended: false })  
const __dirname = dirname("./");

const file = join(__dirname, 'db.json')
const defaultFile = `
{
    "posts": []
}
`;

try {
    if(!fs.existsSync(file)) {
        console.log('The file does not exist.');
        fs.writeFileSync(file, defaultFile);
        console.log('File is created successfully.');
    }
} catch (err) {
    console.error({err});
}

const adapter = new JSONFile(file)
const db = new Low(adapter)

const app = express();

const PORT = process.env.PORT

await db.read()

db.data = db.data || { posts: [] } 
var { posts } = db.data

app.get("/",async (req,res) => {
    res.send("GET/getAll \nPOST/registerUser {email, firstName, lastName}")
})

app.get("/getAll",async (req,res) => {
    console.log("GET/getAll")
    res.send(posts)
})

app.post('/registerUser',urlencodedParser, async (req,res) => {
    const {email, firstName, lastName} = req.body;
    console.log("POST/registerUser",{email, firstName, lastName})

    if( email == undefined ||
        firstName == undefined ||
        lastName == undefined
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

app.delete("/",async (req,res) => {
    console.log("pass in delete")
    db.data = { posts: [] } 
    posts = db.data.posts
    await db.write()
    console.log({posts})
    res.send("OK")
})

app.listen(PORT, () => console.log(`Server started on port : ${PORT}`))
