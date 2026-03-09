import express from 'express'
import "dotenv/config"

const PORT = process.env.PORT || 3301

const server = express();

if(!PORT){
    throw new Error
}

server.listen(PORT, ()=>{
    console.log(`Server is running at: http://localhost:${PORT}`)
})