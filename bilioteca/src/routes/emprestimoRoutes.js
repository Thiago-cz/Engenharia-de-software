import express from "express";
import EmprestimoController from "../controllers/emprestimoController.js";
import paginacao from "../middlewares/paginacao.js";

const router = express.Router();

router
	.get("/emprestimos", EmprestimoController.getEmprestimos, paginacao)
	.get("/emprestimos/busca", EmprestimoController.getEmprestimosByFilter, paginacao)
	.get("/emprestimos/:id", EmprestimoController.getEmprestimoById)
	.post("/emprestimos", EmprestimoController.createEmprestimo)
	.post("/emprestimos/finalizar/:id", EmprestimoController.finalizarEmprestimo)
	.put("/emprestimos/:id", EmprestimoController.updateEmprestimo)
	.delete("/emprestimos/:id", EmprestimoController.deleteEmprestimo);

export default router;   