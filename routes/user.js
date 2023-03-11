import { Router } from 'express';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
dotenv.config();
import authorizationMiddleWare from '../Middleware/authorization.js';
import UserModel from '../Model/user.js';
import MovieModel from '../Model/movie.js';

const userRoute = Router();

//============GET==============//
userRoute.get('/getList',authorizationMiddleWare,async(req,res)=>{
  try {
    const userList = await UserModel.find({},{email:1,_id:0,name:1,phone:1,dateOfBirth:1})
    res.send(userList)
  } catch (error) {
    // res.status(500).send('Internal server error')
  }
})


//============POST==============//


//============PATCH==============//

userRoute.patch(
  '/change-password',
  authorizationMiddleWare,
  async (req, res) => {
    const { password, newPassword } = req.body;
    const hash = await UserModel.findOne(
      { userName: res.user.userName },
      { password: 1, _id: 0 }
    );
    bcrypt.compare(password, hash?.password, (err, result) => {
      if (!result) {
        return res
          .status(402)
          .json({ type: 'error', message: 'Wrong password' });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newPassword, salt, function (err, hash) {
            UserModel.updateOne(
              { userName: res.user.userName },
              { password: hash }
            ).then((data) => {
              if (data?.modifiedCount) {
                res.status(200).json({
                  type: 'success',
                  message: 'Change password successfully.',
                });
              }
            });
          });
        });
      }
    });
  }
);

//============DE:ETE==============//
userRoute.delete('/delete/:email',authorizationMiddleWare,async(req,res)=>{
  try {
    const {email} = req.params
    const result = await UserModel.deleteOne({email})
    if(result.deletedCount){
      return res.send('Success')
    }
    res.status(400).send('email does not exist.')
  } catch (error) {
    res.status(500).send('Internal server error')
  }
})

export default userRoute;
