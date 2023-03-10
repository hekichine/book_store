const express = require("express");
import bp from "body-parser";
import cors from "cors";
import path from "path";

const app = express();
const port = 8080;
import connect from "./connect/connectDB";
import authJWT from "./midleware/jwt";
import initRouter from "./route/appRoute";
import initCategoryRoutes from "./route/category";
import initOrderRoutes from "./route/order";
import initProductRoutes from "./route/product";
import initUserRoutes from "./route/user";

app.use(cors({ origin: true }));
app.options("*", cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
// authentication
// app.use(authJWT());

connect();
initRouter(app);
initProductRoutes(app);
initCategoryRoutes(app);
initUserRoutes(app);
initOrderRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
