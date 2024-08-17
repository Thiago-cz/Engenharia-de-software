import NotFound from "../errors/NotFound.js";
import { autores } from "../models/index.js";

class AutorController {
	static getAutores = async (req, res, next) => {
		try {
			req.resultado = autores;
			next();
		} catch (erro) {
			next(erro);
		}
	};

	static getAutorById = async (req, res, next) => {
		try {
			const id = req.params.id;

			const autorResultado = await autores.findById(id);
			if (autorResultado !== null) {
				res.status(200).send(autorResultado);
			} else {
				next(new NotFound("ID do autor não localizado!!"));
			}
		} catch (erro) {
			next(erro);
		}
	};

	static getAutorByFilter = async (req, res, next) => {
		const busca = await processBusca(req.query);
		try {
			if (busca !== null) {
				const autoresResult = await autores.find(busca);

				if (autoresResult.length >= 1) {
					res.status(200).send(autoresResult);
					return;
				}

			} else {
				res.status(204).end();
			}

		} catch (erro) {
			next(erro);
		}
	};

	static createAutor = async (req, res, next) => {
		try {
			console.log(req.body);
			let autor = new autores(req.body);

			const autorResultado = await autor.save();

			res.status(201).send(autorResultado.toJSON());
		} catch (erro) {
			next(erro);
		}
	};

	static updateAutor = async (req, res, next) => {
		try {
			const id = req.params.id;

			const result = await autores.findByIdAndUpdate(id, { $set: req.body });
			if (result !== null) {
				res.status(200).json({ message: "Autor atualizado com sucesso!!!" });
				return;
			}

			next(new NotFound("Id do autor não encontrado!!!"));
		} catch (erro) {
			next(erro);
		}
	};

	static deleteAutor = async (req, res, next) => {
		try {
			const id = req.params.id;

			let resultAutor = await autores.findByIdAndDelete(id);
			if (resultAutor !== null) {
				res.status(200).send({ message: "Autor removido com sucesso" });
				return;
			}
			next(new NotFound("Id do autor não encontrado"));
		} catch (erro) {
			next(erro);
		}
	};
}

async function processBusca(params) {
	const { nome, nacionalidade } = params;

	let busca = {};

	if (nome) busca.nome = { $regex: nome, $options: "i" };
	if (nacionalidade) busca.nacionalidade = { $regex: nacionalidade, $options: "i" };

	return busca;
}

export default AutorController;
