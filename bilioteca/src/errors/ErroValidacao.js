import RequisicaoIncorreta from "./RequisicaoIncorreta.js";


class ErroValidacao extends RequisicaoIncorreta{
	constructor(err){
		const msgErro = Object.values(err.errors)
			.map(erro =>erro.message)
			.join("; ");
		super(`Houve um erro de validação de dados!! ${msgErro}`);
	}
}

export default ErroValidacao;