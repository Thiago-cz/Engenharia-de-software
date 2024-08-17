import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const emprestimoSchema = new mongoose.Schema({
	id: { type: String },
	livro: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "livros",
		required: [true, "O livro é obrigatório!!"]

	},
	usuario: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "usuarios",
		required: [true, "O usuario é obrigatorio!"]
        
	},
	dataEmprestimo: {
		type: Date,
		required: [true, "A data do emprestimo é obrigatoria!"]
	},
	dataDevolucao: {
		type: Date
	},
	dataDevolucaoPrevista: {
		type: Date,
		required: [true, "A data de devolucao prevista é obrigatoria!"]
	},
	valor: {
		type: Number,
		required: [true, "O valor do emprestimo é obrigatorio!"]
	},
	valorMulta: {
		type: Number,
		default: 0
	}
});


emprestimoSchema.plugin(autopopulate);

const emprestimos = mongoose.model("emprestimos", emprestimoSchema);

export default emprestimos;