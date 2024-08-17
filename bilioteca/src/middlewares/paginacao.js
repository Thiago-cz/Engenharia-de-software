import RequisicaoIncorreta from "../errors/RequisicaoIncorreta.js";

async function paginacao(req, res, next) {
	try {
		let { limite = 10, pagina = 1, ordenacao = "_id:1" } = req.query;
		let [campoOrdenacao, ordem] = ordenacao.split(":");

		limite = parseInt(limite);
		pagina = parseInt(pagina);
		ordem = parseInt(ordem);
		let resultado = await req.resultado;

		if (limite > 0 && pagina > 0) {
			let resultadoPaginado = await resultado.find()
				.skip((pagina - 1) * limite)
				.sort({ [campoOrdenacao]: ordem })
				.limit(limite)
				.exec();
			res.status(200).json(resultadoPaginado);
		} else {
			next(new RequisicaoIncorreta());
		}
	} catch (error) {
		next(error);
	}
}

export default paginacao;