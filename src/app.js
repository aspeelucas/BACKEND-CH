import express from "express";
import { ProductManager } from "./controllers/product-manager.js";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productManger = new ProductManager("./src/models/productos.json");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManger.getProducts();
    if (limit) {
      return res.json(products.slice(0, limit));
    }
    return res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManger.getProductById(parseInt(pid));
    if (product) {
      return res.json(product);
    }
    return res.status(404).json({ error: "Producto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
