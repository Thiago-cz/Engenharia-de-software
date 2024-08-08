/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
import paginacao from "../../src/middlewares/paginacao";
import RequisicaoIncorreta from "../../src/errors/RequisicaoIncorreta";

const mockFind = jest.fn();
const mockSkip = jest.fn().mockReturnThis();
const mockSort = jest.fn().mockReturnThis();
const mockLimit = jest.fn().mockReturnThis();
const mockExec = jest.fn();


describe("Middleware de Paginação", () => {
	beforeEach(() => {
		mockFind.mockClear().mockReturnValue({ skip: mockSkip, sort: mockSort, limit: mockLimit, exec: mockExec });
		mockSkip.mockClear();
		mockSort.mockClear();
		mockLimit.mockClear();
		mockExec.mockClear();
	});

	it("deve retornar os usuários paginados corretamente", async () => {
		const usuarios = Array.from({ length: 30 }, (_, index) => ({
			_id: index.toString().padStart(24, "0"),
			nome: `Usuario ${index + 1}`,
			email: `teste${index}@gmail.com`,
			telefone: "40028922",
			senha: "1234"
		}));
        
		const findMock = jest.fn().mockReturnThis();
		const skipMock = jest.fn().mockReturnThis();
		const sortMock = jest.fn().mockReturnThis();
		const limitMock = jest.fn().mockReturnThis();
		const execMock = jest.fn().mockResolvedValue(usuarios.slice(0, 10)); 
    
		const resultado = {
			find: findMock,
			skip: skipMock,
			sort: sortMock,
			limit: limitMock,
			exec: execMock
		};
    
		const req = { query: { limite: "10", pagina: "1" }, resultado };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const next = jest.fn();
    
		await paginacao(req, res, next);
    
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(usuarios.slice(0, 10));
		expect(findMock).toHaveBeenCalled();
		expect(skipMock).toHaveBeenCalledWith(0);
		expect(sortMock).toHaveBeenCalledWith({ _id: 1 });
		expect(limitMock).toHaveBeenCalledWith(10);
		expect(execMock).toHaveBeenCalled();
	});

	it("deve chamar next com RequisicaoIncorreta para parâmetros inválidos", async () => {
		const req = {
			query: { limite: -1, pagina: "", ordenacao: "_id:1" },
			resultado: { find: mockFind }
		};
		const res = {};
		const next = jest.fn();

		await paginacao(req, res, next);

		expect(next).toHaveBeenCalledWith(expect.any(RequisicaoIncorreta));
	});

	it("deve chamar next com o erro em caso de falha", async () => {
		const mockError = new Error("Erro de teste");
		mockExec.mockRejectedValue(mockError); 

		const req = {
			query: { limite: 10, pagina: 1, ordenacao: "_id:1" },
			resultado: { find: mockFind }
		};
		const res = {};
		const next = jest.fn();

		await paginacao(req, res, next);

		expect(next).toHaveBeenCalledWith(mockError);
	});
});
