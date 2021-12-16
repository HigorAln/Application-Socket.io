import { server } from "./http"
import "./websocket/ChatServices"

server.listen(3000, ()=> console.log(`Server Open on port ${3000}`))