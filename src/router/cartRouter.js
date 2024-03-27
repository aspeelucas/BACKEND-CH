import { Router } from "express";
import { CartManager } from "../controllers/carts-manager.js";

const cartManager = new CartManager();

export const cartRouter = Router();

// Obtiene todos los carritos

cartRouter.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  return res.json(carts);
});

// Obtiene un carrito por id

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await cartManager.getCart(cid);
  return res.json(carts);
});

// Agrega un producto a un carrito

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { pid, cid } = req.params;
  const quantity = req.body.quantity || 1;

  await cartManager.addProductToCart(cid, pid, quantity);
  const updatedCart = await cartManager.getCart(cid);
  return res.json({
    message: "El producto fue agregado con exito",
    updatedCart,
  });
});

// Elimina un producto de un carrito


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { pid, cid } = req.params;
  await cartManager.deleteProductFromCart(cid, pid);
  const updatedCart = await cartManager.getCart(cid);
  return res.json({
    message: "El producto fue eliminado con exito",
    updatedCart,
  });
});

// Elimina todos los productos de un carrito

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    await cartManager.deleteAllProductsFromCart(cid);
    const updatedCart = await cartManager.getCart(cid);
    return res.json({
      message: "Todos los productos fueron eliminados con exito",
      updatedCart,
    });
  } catch (error) {
    console.log("Error al eliminar todos los productos del carrito", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agrega un carrito

cartRouter.post("/", async (req, res) => {
  try {
    const cartId = await cartManager.addCart();
    return res.json({ message: "El carrito fue agregado con exito", cartId });
  } catch (error) {
    console.log("Error al agregar carrito", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

