import nodemailer from "nodemailer";
import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (ve) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: ve.user, // list of receivers
    subject: "Cảm ơn bạn đã mua vé !!!!", // Subject line
    text: "Hello world?", // plain text body
    html: `<div>Đặt vé thành công</div> <div>
    <img src=${ve.hinhAnh} alt="" style={{width:"200px",height:"200px"}}></img>
       <p>ten phim: ${ve.tenPhim}</p>
       <p>ten rap: ${ve.tenRap}</p>
       <p>ten phong: ${ve.tenPhong}</p>
       <p>ghe: ${ve.ghe}</p>
       <p>ngay: ${ve.ngay?.slice(0, 10).split("-").reverse().join("/")}</p>
       <p>gia: ${parseInt(ve.gia).toLocaleString("vi", {
         style: "currency",
         currency: "VND",
       })}</p>
       <p>gio chieu: ${ve.gioChieu}</p>
     </div>`, // html body
  });
};

export default sendEmail;
