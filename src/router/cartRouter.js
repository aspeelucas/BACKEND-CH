import { Router } from "express";
import { CartManager } from "../controllers/carts-manager.js";

const cartManager = new CartManager();

export const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  return res.json(carts);
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await cartManager.getCart(cid);
  return res.json(carts);
});

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

cartRouter.post("/", async (req, res) => {
  try {
    const cartId = await cartManager.addCart();
    return res.json({ message: "El carrito fue agregado con exito", cartId });
  } catch (error) {
    console.log("Error al agregar carrito", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
