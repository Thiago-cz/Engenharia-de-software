/* eslint-disable no-undef */
import UsuarioController from "../../src/controllers/usuarioController";
import { usuario } from "../../src/models";
import paginacao from "../../src/middlewares/paginacao";
jest.mock("../../src/models/Usuario");
jest.mock("../../src/middlewares/paginacao");

describe("UsuarioController.getUser", () => {
	it("Deve autorizar um usuário existente", async () => {
		const req = {
			body: { email: "test@example.com", senha: "123456" }
		};

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		const next = jest.fn();
		usuario.findOne.mockResolvedValue(true); 
		
		await UsuarioController.getUser(req, res, next);
		
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ message: "Usuario autorizado", status: true });
	});
	
	it("Não deve autorizar um usuário inexistente", async () => {
		const req = {
			body: { email: "notfound@example.com", senha: "wrong" }
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		const next = jest.fn();
		
		usuario.findOne.mockResolvedValue(null);
		
		await UsuarioController.getUser(req, res, next);
		
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Usuario não autorizado", status: false });
	});

});

describe("UsuarioController.getUsers", () => {
	it("deve processar usuários e aplicar paginação", async () => {

		const usuariosMock = [
			{
				"_id": "65f5eb7429b523f4d2a124d4",
				"nome": "Thiago Carvalho",
				"email": "teste1@gmail.com",
				"telefone": "40028922",
				"senha": "1234"
			},
			{
				"_id": "65f5eb7729b523f4d2a124d7",
				"nome": "Thiago",
				"email": "teste2@gmail.com",
				"telefone": "40028922",
				"senha": "1234"
			},
			{
				"_id": "65f5eb7b29b523f4d2a124da",
				"nome": "Thiago",
				"email": "teste3@gmail.com",
				"telefone": "40028922",
				"senha": "1234"
			},
			{
				"_id": "65f5eb7e29b523f4d2a124dd",
				"nome": "Thiago",
				"email": "teste4@gmail.com",
				"telefone": "40028922",
				"senha": "1234"
			}
		];
		
		usuario.find.mockResolvedValue({
			find: jest.fn().mockReturnThis(),
			skip: jest.fn().mockReturnThis(),
			sort: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
			exec: jest.fn().mockResolvedValue(usuariosMock)
		});

		const req = { query: {} };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const next = jest.fn();

		paginacao.mockImplementation((req, res, next) => next());

		await UsuarioController.getUsers(req, res, next);
        
		expect(paginacao).toHaveBeenCalled();

		// Como o teste foca na integração e fluxo, você pode querer verificar se certas funções foram chamadas,
		// ou, dependendo da implementação do seu middleware/mock, se a resposta final ou o próximo middleware esperado foi alcançado.
		// Por exemplo, se você tiver acesso direto aos dados ou métodos de resposta, poderá verificar a resposta:
		// expect(res.json).toHaveBeenCalledWith(['user1', 'user2']);
	});
});



