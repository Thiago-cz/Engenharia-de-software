import NotFound from "../errors/NotFound.js";
import {autores} from "../models/index.js";

class AutorController {
	static getAutores = async (req, res, next) => {
		try {
			const autoresResultado =  autores.find();
			req.resultado = autoresResultado;

			
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
			if(result !== null) {
				res.status(200).json({message:"Autor atualizado com sucesso!!!"});
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
			if(resultAutor !== null){
				res.status(200).send({ message: "Autor removido com sucesso" });
				return;
			}
			next(new NotFound("Id do autor não encontrado"));
		} catch (erro) {
			next(erro);
		}
	};
}

export default AutorController;
