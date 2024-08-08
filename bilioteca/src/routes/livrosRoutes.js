import express from "express";
import LivroController from "../controllers/livrosController.js";
import paginacao from "../middlewares/paginacao.js";

const router = express.Router();

router
	.get("/livros", LivroController.getLivros, paginacao)
	.get("/livros/busca", LivroController.getLivroByFilter, paginacao)
	.get("/livros/:id", LivroController.getLivroById)
	.post("/livros", LivroController.createLivro)
	.put("/livros/:id", LivroController.updateLivro)
	.delete("/livros/:id", LivroController.deleteLivro);

export default router;   