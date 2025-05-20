// --- Produtos ---
const tabelaBody = document.getElementById("tabela-produtos");
const formProduto = document.getElementById("form-produto");
const inputId = document.getElementById("produto-id");
const inputNome = document.getElementById("produto-nome");
const inputPreco = document.getElementById("produto-preco");
const inputImagem = document.getElementById("produto-imagem");
const btnCancelar = document.getElementById("cancelar-edicao");
const buscaProduto = document.getElementById("busca-produto");

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let cupons = JSON.parse(localStorage.getItem("cupons")) || [];

function salvarProdutos() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function salvarCupons() {
  localStorage.setItem("cupons", JSON.stringify(cupons));
}

function renderizarTabela(filtro = "") {
  tabelaBody.innerHTML = "";
  const filtroLower = filtro.toLowerCase();

  produtos.forEach((produto, index) => {
    if (produto.nome.toLowerCase().includes(filtroLower)) {
      const tr = document.createElement("tr");

      const imgSrc = produto.imagem || "https://via.placeholder.com/50?text=Sem+Imagem";

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${imgSrc}" alt="Imagem do produto" /></td>
        <td>${produto.nome}</td>
        <td>${produto.preco.toFixed(2)}</td>
        <td>
          <button class="btn-small btn-edit" data-index="${index}">Editar</button>
          <button class="btn-small btn-delete" data-index="${index}">Excluir</button>
        </td>
      `;

      tabelaBody.appendChild(tr);
    }
  });

  // Eventos botões editar/excluir
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.onclick = e => {
      const i = Number(e.target.dataset.index);
      editarProduto(i);
    };
  });
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.onclick = e => {
      const i = Number(e.target.dataset.index);
      excluirProduto(i);
    };
  });
}

function editarProduto(index) {
  const p = produtos[index];
  inputId.value = index;
  inputNome.value = p.nome;
  inputPreco.value = p.preco;
  // Resetar input file (imagem)
  inputImagem.value = "";
  btnCancelar.style.display = "inline-block";
}

function excluirProduto(index) {
  if (confirm("Deseja realmente excluir este produto?")) {
    produtos.splice(index, 1);
    salvarProdutos();
    renderizarTabela(buscaProduto.value);
  }
}

formProduto.onsubmit = e => {
  e.preventDefault();

  const nome = inputNome.value.trim();
  const preco = parseFloat(inputPreco.value);
  const id = inputId.value;

  if (!nome || isNaN(preco)) {
    alert("Preencha nome e preço corretamente.");
    return;
  }

  // Função para ler imagem do input e retornar Promise com base64
  function lerImagem(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Erro ao ler imagem");
      reader.readAsDataURL(file);
    });
  }

  lerImagem(inputImagem.files[0]).then(base64img => {
    if (id === "") {
      // Novo produto
      produtos.push({
        nome,
        preco,
        imagem: base64img
      });
    } else {
      // Editar produto existente
      produtos[id].nome = nome;
      produtos[id].preco = preco;
      if (base64img) produtos[id].imagem = base64img;
    }

    salvarProdutos();
    renderizarTabela(buscaProduto.value);
    formProduto.reset();
    inputId.value = "";
    btnCancelar.style.display = "none";
  }).catch(alert);
};

btnCancelar.onclick = () => {
  formProduto.reset();
  inputId.value = "";
  btnCancelar.style.display = "none";
};

buscaProduto.oninput = () => {
  renderizarTabela(buscaProduto.value);
};

// --- Cupons ---
const listaCupons = document.getElementById("lista-cupons");
const formCupom = document.getElementById("form-cupom");
const inputCodigoCupom = document.getElementById("codigo-cupom");
const inputValorCupom = document.getElementById("valor-cupom");

function renderizarCupons() {
  listaCupons.innerHTML = "";

  if (cupons.length === 0) {
    listaCupons.innerHTML = "<p style='color:#8a257c; font-weight:600;'>Nenhum cupom cadastrado.</p>";
    return;
  }

  cupons.forEach((cupom, i) => {
    const div = document.createElement("div");
    div.className = "cupom-item";
    div.innerHTML = `
      <span>${cupom.codigo.toUpperCase()} - ${cupom.desconto}%</span>
      <button data-index="${i}">Excluir</button>
    `;
    listaCupons.appendChild(div);
  });

  lista
  Cupons.querySelectorAll("button").forEach(btn => {
    btn.onclick = e => {
    const i = Number(e.target.dataset.index);
    if (confirm("Excluir cupom?")) {
    cupons.splice(i, 1);
    salvarCupons();
    renderizarCupons();
    }
    };
    });
    }
    
    formCupom.onsubmit = e => {
    e.preventDefault();
    
    const codigo = inputCodigoCupom.value.trim().toUpperCase();
    const desconto = parseInt(inputValorCupom.value);
    
    if (!codigo || isNaN(desconto) || desconto <= 0 || desconto > 100) {
    alert("Informe um código válido e um desconto entre 1% e 100%");
    return;
    }
    
    if (cupons.find(c => c.codigo === codigo)) {
    alert("Este código de cupom já existe.");
    return;
    }
    
    cupons.push({ codigo, desconto });
    salvarCupons();
    renderizarCupons();
    formCupom.reset();
    };
    
    // Inicialização
    renderizarTabela();
    renderizarCupons();
 
    
    