import express from 'express'
import cors from 'cors'
import { Mongo } from './database/mongo.js'
import dotenv from 'dotenv'
import authRouter from './auth/auth.js'
import usersRouter from './routes/users.js'
import platesRouter from './routes/plates.js'

dotenv.config()

async function main() {
    const hostname = 'localhost'
    const port = process.env.PORT || 3000

    const app = express()

    const mongoConnection = await Mongo.connect({
        mongoConnectionString: process.env.MONGO_CS,
        mongoDbName: process.env.MONGO_DB_NAME
    })
    
    if (mongoConnection?.error) {
        console.error(mongoConnection)
        process.exit(1)
    }

    console.log(mongoConnection)

    app.use(express.json())
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true
    }))

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'Welcome to Appname!'
        })
    })

    app.use('/auth', authRouter)
    app.use('/users', usersRouter)
    app.use('/plates', platesRouter)

    app.listen(port, () => {
        console.log(`Server running on: http://${hostname}:${port}`)
    })
}

main()
.catch(error => {
    console.error('Error starting the server:', error)
    process.exit(1)
})
