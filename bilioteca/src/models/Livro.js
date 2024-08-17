import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const livroSchema = new mongoose.Schema(
	{
		id:
		{
			type: String
		},
		titulo:
		{
			type: String,
			required: [true, "O titulo do livro é obrigatorio!!"]
		},
		autor:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "autores",
			required: [true, "O autor é obrigatório!!"]
		},
		editora:
		{
			type: String,
			required: [true, "A editora do livro é obrigatoria!!"]
		},
		numeroPaginas: {
			type: Number,
			validate: {
				validator: (value) => { return value >= 10 && value <= 5000; },
				message: "O numero de paginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"
			}
			// max: [5000, "O numero de paginas deve estar entre 10 e 5000 paginas. Valor fornecido: {VALUE}"],
			// min: [10, "O numero de paginas deve estar entre 10 e 5000 paginas. Valor fornecido: {VALUE}"] 
		},
		preco: { type: Number, required: [true, "O preco do livro é obrigatório!"] },
		valorMulta: {
			type: Number,
			default: 10.0
		},
		genero: {
			type: [String],
			enum: ["Romance", "Fantasia", "Ficção científica", "Suspense", "Biografias", "História", "Ciência", "Autoajuda", "Poesia", "Mistério", "Terror", "Quadrinhos", "Infantil"],
			required: true,
			validate: {
				validator: (value) => { return value.length >= 1; },
				message: "O livro deve conter pelo menos um genero!"
			}
		},
		quantidade: {
			type: Number,
			required: [true, "A quantidade em estoque é obrigatoria!"]
		},
		quantidadeEmprestada: {
			type: Number,
			default: 0
		}
	}
);
livroSchema.plugin(autopopulate);

const livros = mongoose.model("livros", livroSchema);

export default livros;