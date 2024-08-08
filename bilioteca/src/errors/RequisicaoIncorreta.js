import "./erroBase.js";
import ErroBase from "./erroBase.js";

class RequisicaoIncorreta extends ErroBase {
	constructor(msg = "Um ou mais dados estão incorretos!!"){
		super(msg, 400);
	}
}

export default RequisicaoIncorreta;