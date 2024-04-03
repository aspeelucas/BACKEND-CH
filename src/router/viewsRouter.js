import { Router } from "express";
import { ProductManager } from "../controllers/products-manager.js";
import {CartManager} from "../controllers/carts-manager.js";

const productManger = new ProductManager();
const cartManager = new CartManager();

export const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
  try {
    const products = await productManger.getProducts();
    const productsFinal = products.map((product) => {
      const { ...rest } = product.toObject();
      return rest;
    });
    console.log(productsFinal);

    res.render("home", { products: productsFinal, fileCss: "home.css" });
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

viewRouter.get("/chat", async (req, res) => {
  try {
    res.render("chat", { fileCss: "chat.css" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("error al obtener productos ", error);
  }
});

viewRouter.get("/products", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit ;
  const sort = req.query.sort || undefined;
  const category = req.query.category ;
 
  const query = {};
  if (category) {
    query.category = category;
  }

  try {
    const products = await productManger.getProducts(limit, page, sort, query);
    
    const productsFinal = products.docs.map((product) => {
      const { ...rest } = product.toObject();
      return rest;
    });

    res.render("products", {
      status: "success",
      payload: productsFinal,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      currentPage: products.page,
      totalPages: products.totalPages,
      fileCss: "products.css",
      sort,
      categories: [
       "electrodomestico",
       "computadoras",
       "celulares",
      ],
      category
    });
  } catch (error) {}
});

// viewRouter.get("/carts/:cid", async (req, res) => {
//   const { cid } = req.params;
//   try {
//     const cart = await cartManager.getCart(cid);

//     res.render("cart", { cart: cart, fileCss: "cart.css" });
//   } catch (error) {
//     res.status(500).json({ error: "Error interno del servidor" });
//     console.log("error al obtener carrito ", error);
//   }
// });


viewRouter.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
     const carrito = await cartManager.getCart(cartId);

     if (!carrito) {
        console.log("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
     }

     const productosEnCarrito = carrito.products.map(item => ({
        product: item.product.toObject(),
        //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
        quantity: item.quantity
     }));


     res.render("cart", { productos: productosEnCarrito , fileCss: "cart.css"});
  } catch (error) {
     console.error("Error al obtener el carrito", error);
     res.status(500).json({ error: "Error interno del servidor" });
  }
});