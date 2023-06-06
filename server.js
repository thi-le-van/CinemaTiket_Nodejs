// import { WebSocketServer } from 'ws';
import { Server } from "socket.io";
import http from "http";
const server = (app) => {
  //io
  const servers = http.createServer(app);
  //node server
  servers.listen(process.env.PORT || 3000, (err) => {
    if (err) throw new Error(err);
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};
export default server;
