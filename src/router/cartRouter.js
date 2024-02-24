import { Router } from "express";
import { CartManager } from "../controllers/cart-manager.js";

const cartManager = new CartManager("./src/models/carrito.json");

export const cartRouter = Router();

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const carts = await cartManager.getCart(cid);
  return res.json(carts);
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { pid, cid } = req.params;

  await cartManager.addProductToCart(cid, pid);
  const updatedCart = await cartManager.getCart(cid);
  return res.json({
    message: "El producto fue agregado con exito",
    updatedCart,
  });
});

cartRouter.post("/", async (req, res) => {
  const cartId = await cartManager.addCart();
  return res.json({ message: "El carrito fue agregado con exito", cartId });
});
