/* eslint-disable no-undef */
describe("CRUD autor", () => {

	it("Deve criar um autor", async () => {
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

		expect(response.status).toBe(201);
	});

	it("Deve recuperar um autor pelo id buscando pelo nome e nacionalidade", async ()=>{
		// let autor = {
		// 	nome: "Roberto",
		// 	nacionalidade: "Brasileiro"
		// };

		let response = await fetch("http://localhost:3000/autores/busca?nome=Roberto&nacionalidade=Brasileiro", {
			method: "GET",
            
		});

		let autor = await response.json();

		let responseAutor = await fetch("http://localhost:3000/autores/" + autor[0]._id, {
			method: "GET"
		});


		expect(responseAutor.status).toBe(200);
        
	});

	it("Deve editar um autor", async () =>{
		let autorUpdate = {
			nome: "Roberto Alves",
			nacionalidade: "Brasileiro"
		};

		let autor = await fetch("http://localhost:3000/autores/busca?nome=Roberto&nacionalidade=Brasileiro", {
			method: "GET",
            
		});

		let autorResponse = await autor.json();

		let updatedAutorResponse = await fetch("http://localhost:3000/autores/" + autorResponse[0]._id,{
			method: "PUT",
			body: JSON.stringify(autorUpdate)
		});

		//let autorUpdate = await updatedAutorResponse.json()

		expect(updatedAutorResponse.status).toBe(200);
	});

	it("Deve deletar um usuario", async () =>{
		let autorUpdate = {
			nome: "Roberto Alves",
			nacionalidade: "Brasileiro"
		};

		let autor = await fetch("http://localhost:3000/autores/busca?nome=Roberto&nacionalidade=Brasileiro", {
			method: "GET",
            
		});

		let autorResponse = await autor.json();

		let deleteResponse = await fetch("http://localhost:3000/autores/" + autorResponse[0]._id, {
			method: "DELETE"
		});

		expect(deleteResponse.status).toBe(200);
	});
});