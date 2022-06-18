import 'dotenv/config'
import express  from 'express'
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import bodyParser from 'body-parser'

var urlencodedParser = bodyParser.urlencoded({ extended: false })  
const __dirname = dirname("./");

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

const app = express();

const PORT = process.env.PORT

await db.read()

db.data = db.data || { posts: [] } 
const { posts } = db.data

app.get("/",async (req,res) => {
    res.send("GET/getAll \nPOST/registerUser {email, firstName, lastName}")
})

app.get("/getAll",async (req,res) => {
    res.send(posts)
})

app.post('/registerUser',urlencodedParser, async (req,res) => {
    const {email, firstName, lastName} = req.body;

    if( email == undefined ||
        firstName == undefined ||
        lastName == undefined
    ){
        res.status(400).send("Champs manquants")
        return
    }
    if(!posts.find(item => item.email == email)){
        posts.push({
            email,
            firstName,
            lastName
        })
        await db.write()
        res.status(201).send("saved")
    }else{
        res.send("Already saved")
    }
})

app.listen(PORT, () => console.log(`Server started on port : ${PORT}`))