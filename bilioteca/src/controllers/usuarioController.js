import { usuarios } from "../models/index.js";
import NotFound from "../errors/NotFound.js";

class UsuarioController {
    
	static getUser = async (req, res, next) => {
		try {
			const { email, senha } = req.body;
			const result = await usuarios.findOne({ email, senha });
            
			if (result !== null) {
				res.status(200).json({ message: "Usuario autorizado", status: true, id_user: result._id });
				return;
			}
			res.status(401).json({ message: "Usuario não autorizado", status: false });
		} catch (erro) {
			next(erro);
		}
	};
    
	static getUsers = async (req, res, next) => {
		try {
			// eslint-disable-next-line no-unused-vars
			req.resultado = usuarios;
			next();
		} catch (erro) {
			next(erro);
		}
	};
    
	static createUser = async (req, res, next) => {
		try {
			const { email } = req.body;
			const newUsuario = new usuarios(req.body);
            
			const userAlreadyExists = await usuarios.findOne({ email });
			if (userAlreadyExists != null) 
			{
				res.status(202).json({ message: "Não foi possível criar o usuario. Usuario ja existe!!!" });
				return;
			}
            
			const usuarioResult = await newUsuario.save();
            
			res.status(201).json(usuarioResult);
		} catch (erro) {
			next(erro);
		}
	};
    
	static updateUser = async (req, res, next) => {
		try {
			const { id } = req.params;
            
			const usuarioResult = await usuarios.findByIdAndUpdate(id, { $set: req.body });
			if (usuarioResult !== null) {
				res.status(200).send({ message: "Usuario atualizado com sucesso" });
				return;
			}
			next("Id do usuario não encontrado!!!");
		} catch (erro) {
			next(erro);
		}
	};
    
	static deleteUser = async (req, res, next) => {
		try {
			const { id } = req.params;
            
			const userResult = await usuarios.findByIdAndDelete(id);
			if (userResult !== null) {
				res.status(200).send({ message: "Usuario removido com sucesso" });
				return;
			}
			next(new NotFound("Id do Usuario não encontrado!!!!"));
		} catch (erro) {
			next(erro);
		}
	};
}

export default UsuarioController;
