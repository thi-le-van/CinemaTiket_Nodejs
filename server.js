// import { WebSocketServer } from 'ws';
import { Server } from 'socket.io';
import http from 'http';
import commentsModel from './Model/comments.js';

const server = (app) => {
  //io
  const servers = http.createServer(app);
  const io = new Server(servers, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('subscribe', function (room) {
      console.log('joining room: ', room);
      socket.join(room);
    });
    socket.on('unsubscribe', function (room) {
      console.log('leaving room: ', room);
      socket.leave(room);
    });
    socket.on('sendDataClient', function (data) {
      const { type } = data.data;
      switch (type) {
        case 'addComment':
          io.in(data.room).emit('sendDataServer', {
            ...data.data,
          });
          break;
        case 'deleteComment':
          io.in(data.room).emit('sendDataServer', data.data);
          break;
        default:
          break;
      }
    });
  });

  //node server
  servers.listen(process.env.PORT || 3000, (err) => {
    if (err) throw new Error(err);
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

export default server;
