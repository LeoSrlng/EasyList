import express from "express"
import cors from "cors"
import bodyParser from 'body-parser'
import router from './Routes/routes.js'
import middleware from "./controllers/middleware.js"

const app = express()

// On indique à express ou sont les fichiers statiques
app.use(express.static("public"))

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use(middleware)

app.use('/', router)

const PORT = process.env.PORT || 9300;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});