import jwt from 'jsonwebtoken';

function authorizationMiddleWare(req, res, next) {
  const authorization = req.headers?.authorization?.split(' ')[1] || '';
  jwt.verify(authorization, process.env.TOKEN_ACCESS_KEY, function (err, data) {
    if (err) res.status(403).json('Token invalid');
    if (data) {
      res.user = data;
      next();
    }
  });
}
export default authorizationMiddleWare;
