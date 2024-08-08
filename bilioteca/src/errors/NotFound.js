import ErroBase from "./erroBase.js";

class NotFound extends ErroBase{
	constructor(msg = "Pagina não encontrada!!"){
		super(msg, 404);

	}
}

export default NotFound;