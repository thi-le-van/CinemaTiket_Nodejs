import { WebSocketServer } from 'ws';
import commentsModel from './Model/comments.js';

const wss = new WebSocketServer({
  port: 9000,
});

wss.on('connection', function connection(client) {
  client.on('message', async function message(data, isBinary) {
    let message = isBinary ? data : data.toString();
    const payload = JSON.parse(message);

    //add comment
    if (payload.type === 'addComment') {
      message = JSON.parse(message);
      try {
        const uploaded = await commentsModel.create(payload);
        [...wss.clients].forEach((c) => {
          c.send(
            JSON.stringify({
              ...message,
              _id: uploaded._id,
              createdAt: uploaded.createdAt,
            })
          );
        });
      } catch (error) {}
    }
    //delete comment
    else if (payload.type === 'deleteComment') {
      [...wss.clients].forEach((c) => {
        c.send(
          JSON.stringify({
            type: payload.type,
            _id: payload._id,
          })
        );
      });
    }
  });
});

const server = (app) => {
  app.listen(process.env.PORT || 3000, (err) => {
    if (err) throw new Error(err);
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

export default server;
