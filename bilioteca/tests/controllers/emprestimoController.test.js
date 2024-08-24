/* eslint-disable no-undef */

describe("CRUD emprestimo", () => {
	let autorResponse;
	it("Deve criar um emprestimo", async () => {

		let usuario = {
			nome: "Roberto Alves",
			email: "robertoalves@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let usuarioResponse = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usuario)
		});

		usuarioResponse = await usuarioResponse.json();

		let autor = {
			nome: "Roberto",
			nacionalidade: "Brasileiro"
		};

		autorResponse = await fetch("http://localhost:3000/autores", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(autor)
		});

		autorResponse = await autorResponse.json();

		let livro = {
			titulo: "Livro de teste",
			autor: autorResponse._id,
			editora: "Teste",
			numeroPaginas: 300,
			preco: 0.50,
			genero: "Romance",
			quantidade: 3
		};

		let responseLivro = await fetch("http://localhost:3000/livros", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(livro)
		});

		responseLivro = await responseLivro.json();

		let emprestimo = {
			livro: responseLivro._id,
			usuario: usuarioResponse._id,
			dataEmprestimo: "2024-08-21 10:00:00",
			quantidadeDias: 15,
			valor: 0.10,
			valorMulta: 5
		};

		let responseEmprestimo = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo)
		});
		let status = responseEmprestimo.status;
		responseEmprestimo = await responseEmprestimo.json();

		await fetch(`http://localhost:3000/user/${usuarioResponse._id}`, {method: "DELETE"});
		await fetch(`http://localhost:3000/emprestimos/${responseEmprestimo._id}`, {method: "DELETE"});
		expect(status).toBe(201);
	});

	it("Deve negar o emprestimo ao usuario ao atingir o limite de livros emprestados", async () => {
		let usuario1 = {
			nome: "Roberto Alves",
			email: "robertoalves1@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let usuario1Response = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usuario1)
		});

		usuario1Response = await usuario1Response.json();

		let usuario2 = {
			nome: "Roberto Alves",
			email: "robertoalves2@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let usuario2Response = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usuario2)
		});

		usuario2Response = await usuario2Response.json();

		let usuario3 = {
			nome: "Roberto Alves",
			email: "robertoalves3@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let usuario3Response = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usuario3)
		});

		usuario3Response = await usuario3Response.json();

		let livro = await fetch("http://localhost:3000/livros/busca", { method: "GET" });
		livro = await livro.json();

		let emprestimo = {
			livro: livro[0]._id,
			usuario: usuario1Response._id,
			dataEmprestimo: "2024-08-21 10:00:00",
			quantidadeDias: 15,
			valor: 0.10,
			valorMulta: 5
		};

		let emprestimo1Response = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo)
		});

		emprestimo1Response = await emprestimo1Response.json();
		emprestimo.usuario = usuario2Response._id;

		let emprestimo2Response = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo)
		});
		emprestimo2Response = await emprestimo2Response.json();
		emprestimo.usuario = usuario3Response._id;

		let emprestimo3Response = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo)
		});

		let status = emprestimo3Response.status;
		emprestimo3Response = await emprestimo3Response.json();


		await fetch(`http://localhost:3000/emprestimos/${emprestimo1Response._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/emprestimos/${emprestimo2Response._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/emprestimos/${emprestimo3Response._id}`, { method: "DELETE" });

		await fetch(`http://localhost:3000/user/${usuario1Response._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/user/${usuario2Response._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/user/${usuario3Response._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/livros/${livro[0]._id}`, { method: "DELETE" });

		expect(status).toBe(401);

	});

	it("Deve negar o emprestimo ao usuario quando ele tem um emprestimo aberto atrasado", async () => {
		let usuario = {
			nome: "Roberto Alves",
			email: "robertoalves2@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let usuarioResponse = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usuario)
		});

		usuarioResponse = await usuarioResponse.json();


		let livro = {
			titulo: "Livro de teste",
			autor: autorResponse._id,
			editora: "Teste",
			numeroPaginas: 300,
			preco: 0.50,
			genero: "Romance",
			quantidade: 3
		};

		let livro2 = {
			titulo: "Livro de teste 2",
			autor: autorResponse._id,
			editora: "Teste 2",
			numeroPaginas: 300,
			preco: 0.50,
			genero: "Romance",
			quantidade: 3
		};

		let responseLivro = await fetch("http://localhost:3000/livros", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(livro)
		});

		responseLivro = await responseLivro.json();

		let responseLivro2 = await fetch("http://localhost:3000/livros", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(livro2)
		});

		responseLivro2 = await responseLivro2.json();

		let emprestimo = {
			usuario: usuarioResponse._id,
			livro: responseLivro._id,
			quantidadeDias: 15
		};

		let responseEmprestimo = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo)
		});

		responseEmprestimo = await responseEmprestimo.json();

		let emprestimoUpdateDate = {
			dataEmprestimo: "2024-06-21 10:00:00",
			dataDevolucaoPrevista: "2024-07-06 10:00:00"
		};


		await fetch(`http://localhost:3000/emprestimos/${responseEmprestimo._id}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimoUpdateDate)
		});

		let emprestimo2 = {
			usuario: usuarioResponse._id,
			livro: responseLivro2._id,
			quantidadeDias: 15
		};

		let responseEmprestimo2 = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo2)
		});
		let status = responseEmprestimo2.status;
		responseEmprestimo2 = await responseEmprestimo2.json();

		await fetch(`http://localhost:3000/user/${usuarioResponse._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/livros/${responseLivro._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/livros/${responseLivro2._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/emprestimos/${responseEmprestimo._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/autores/${autorResponse._id}`, { method: "DELETE" });

		expect(status).toBe(401);

	});

	it("Deve calcular o valor da multa quando o usuario atrasa na devolução do livro", async () => {
		let usuario = {
			nome: "Roberto Alves",
			email: "robertoalves2@gmail.com",
			telefone: "(64) 98877-4956",
			senha: "Roberto@123"
		};

		let usuarioResponse = await fetch("http://localhost:3000/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(usuario)
		});

		usuarioResponse = await usuarioResponse.json();

		let livro = {
			titulo: "Livro de teste",
			autor: autorResponse._id,
			editora: "Teste",
			numeroPaginas: 300,
			preco: 0.50,
			genero: "Romance",
			quantidade: 3
		};

		let responseLivro = await fetch("http://localhost:3000/livros", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(livro)
		});

		responseLivro = await responseLivro.json();

		let emprestimo = {
			usuario: usuarioResponse._id,
			livro: responseLivro._id,
			quantidadeDias: 15
		};

		let responseEmprestimo = await fetch("http://localhost:3000/emprestimos", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimo)
		});


		responseEmprestimo = await responseEmprestimo.json();

		let emprestimoUpdateDate = {
			dataEmprestimo: "2024-06-21 10:00:00",
			dataDevolucaoPrevista: "2024-07-06 10:00:00"
		};

		await fetch(`http://localhost:3000/emprestimos/${responseEmprestimo._id}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify(emprestimoUpdateDate)
		});

		let finalizarEmprestimoResponse = await fetch(`http://localhost:3000/emprestimos/${responseEmprestimo._id}`);

		finalizarEmprestimoResponse = await finalizarEmprestimoResponse.json();

		await fetch(`http://localhost:3000/autores/${autorResponse._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/user/${usuarioResponse._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/livros/${responseLivro._id}`, { method: "DELETE" });
		await fetch(`http://localhost:3000/emprestimos/${responseEmprestimo._id}`, { method: "DELETE" });

		expect(finalizarEmprestimoResponse.valorMulta).toBe(50);
		expect(finalizarEmprestimoResponse.valor).toBe(7.5);
	});

});