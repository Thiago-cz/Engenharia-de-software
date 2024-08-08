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
			validate : {
				validator: (value) => {return value >= 10 && value <=5000;},
				message : "O numero de paginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"
			}
			// max: [5000, "O numero de paginas deve estar entre 10 e 5000 paginas. Valor fornecido: {VALUE}"],
			// min: [10, "O numero de paginas deve estar entre 10 e 5000 paginas. Valor fornecido: {VALUE}"] 
		},
		preco :{type: Number,  required : [true, "O preco do livro é obrigatório!"]},
		quantidade : {type: Number}
	}
);
livroSchema.plugin(autopopulate);

const livros = mongoose.model("livros", livroSchema);

export default livros;