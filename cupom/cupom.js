const cuponsValidos = {
  'DELFINS10': 'Você ganhou 10% de desconto!',
  'AMOPINKDELFINS': 'Você ganhou 20% de desconto!',
  'DELFINS5': 'Você ganhou 5% de desconto!',
};

const valoresDesconto = {
  'DELFINS10': 0.10,
  'AMOPINKDELFINS': 0.20,
  'DELFINS5': 0.05,
};

function verificarCupom() {
  const input = document.getElementById('input-cupom').value.trim().toUpperCase();
  const mensagem = document.getElementById('mensagem-cupom');

  if (input !== "" && cuponsValidos.hasOwnProperty(input)) {
    mensagem.style.color = 'green';
    mensagem.textContent = cuponsValidos[input];

    localStorage.setItem('cupomUsado', input);
    localStorage.setItem('descontoCupom', valoresDesconto[input]);
  } else {
    mensagem.style.color = 'red';
    mensagem.textContent = 'Cupom inválido! 😢';

    localStorage.removeItem('cupomUsado');
    localStorage.removeItem('descontoCupom');
  }
}

function voltar() {
  window.location.href = "../principal/index.html";
}

function pagar() {
  window.location.href = "../pagamento/pagamento.html";
}
