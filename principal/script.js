// Produtos disponíveis
const produtos = {
  doces: [
    { nome: "Brigadeiro", preco: 2.5, imagem: "../imagens/brigadeiro.jpeg" },
    { nome: "Bolo de chocolate", preco: 5.0, imagem: "../imagens/bolo.jpeg" },
    { nome: "Torta de chocolate", preco: 6.0, imagem: "../imagens/torta.jpeg" },
    { nome: "Cupcake", preco: 4.0, imagem: "../imagens/cupcake.jpeg" },
    { nome: "Pudim", preco: 3.5, imagem: "../imagens/pudim.jpeg" }
  ],
  salgados: [
    { nome: "Coxinha de frango", preco: 3.0, imagem: "../imagens/coxinha.jpeg" },
    { nome: "Pastel de carne", preco: 4.0, imagem: "../imagens/pastel.jpeg" },
    { nome: "Empada de frango", preco: 3.5, imagem: "../imagens/empada.jpeg" },
    { nome: "Esfiha de carne", preco: 4.5, imagem: "../imagens/esfira.jpeg" },
    { nome: "Kibe", preco: 3.0, imagem: "../imagens/kibe.jpeg" }
  ],
  bebidas: [
    { nome: "Coca cola", preco: 5.0, imagem: "../imagens/refri.jpeg" },
    { nome: "Suco de laranja", preco: 4.0, imagem: "../imagens/suco.jpeg" },
    { nome: "Água", preco: 2.0, imagem: "../imagens/agua.jpeg" },
    { nome: "Chá de camomila", preco: 3.5, imagem: "../imagens/cha.jpeg" },
    { nome: "Café", preco: 2.5, imagem: "../imagens/cafe.jpeg" }
  ]
};

// Recupera carrinho do localStorage (ou inicializa vazio)
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Ao carregar, exibe o carrinho salvo
window.onload = function() {
  atualizarCarrinho();
};

function mostrarCategoria(categoria) {
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  produtos[categoria].forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <h4>${item.nome}</h4>
      <p>R$ ${item.preco.toFixed(2)}</p>
      <input type="number" id="qtd-${categoria}-${index}" min="1" value="1">
      <button onclick="adicionarAoCarrinho('${categoria}', ${index})">Adicionar</button>
    `;
    container.appendChild(card);
  });
}

function adicionarAoCarrinho(categoria, index) {
  const quantidade = parseInt(document.getElementById(`qtd-${categoria}-${index}`).value);
  const produto = produtos[categoria][index];
  const existente = carrinho.find(item => item.nome === produto.nome);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade });
  }

  // Salva no localStorage e atualiza tela
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const corpoCarrinho = document.getElementById('corpo-carrinho');
  const totalEl = document.getElementById('total');
  corpoCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${item.preco.toFixed(2)}</td>
      <td>R$ ${subtotal.toFixed(2)}</td>
      <td>
        <button onclick="alterarQuantidade(${index}, -1)">-</button>
        <button onclick="alterarQuantidade(${index}, 1)">+</button>
      </td>
    `;
    corpoCarrinho.appendChild(tr);
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function irParaCupom() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  window.location.href = '../cupom/cupom.html';
}
