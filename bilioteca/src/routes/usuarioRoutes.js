import express from "express";
import UsuarioController from "../controllers/usuarioController.js";
import paginacao from "../middlewares/paginacao.js";

const router = express.Router();

router
	.post("/user", UsuarioController.createUser)
	.delete("/user/:id",UsuarioController.deleteUser)
	.put("/user/:id", UsuarioController.updateUser)
	.get("/user",UsuarioController.getUsers,paginacao)
	.post("/login", UsuarioController.getUser);

export default router;   