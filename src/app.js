import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { productsRouter } from "./router/productsRouter.js";
import { cartRouter } from "./router/cartRouter.js";
import { viewRouter } from "./router/viewsRouter.js";
import { ProductManager } from "./controllers/products-manager.js";
import { messageModel } from "./models/message.model.js";
import { connectDb } from "./database.js";

connectDb();

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const productManger = new ProductManager();

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

  // Get all products
  socket.emit("allProducts", await productManger.getProducts());

  // Add product

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
  });

  // Delete product
  socket.on("delete-product", async (id) => {
    try {
      await productManger.deleteProduct(id);
    } catch (error) {
      console.log(error);
    }
  });

  // Chat
  socket.on("message", async (data) => {
    await messageModel.create(data);

    const messages = await messageModel.find({}).lean();

    io.emit("messageLogs", messages);
  });
});

// handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
