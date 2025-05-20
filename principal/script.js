// Produtos disponíveis
const produtos = {
  doces: [ // Lista de produtos da categoria "doces"
    { nome: "Brigadeiro", preco: 2.5, imagem: "../imagens/brigadeiro.jpeg" }, // Produto: Brigadeiro
    { nome: "Bolo", preco: 5.0, imagem: "../imagens/bolo.jpeg" }, // Produto: Bolo
    { nome: "Torta", preco: 6.0, imagem: "../imagens/torta.jpeg" }, // Produto: Torta
    { nome: "Cupcake", preco: 4.0, imagem: "../imagens/cupcake.jpeg" }, // Produto: Cupcake
    { nome: "Pudim", preco: 3.5, imagem: "../imagens/pudim.jpeg" } // Produto: Pudim
  ],
  salgados: [ // Lista de produtos da categoria "salgados"
    { nome: "Coxinha", preco: 3.0, imagem: "../imagens/coxinha.jpeg" }, // Produto: Coxinha
    { nome: "Pastel", preco: 4.0, imagem: "../imagens/pastel.jpeg" }, // Produto: Pastel
    { nome: "Empada", preco: 3.5, imagem: "../imagens/empada.jpeg" }, // Produto: Empada
    { nome: "Esfiha", preco: 4.5, imagem: "../imagens/esfira.jpeg" }, // Produto: Esfiha
    { nome: "Kibe", preco: 3.0, imagem: "../imagens/kibe.jpeg" } // Produto: Kibe
  ],
  bebidas: [ // Lista de produtos da categoria "bebidas"
    { nome: "Coca cola", preco: 5.0, imagem: "../imagens/refri.jpeg" }, // Produto: Coca-Cola
    { nome: "Suco", preco: 4.0, imagem: "../imagens/suco.jpeg" }, // Produto: Suco
    { nome: "Água", preco: 2.0, imagem: "../imagens/agua.jpeg" }, // Produto: Água
    { nome: "Chá", preco: 3.5, imagem: "../imagens/cha.jpeg" }, // Produto: Chá
    { nome: "Café", preco: 2.5, imagem: "../imagens/cafe.jpeg" } // Produto: Café
  ]
};
window.onload = () => {
  const usuario = localStorage.getItem("usuarioLogado");
  if (usuario === "adm") {
    document.getElementById("painel-adm").style.display = "block";
  }
};
window.onload = () => {
  const usuario = localStorage.getItem("usuarioLogado");
  if (usuario === "adm") {
    document.getElementById("painel-adm").style.display = "block";
  }
};

function abrirAdicionarProduto() {
  const nome = prompt("Nome do produto:");
  const preco = prompt("Preço:");
  const imagem = prompt("URL da imagem:");
  if (nome && preco && imagem) {
    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
    produtos.push({ nome, preco, imagem });
    localStorage.setItem("produtos", JSON.stringify(produtos));
    alert("Produto adicionado!");
  }
}


// Recupera carrinho do localStorage (ou inicializa vazio)
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Ao carregar a página, exibe o carrinho salvo
window.onload = function() {
  atualizarCarrinho(); // Chama a função que exibe os itens do carrinho na tela
};

// Função para exibir os produtos de uma categoria na tela
function mostrarCategoria(categoria) {
  const container = document.getElementById('produtos'); // Obtém o elemento onde os produtos serão exibidos
  container.innerHTML = ''; // Limpa os produtos anteriores antes de adicionar os novos

  produtos[categoria].forEach((item, index) => { // Percorre todos os produtos da categoria escolhida
    const card = document.createElement('div'); // Cria um elemento <div> para exibir o produto
    card.className = 'card'; // Adiciona a classe CSS "card" para estilização
    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}"> <!-- Exibe a imagem do produto -->
      <h4>${item.nome}</h4> <!-- Exibe o nome do produto -->
      <p>R$ ${item.preco.toFixed(2)}</p> <!-- Exibe o preço formatado -->
      <button onclick="adicionarAoCarrinho('${categoria}', ${index})">Adicionar</button> <!-- Botão para adicionar ao carrinho -->
    `;
    container.appendChild(card); // Adiciona o card ao container de produtos na página
  });
}

// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(categoria, index) {
  const produto = produtos[categoria][index]; // Obtém o produto selecionado pelo índice na categoria
  const existente = carrinho.find(item => item.nome === produto.nome); // Verifica se o produto já está no carrinho

  if (existente) {
    existente.quantidade += 1; // Se já existir, aumenta a quantidade
  } else {
    carrinho.push({ ...produto, quantidade: 1 }); // Se não existir, adiciona o produto com quantidade 1
  }

  // Salva o carrinho atualizado no localStorage e atualiza a tela
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho(); // Atualiza a exibição do carrinho na página
}

// Função para atualizar a exibição do carrinho na página
function atualizarCarrinho() {
  const corpoCarrinho = document.getElementById('corpo-carrinho'); // Obtém o corpo da tabela do carrinho
  const totalEl = document.getElementById('total'); // Obtém o elemento onde será mostrado o total
  corpoCarrinho.innerHTML = ''; // Limpa o carrinho antes de atualizar
  let total = 0; // Inicializa a variável do total

  carrinho.forEach((item, index) => { // Percorre os itens do carrinho
    const subtotal = item.preco * item.quantidade; // Calcula o subtotal do item
    total += subtotal; // Adiciona o subtotal ao total geral

    const tr = document.createElement('tr'); // Cria uma linha na tabela do carrinho
    tr.innerHTML = `
      <td>${item.nome}</td> <!-- Exibe o nome do produto -->
      <td>
        <input type="number" min="1" value="${item.quantidade}" onchange="atualizarQuantidadeDireta(${index}, this.value)">
      </td> <!-- Campo para alterar quantidade manualmente -->
      <td>R$ ${item.preco.toFixed(2)}</td> <!-- Exibe o preço unitário -->
      <td>R$ ${subtotal.toFixed(2)}</td> <!-- Exibe o subtotal -->
      <td>
        <button onclick="alterarQuantidade(${index}, -1)">-</button> <!-- Botão para diminuir quantidade -->
        <button onclick="alterarQuantidade(${index}, 1)">+</button> <!-- Botão para aumentar quantidade -->
      </td>
    `;
    corpoCarrinho.appendChild(tr); // Adiciona a linha à tabela do carrinho
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`; // Exibe o total formatado
}

// Função para aumentar ou diminuir a quantidade de um item no carrinho
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta; // Altera a quantidade do item
  if (carrinho[index].quantidade <= 0) { // Se a quantidade for 0 ou negativa, remove o item
    carrinho.splice(index, 1);
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva a alteração no localStorage
  atualizarCarrinho(); // Atualiza a exibição do carrinho
}

// Função para atualizar a quantidade digitada diretamente pelo usuário
function atualizarQuantidadeDireta(index, valor) {
  const novaQuantidade = parseInt(valor); // Converte o valor digitado para número inteiro
  if (isNaN(novaQuantidade) || novaQuantidade < 1) { // Se não for número ou for menor que 1, define como 1
    carrinho[index].quantidade = 1;
  } else {
    carrinho[index].quantidade = novaQuantidade; // Atualiza com a nova quantidade
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva no localStorage
  atualizarCarrinho(); // Atualiza a exibição do carrinho
}

// Função para redirecionar para a página do cupom
function irParaCupom() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva o carrinho antes de mudar de página
  window.location.href = '../cupom/cupom.html'; // Redireciona para a página do cupom
}
// Exemplo: pegar o nome do usuário do localStorage (ajuste conforme sua forma real)
const usuarioLogado = localStorage.getItem('usuario'); // ou 'username', 'user', etc.

// Verifica se existe usuário e o elemento para mostrar
if (usuarioLogado) {
  // Tenta encontrar um container já existente no header para mostrar o usuário
  let userDisplay = document.getElementById('userLogged');

  // Se não existir, cria um elemento e adiciona no cabeçalho
  if (!userDisplay) {
    userDisplay = document.createElement('div');
    userDisplay.id = 'userLogged';
    userDisplay.style.marginLeft = 'auto'; // por exemplo, para alinhar à direita no flex
    userDisplay.style.color = '#333'; // só um exemplo de estilo
    // Adiciona dentro do header (ajuste o seletor para o seu cabeçalho)
    const header = document.querySelector('header');
    if (header) {
      header.appendChild(userDisplay);
    }
  }

  // Insere o nome do usuário no elemento
  userDisplay.textContent = `Olá, ${usuarioLogado}`;
}
