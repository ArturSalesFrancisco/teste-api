const listaProdutos = document.getElementById("lista-produtos");
const formProduto = document.getElementById("form-produto");
let produtoEd = null;
const btnForm = document.getElementById("btn-form");
const tituloForm = document.getElementById("titulo-form");

function carregarProdutos(){
    fetch('/produtos')
    .then(res => res.json())
    .then(data => {
        listaProdutos.innerHTML = "";
        data.forEach(produto => {
            const container = document.createElement("div");
            container.classList.add("col-md-3", "col-sm-12", "col-12");

            const card = document.createElement("div");
            card.classList.add("card-produto");

            const idProd = document.createElement("p");
            idProd.classList.add("id-produto")
            idProd.textContent = produto.id;

            const descricao = document.createElement("h3");
            descricao.textContent = produto.descricao;

            const preco = document.createElement("p");
            preco.textContent = `R$${produto.preco}`;

            const categoria = document.createElement("p");
            categoria.textContent = produto.categoria;

            const estoque = document.createElement("p");
            estoque.textContent = `${produto.estoque} unidades em estoque`;

            const divBtns = document.createElement("div");
            divBtns.classList.add("div-botoes");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-editar");

            btnEditar.addEventListener("click", () => {
                btnForm.textContent = "Salvar";
                tituloForm.textContent = "EDITAR PRODUTO";
                editarProduto(produto);
            });

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.classList.add("btn-excluir");

            btnExcluir.addEventListener("click", () => {
                excluirProduto(produto.id);
            });

            card.appendChild(descricao);
            container.appendChild(idProd);
            card.appendChild(categoria);
            card.appendChild(preco);
            card.appendChild(estoque);
            divBtns.appendChild(btnExcluir);
            divBtns.appendChild(btnEditar);
            card.appendChild(divBtns);
            container.appendChild(card);
            listaProdutos.appendChild(container);
        });
    })
}

function excluirProduto(id){
    fetch(`/produtos/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json)
    .then(data => {
        carregarProdutos();
    });
}

formProduto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const categoria = document.getElementById("categoria").value;
    const preco = document.getElementById("preco").value;
    const estoque = document.getElementById("estoque").value;

    if (produtoEd !== null){
        fetch(`/produtos/${produtoEd}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descricao: descricao,
                categoria: categoria,
                preco: Number(preco),
                estoque: Number(estoque)
            })
        })
        .then(res => res.json())
        .then(produto => {
            formProduto.reset();
            produtoEditando = null;
            btnForm.textContent = "Cadastrar";
            tituloForm.textContent = "CADASTRAR NOVO PRODUTO";
            carregarProdutos();
        })
    } else {
        fetch("/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descricao: descricao,
                categoria: categoria,
                preco: Number(preco),
                estoque: Number(estoque)
            })
        })
        .then(res => res.json())
        .then(produto => {
            formProduto.reset();
            carregarProdutos();
        })
    }
})

function editarProduto(produto){
    produtoEd = produto.id;

    document.getElementById("descricao").value = produto.descricao;
    document.getElementById("categoria").value = produto.categoria;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("estoque").value = produto.estoque;
}

carregarProdutos();