import { createServer } from "http";
import { createApplication } from "./app";
import  express from "express"

const app = express();
  
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const httpServer = createServer(app);


createApplication(
  httpServer,
  app
).then(() => {
  httpServer.listen(4000, ()=> {console.log("running")});
});





