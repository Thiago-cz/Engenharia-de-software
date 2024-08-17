import mongoose from "mongoose";
import NotFound from "../errors/NotFound.js";
import { emprestimos, livros } from "../models/index.js";

class EmprestimoController {

	static getEmprestimos = async (req, res, next) => {
		try {
			req.resultado = emprestimos;
			next();

		} catch (erro) {
			next(erro);
		}
	};

	static getEmprestimoById = async (req, res, next) => {
		try {
			const id = req.params.id;

			const emprestimoResultado = await emprestimos.findById(id)
				.populate("usuario", "nome")
				.populate("livro", "titulo valorMulta")
				.exec();
			if (emprestimoResultado !== null) {
				//calcular a multa para mostrar ao usuario
				let dataDevolucaoPrevista = new Date(emprestimoResultado.dataDevolucaoPrevista);
				let diasAtraso = new Date().getTime() - dataDevolucaoPrevista.getTime();

				diasAtraso = Math.ceil(diasAtraso / (1000 * 60 * 60 * 24));

				for (let i = 0; i < diasAtraso; i++) {
					emprestimoResultado.valorMulta = emprestimoResultado.valorMulta + (emprestimoResultado.livro.valorMulta * 0.1);
				}

				res.status(200).send(emprestimoResultado);
				return;
			}
			next(new NotFound("Id do emprestimo  não encontrado!!!"));

		} catch (erro) {
			next(erro);
		}
	};

	static createEmprestimo = async (req, res, next) => {
		try {

			let emprestimo = req.body;
			let dateNow = new Date();

			let emprestimosUsuario = await emprestimos.find({
				usuario: mongoose.Types.ObjectId(emprestimo.usuario),
				dataDevolucao: { $exists: false },
				dataDevolucaoPrevista: { $lte: dateNow }
			})
				.sort({ dataEmprestimo: 1 })
				.populate("livro", "titulo")
				.exec();
			if (emprestimosUsuario.length > 0) {
				//verificar se usuario deve algum livro
				let livrosPendentes = "";
				emprestimosUsuario.forEach((elem) => {
					livrosPendentes = `\n${livrosPendentes}${elem.livro.titulo}`;
				});

				res.status(401).send({ message: `Para realizar novos emprestimos voce deve devolver o(s) livro(s): ${livrosPendentes}` });
			}

			let livro = await livros.findById(emprestimo.livro)
				.populate("autor", "nome")
				.exec();
			if (livro.quantidadeEmprestada < livro.quantidade) {

				let dataDevolucaoPrevista = new Date(dateNow);

				dataDevolucaoPrevista.setDate(dateNow.getDate() + emprestimo.quantidadeDias);
				let novoEmprestimo = new emprestimos({
					livro: emprestimo.livro,
					usuario: emprestimo.usuario,
					dataEmprestimo: dateNow,
					dataDevolucaoPrevista: dataDevolucaoPrevista,
					valor: livro.preco * emprestimo.quantidadeDias
				});

				const emprestimoCriado = await novoEmprestimo.save();
				livros.updateOne(
					{ _id: mongoose.Types.ObjectId(emprestimo.livro) },
					{ $inc: { quantidadeEmprestada: 1 } }
				)
					.exec();
				res.status(201).send(emprestimoCriado.toJSON());
				return;
			}
			res.status(401).send({ message: "O livro solicitado não tem estoque para emprestimo!" });
		} catch (erro) {
			next(erro);
		}
	};

	static updateEmprestimo = async (req, res, next) => {
		try {
			const id = req.params.id;

			const resultEmprestimo = await emprestimos.findByIdAndUpdate(id, { $set: req.body });
			if (resultEmprestimo !== null) {
				res.status(200).send({ message: "Emprestimo atualizado com sucesso" });
				return;
			}
			next("Id do emprestimo  não encontrado!!!");
		} catch (erro) {
			next(erro);
		}
	};

	static deleteEmprestimo = async (req, res, next) => {
		try {
			const id = req.params.id;

			const resultEmprestimo = await emprestimos.findByIdAndDelete(id);
			if (resultEmprestimo !== null) {
				res.status(200).send({ message: "Emprestimo removido com sucesso" });
				return;
			}
			next(new NotFound("Id do emprestimo  não encontrado!!!!"));
		} catch (erro) {
			next(erro);
		}
	};

	static getEmprestimosByFilter = async (req, res, next) => {
		try {

			const busca = await processBusca(req.query);
			if (busca !== null) {
				const emprestimosResultado = await emprestimos.find(busca).populate("livro", "nome");
				console.log(emprestimosResultado);
				if (emprestimosResultado.length >= 1) {
					res.status(200).send(emprestimosResultado);
					return;
				}
				res.status(200).send({ message: "Não foi encontrado nenhum emprestimo!" });

			} else {
				res.status(204).end();
			}

		} catch (erro) {
			next(erro);
		}
	};

	static finalizarEmprestimo = async (req, res, next) => {
		try {
			let { id } = req.params;
			let updateEmprestimo = await emprestimos.updateOne(
				{
					_id: mongoose.Types.ObjectId(id),
					dataDevolucao: null
				},
				{ $set: { dataDevolucao: new Date() } }
			)
				.exec();
			if (updateEmprestimo.modifiedCount < 1) {
				res.status(400).send({ message: "Não foi possivel finalizar o emprestimo, pois já foi finalizado anteriormente!!!" });
				return;
			}
			let getEmprestimo = await emprestimos.findById(id)
				.exec();
			let updateLivro = await livros.findByIdAndUpdate(
				getEmprestimo.livro._id,
				{
					$inc: {
						quantidadeEmprestada: -1
					}
				},
				{ new: true })
				.exec();
			console.log(updateLivro);
			res.status(200).send({ message: "Emprestimo finalizado com sucesso" });
		} catch (error) {
			console.log(error);
			next(error);
			//res.status(500).send({message:"Erro interno do servidor!!!"});
		}
	};


}

async function processBusca(params) {
	const { editora, titulo, genero, startDate, endDate, isDevolvido, isAtrasado } = params;

	let busca = {};

	if (editora) busca.editora = { $regex: editora, $options: "i" };
	if (titulo) busca.titulo = { $regex: titulo, $options: "i" };
	if (genero) busca.genero = { $regex: genero, $options: "i" };
	if (startDate) busca.dataEmprestimo = { $gte: new Date(startDate) };
	if (endDate) busca.dataEmprestimo = { $lte: new Date(endDate) };
	if (isDevolvido === "0" || isDevolvido === "1") {
		if (isDevolvido === "0") busca.dataDevolucao = null;
		if (isDevolvido === "1") busca.dataDevolucao = { $exists: isDevolvido };
	}
	if (isAtrasado === "0" || isAtrasado === "1") {
		if (isAtrasado === "1") busca.dataDevolucaoPrevista = { $lte: new Date() };
		if (isAtrasado === "0") busca.dataDevolucaoPrevista = { $gte: new Date() };


	}

	// if (autor) {
	// 	const autorQuery = await autores.findOne({ nome: autor });
	// 	if (autorQuery !== null) {
	// 		busca.autor = autorQuery._id;
	// 	} else {
	// 		busca = null;
	// 	}
	// }
	return busca;
}

export default EmprestimoController;