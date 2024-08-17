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

		// response = await response.json();
	});

	it("Deve recuperar um livro pelo id ", () => {

	});
});