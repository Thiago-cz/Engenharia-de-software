/* eslint-disable linebreak-style */
import "./erroBase.js";
import ErroBase from "./erroBase.js";

class ErroServidorIndisponivel extends ErroBase {
	constructor(msg = "Servidor indisopnivel no momento!!!"){
		super(msg, 500);
	}
}

export default ErroServidorIndisponivel;