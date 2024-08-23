/* eslint-disable no-undef */
describe("CRUD livro", () => {

	it("Deve criar um livro", async () => {
		let autor = {
			nome: "Roberto",
			nacionalidade: "Brasileiro"
		};

		let response = await fetch("http://localhost:3000/autores", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(autor)
		});

		response = await response.json();

		let livro = {
			titulo: "Livro de teste",
			autor: response._id,
			editora: "Teste",
			numeroPaginas: 300,
			preco: 0.50,
			genero: "Romance",
			quantidade: 30
		};

		let responseLivro = await fetch("http://localhost:3000/livros", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(livro)
		});

		expect(responseLivro.status).toBe(201);
	});


	it("Deve recuperar um livro buscando por titulo & editora ", async () => {

		let response = await fetch("http://localhost:3000/livros/busca?titulo=Livro de teste&editora=Teste", {
			method: "GET"
		});

		let livro = await response.json();

		expect(response.status).toBe(200);
		expect(livro[0].titulo).toBe("Livro de teste");
		expect(livro[0].editora).toBe("Teste");
	});

	it("Deve editar um livro", async () => {
		let livro = {
			titulo: "Livro de teste 2",
			editora: "Teste 2",
			numeroPaginas: 350
		};

		let response = await fetch("http://localhost:3000/livros/busca?titulo=Livro de teste&editora=Teste", {
			method: "GET"
		});

		let livroResponse = await response.json();
		let url = `http://localhost:3000/livros/${livroResponse[0]._id}`;


		let editResonse = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(livro)
		});
		expect(editResonse.status).toBe(200);
	});

	it("Deve apagar um livro buscando por titulo & editora", async () => {
		let response = await fetch("http://localhost:3000/livros/busca?titulo=Livro de teste 2&editora=Teste 2", {
			method: "GET"
		});

		let livroResponse = await response.json();

		let deleteResponse = await fetch(`http://localhost:3000/livros/${livroResponse[0]._id}`, { method: "DELETE" });

		expect(deleteResponse.status).toBe(200);

	});
});