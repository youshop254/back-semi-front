require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const expressFileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3500
const route = require('./routes/UserRoute')
const catRoute = require('./routes/CategoryRoute')
const UploadRoute = require('./routes/UploadRoute')
const ProdRoute = require('./routes/ProductRoute')

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())
app.use(expressFileUpload({
    useTempFiles: true,

}))



app.use(route)
app.use(catRoute)
app.use(UploadRoute)
app.use(ProdRoute)




app.listen(port, () => {
    console.log(`your server is running on port ${port}`)
})
