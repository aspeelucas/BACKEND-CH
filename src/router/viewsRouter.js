import { Router } from "express";
import { ProductManager } from "../controllers/product-manager.js";

const productManger = new ProductManager("./src/models/productos.json");

export const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
  try {
    const products = await productManger.getProducts();
    res.render("home", { products, fileCss: "home.css" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("error al obtener productos ", error);
  }
});

viewRouter.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts", {
      fileCss: "realTimeProducts.css",
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("error al obtener productos ", error);
  }
});