"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplication = void 0;
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
async function createApplication(httpServer, app) {
    const CURRENCY_POSITION_ROOM = 'CURRENCY-POSITION';
    const FOREIGN_CURRENCY_ROOM = 'FOREIGN-CURRENCY';
    const io = new socket_io_1.Server(httpServer, {});
    const pubClient = (0, redis_1.createClient)({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });
    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });
    io.on("connection", (socket) => {
        console.log("AQUI");
        socket.join(CURRENCY_POSITION_ROOM);
        socket.join(FOREIGN_CURRENCY_ROOM);
        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });
    app.post("/room/:room/send-message", (req, res) => {
        const message = req.body;
        const room = req.params.room.toUpperCase();
        console.log(room);
        console.log(message);
        const event = room === CURRENCY_POSITION_ROOM ? CURRENCY_POSITION_ROOM : FOREIGN_CURRENCY_ROOM;
        console.log(event);
        io.to(room).emit(event, message);
        res.sendStatus(200);
    });
    return io;
}
exports.createApplication = createApplication;
