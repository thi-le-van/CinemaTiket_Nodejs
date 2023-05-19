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
// const showTimes = [
//   {
//     _id: "6465ca2f6f635e1411281a49",
//     price: "123123",
//     timeStart: "01:51",
//     date: "2023-05-19T00:00:00.000Z",
//     idFilm: "645d30e1942c35069b6a1e32",
//     idRoom: "6465ca1c6f635e1411281a3a",
//   },
//   {
//     _id: "6465cba71c51915ae3a07fb6",
//     price: "5555",
//     timeStart: "01:56",
//     date: "2023-05-10T00:00:00.000Z",
//     idFilm: "645d30e1942c35069b6a1e32",
//     idRoom: "6465cb971c51915ae3a07fad",
//   },
// ];
// const rooms = [
//   {
//     _id: "6465cb971c51915ae3a07fad",
//     nameRoom: "333",
//     rows: "5",
//     columns: "5",
//     idTheater: "645bc3906bc7c6842639f1ad",
//   },
//   {
//     _id: "6465ca1c6f635e1411281a3a",
//     nameRoom: "123",
//     rows: "10",
//     columns: "10",
//     idTheater: "645bc181935d78c924a00b89",
//   },
// ];

// const theaters = [
//   {
//     _id: "64523c5a58f6db0929fc88c8",
//     idArea: "645021b587d2c72c870ad90b",
//     nameTheater: "123123",
//     address: "123123",
//   },
//   {
//     _id: "64523dc358f6db0929fc88d3",
//     idArea: "645021b587d2c72c870ad90b",
//     nameTheater: "1",
//     address: "123",
//   },
//   {
//     _id: "64523dd858f6db0929fc88d8",
//     idArea: "64523d7458f6db0929fc88cd",
//     nameTheater: "Vivo City",
//     address: "Nguyễn Văn Linh - Quận 7",
//   },
//   {
//     _id: "645bc181935d78c924a00b89",
//     idArea: "645bc17b935d78c924a00b84",
//     nameTheater: "3",
//     address: "3",
//   },
//   {
//     _id: "645bc3906bc7c6842639f1ad",
//     idArea: "645bc17b935d78c924a00b84",
//     nameTheater: "2",
//     address: "2",
//   },
//   {
//     _id: "645d4254af7753036bbc4d94",
//     idArea: "645cca7fc03e89fc10fc0113",
//     nameTheater: "123",
//     address: "321",
//   },
// ];

// const finalData = showTimes.map((showTime) => {
//   rooms.some((room) => {
//     if (room._id === showTime.idRoom) {
//       showTime.idTheater = room.idTheater;
//       showTime.nameRoom = room.nameRoom;

//       return true;
//     }

//     return false;
//   });

//   theaters.some((theater) => {
//     if (theater._id === showTime.idTheater) {
//       showTime.nameTheater = theater.nameTheater;
//       return true;
//     }
//     return false;
//   });

//   return showTime;
// });
// console.log(finalData);
export default server;
