import { Router } from "express";
import { ProductManager } from "../controllers/product-manager.js";

const productManger = new ProductManager("./src/models/productos.json");

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
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

productsRouter.get("/:pid", async (req, res) => {
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

productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productManger.addProduct(product);
    return res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const currentProduct = await productManger.getProductById(parseInt(pid));
    if (!currentProduct) {
      throw new Error("Producto no encontrado");
    }
    const productUpdate = req.body;
    const { title, price, description, thumbnail, code, stock, status } =
      productUpdate;
    if (
      !title ||
      !price ||
      !description ||
      !code ||
      !stock ||
      !status ||
      !thumbnail
    ) {
      throw new Error("Faltan campos obligatorios");
    }

    await productManger.udpateProduct(Number(pid), productUpdate);
    return res.json(productUpdate);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const productIdFound = await productManger.getProductById(Number(pid));

  if (productIdFound) {
    await productManger.deleteProduct(Number(pid));
    return res.json(productIdFound);
  }
  return res.status(404).json({ error: "El producto solicitado no existe" });
});
