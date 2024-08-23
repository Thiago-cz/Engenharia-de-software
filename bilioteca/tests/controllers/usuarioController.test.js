/* eslint-disable no-undef */
describe("CRUD Usuario", () => {

	it("Deve criar um usuario", async () => {
		let user1 = {
			nome: "Roberto Alves",
			email: "robertoalves@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let response = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user1)
		});



		expect(response.status).toBe(201);
	});

	it("Deve recuperar um usuario por email e senha", async () => {
		let user = {
			email: "robertoalves@gmail.com",
			senha: "Roberto@123"
		};

		let response = await fetch("http://localhost:3000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		});

		expect(response.status).toBe(200);
	});

	it("Deve buscar um usuario por email e senha e editar pelo id", async () => {
		let user = {
			email: "robertoalves@gmail.com",
			senha: "Roberto@123"
		};

		let response = await fetch("http://localhost:3000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		});
		let userResponse = await response.json();

		let reponseEditUser = await fetch(`http://localhost:3000/user/${userResponse.id_user}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				nome: "Roberto Alves Da Silva",
				email: "robertoalves@gmail.com",
				telefone: "(64) 98877-4956",
				senha: "Roberto@123"
			})
		});

		expect(reponseEditUser.status).toBe(200);
	});

	it("Deve buscar um usuario por email e senha e  excluir pelo id retornado", async () => {
		let user = {
			email: "robertoalves@gmail.com",
			senha: "Roberto@123"
		};

		let response = await fetch("http://localhost:3000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		});

		let userResponse = await response.json();

		let deleteResponse = await fetch(`http://localhost:3000/user/${userResponse.id_user}`, { method: "DELETE" });

		expect(deleteResponse.status).toBe(200);
	});

});