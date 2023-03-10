import { expressjwt } from "express-jwt";
const secret = process.env.SECRET;
const authJWT = () => {
  return expressjwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: "/api/v1/products", methods: ["GET", "OPTIONS"] },
      "/api/v1/users/signin",
      "/api/v1/users/signup",
    ],
  });
};

export default authJWT;
