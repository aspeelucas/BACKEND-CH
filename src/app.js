import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { productsRouter } from "./router/productsRouter.js";
import { cartRouter } from "./router/cartRouter.js";
import { viewRouter } from "./router/viewsRouter.js";
import { ProductManager } from "./controllers/product-manager.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const productManger = new ProductManager("./src/models/productos.json");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewRouter);

// Socket.io
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");

  

  socket.on("new-product", async (data) => {
    console.log(data);

    data.price = Number(data.price);
    data.code = Number(data.code);
    data.stock = Number(data.stock);

    try {
      await productManger.addProduct(data);
    } catch (error) {
      console.log(error);
    }
  })

  socket.emit("allProducts", await productManger.getProducts());
});

// handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
