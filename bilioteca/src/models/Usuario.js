import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
	{
		id: { type: String },
		nome: { type: String, required: [true, "O nome do usuario é obrigatório"] },
		email: { type: String, require: [true, "O email do usuario é obrigatorio"] },
		telefone : {type: String},
		senha: { type: String, require: [true, "A senha é obrigatoria"] }
	},
	{
		versionKey: false
	}
);

const usuarios = mongoose.model("usuarios", usuarioSchema);

export default usuarios;