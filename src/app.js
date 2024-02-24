import express from "express";
import { productsRouter } from "./router/productsRouter.js";
import { cartRouter } from "./router/cartRouter.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
