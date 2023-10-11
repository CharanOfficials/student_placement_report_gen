import session from 'express-session' // Use session to store cookie
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv' //to store env variables
import express from 'express'
import { connectUsingMongoose } from './config/mongoose.js' // mongoose connection for db
import expressEjsLayouts from 'express-ejs-layouts' 
import router from './router/index.router.js' //main router
import path from 'path' // To resolve paths
// server instance
const app = express()
// To parse the cookie
app.use(cookieParser())
dotenv.config() // To enable environment variables
// To store JWT in cookie 
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        // httpOnly: true
    }
}))
app.use(express.static(path.join(path.resolve(), 'public')))
// using body params
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// To setup the view engine
app.set('view engine', 'ejs')
// To setup the file paths
app.set('views', './view')
app.use(expressEjsLayouts) // To let server to load layout.ejs
// to add css and scripts under views in layout.ejs
app.set('layout extractStyles', true) 
app.set('layout extractScripts', true)
app.use('/', router) // To route to the index page
// To start server after DB connection only
const startServer = async () => {
    try {
        await connectUsingMongoose();
        app.listen(3000, () => {
        console.log("Server is listening at port no. 3000");
    })} catch (error) {
        console.error("An error occurred:", error);
        if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
    }
        process.exit(1)
    }
};

startServer()