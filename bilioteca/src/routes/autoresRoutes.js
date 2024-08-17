import express from "express";
import AutorController from "../controllers/autoresController.js";
import paginacao from "../middlewares/paginacao.js";

const router = express.Router();

router
	.get("/autores", AutorController.getAutores, paginacao)
	.get("/autores/busca", AutorController.getAutorByFilter)
	.get("/autores/:id", AutorController.getAutorById)
	.post("/autores", AutorController.createAutor)
	.put("/autores/:id", AutorController.updateAutor)
	.delete("/autores/:id", AutorController.deleteAutor);

export default router;   