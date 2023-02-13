import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { Express } from "express"
import { ClientEvents, ServerEvents } from "./events";
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';


export async function createApplication(
  httpServer: HttpServer,
  app: Express,
): Promise<Server<ClientEvents, ServerEvents, any, any>> {

  const CURRENCY_POSITION_ROOM = 'CURRENCY-POSITION'
  const FOREIGN_CURRENCY_ROOM = 'FOREIGN-CURRENCY'

  const io = new Server<ClientEvents, ServerEvents>(httpServer, {});
  const pubClient = createClient({ url: 'redis://localhost:6379'});
  const subClient = pubClient.duplicate();

  await pubClient.connect()
  await subClient.connect()
  
  io.adapter(createAdapter(pubClient, subClient));

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.on("connection", (socket) => {
    console.log("AQUI")
    socket.join(CURRENCY_POSITION_ROOM)
    socket.join(FOREIGN_CURRENCY_ROOM)

    

    socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
  });

  app.post("/room/:room/send-message", (req, res) => {
    const message = req.body;
    const room = req.params.room.toUpperCase();
    console.log(room)
    console.log(message)

    const event = room === CURRENCY_POSITION_ROOM ? CURRENCY_POSITION_ROOM : FOREIGN_CURRENCY_ROOM
    console.log(event)

    io.to(room).emit(event, message);

    res.sendStatus(200)
  }); 

  return io;
}
