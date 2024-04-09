import { Router } from "express";
import { userModel } from "../models/user.model.js";

export const sessionsRouter = Router();

// Registro de usuario
sessionsRouter.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    const userExists = await userModel.findOne({
      email: email,
    });
  

    if (userExists) {
      return res.status(400).send("El usuario ya existe");
    } else {
      const rol =
        email === "adminCoder@coder.com" && password === "adminCod3r123"
          ? "admin"
          : "user";

      const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        password,
        age,
        rol,
      });

      req.session.login = true;
      req.session.user = {
        ...newUser._doc,
      };

      return res.redirect("/products");
    }
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

// Login de usuario

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Usuario no encontrado");
    } else if (user.password !== password) {
      return res.status(401).send("Contraseña incorrecta");
    } else {
      req.session.login = true;
      req.session.user = {
        ...user._doc,
      };
      return res.redirect("/products");
    }
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

// Logout de usuario

sessionsRouter.get("/logout", async (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }

  res.redirect("/login");
});
