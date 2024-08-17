import NotFound from "../errors/NotFound.js";
import { autores, livros } from "../models/index.js";

class LivroController {

	static getLivros = async (req, res, next) => {
		try {
			req.resultado = livros;
			next();

		} catch (erro) {
			next(erro);
		}
	};

	static getLivroById = async (req, res, next) => {
		try {
			const id = req.params.id;

			const livroResultados = await livros.findById(id)
				.populate("autor", "nome")
				.exec();
			if (livroResultados !== null) {
				res.status(200).send(livroResultados);
				return;
			}
			next(new NotFound("Id do livro não encontrado!!!"));

		} catch (erro) {
			next(erro);
		}
	};

	static createLivro = async (req, res, next) => {
		try {
			let livro = new livros(req.body);

			const livroResultado = await livro.save();

			res.status(201).send(livroResultado.toJSON());
		} catch (erro) {
			next(erro);
		}
	};

	static updateLivro = async (req, res, next) => {
		try {
			const id = req.params.id;

			const resultLivro = await livros.findByIdAndUpdate(id, { $set: req.body });
			if (resultLivro !== null) {
				res.status(200).send({ message: "Livro atualizado com sucesso" });
				return;
			}
			next("Id do livro não encontrado!!!");
		} catch (erro) {
			next(erro);
		}
	};

	static deleteLivro = async (req, res, next) => {
		try {
			const id = req.params.id;

			const resultLivro = await livros.findByIdAndDelete(id);
			if (resultLivro !== null) {
				res.status(200).send({ message: "Livro removido com sucesso" });
				return;
			}
			next(new NotFound("Id do livro não encontrado!!!!"));
		} catch (erro) {
			next(erro);
		}
	};

	static getLivroByFilter = async (req, res, next) => {
		try {

			const busca = await processBusca(req.query);
			if (busca !== null) {
				const livrosResultado = await livros.find(busca).populate("autor");

				if (livrosResultado.length >= 1) {
					res.status(200).send(livrosResultado);
					return;
				}

			} else {
				res.status(204).end();
			}

		} catch (erro) {
			next(erro);
		}
	};



}

async function processBusca(params) {
	const { editora, titulo, minPag, maxPag, autor } = params;

	let busca = {};

	if (minPag || maxPag) busca.numeroPaginas = {};
	if (editora) busca.editora = { $regex: editora, $options: "i" };
	if (titulo) busca.titulo = { $regex: titulo, $options: "i" };
	if (minPag) busca.numeroPaginas.$gte = minPag;
	if (maxPag) busca.numeroPaginas.$lte = maxPag;

	if (autor) {
		const autorQuery = await autores.findOne({ nome: autor });
		if (autorQuery !== null) {
			busca.autor = autorQuery._id;
		} else {
			busca = null;
		}
	}
	return busca;
}

export default LivroController;