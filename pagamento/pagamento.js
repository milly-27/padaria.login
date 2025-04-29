// Lista de cupons válidos e seus descontos
const cuponsValidos = {
  'DELFINS10': 0.10,
  'AMOPINKDELFINS': 0.20,
  'DELFINS5': 0.05
};

const mensagensCupons = {
  'DELFINS10': 'Você ganhou 10% de desconto!',
  'AMOPINKDELFINS': 'Você ganhou 20% de desconto!',
  'DELFINS5': 'Você ganhou 5% de desconto!'
};

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function validarCartao(numero) {
  const digits = numero.replace(/\D/g, '').split('').reverse().map(d => parseInt(d, 10));
  let soma = 0;
  digits.forEach((d, i) => {
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    soma += d;
  });
  return soma % 10 === 0;
}

function calcularValores() {
  let valorOriginal = 0;
  carrinho.forEach(item => {
    valorOriginal += item.preco * item.quantidade;
  });

  const cupomUsado = localStorage.getItem('cupomUsado');
  const descontoCupom = (cupomUsado && cuponsValidos[cupomUsado]) ? cuponsValidos[cupomUsado] : 0;

  const valorFinal = valorOriginal * (1 - descontoCupom);
  window.valorFinalCalculado = valorFinal;

  const valorFinalSpan = document.getElementById('valor-final-span');
  if (valorFinalSpan) {
    valorFinalSpan.textContent = valorFinal.toFixed(2);
  }
}

function pagarCartao() {
  const numero = prompt('Insira o número do seu cartão (só números):');
  if (!numero || !validarCartao(numero)) {
    alert('Número do cartão inválido. Tente novamente.');
    return;
  }
  alert('Cartão válido! Prosseguindo para confirmação.');
  document.getElementById('qrcode-area').style.display = 'none';
}

// NOVA FUNÇÃO PIX REAL
function pagarPIX() {
  calcularValores();

  const valor = window.valorFinalCalculado.toFixed(2);
  const chavePix = '02964990999';
  const nomeRecebedor = 'Emilly Mainko';
  const cidade = 'SAO PAULO';
  const descricao = 'Pagamento Doceria Pink Delfins';

  function formatField(id, value) {
    const length = value.length.toString().padStart(2, '0');
    return id + length + value;
  }

  let payloadSemCRC =
    formatField("00", "01") +
    formatField("26",
      formatField("00", "BR.GOV.BCB.PIX") +
      formatField("01", chavePix) +
      formatField("02", descricao)
    ) +
    formatField("52", "0000") +
    formatField("53", "986") +
    formatField("54", valor) +
    formatField("58", "BR") +
    formatField("59", nomeRecebedor) +
    formatField("60", cidade) +
    formatField("62", formatField("05", "***")) +
    "6304";

  function crc16(str) {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
      crc ^= str.charCodeAt(c) << 8;
      for (let i = 0; i < 8; i++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  const crc = crc16(payloadSemCRC);
  const payloadFinal = payloadSemCRC + crc;

  const qrCodeDiv = document.getElementById('qrcode');
  qrCodeDiv.innerHTML = '';
  document.getElementById('qrcode-area').style.display = 'block';

  new QRCode(qrCodeDiv, {
    text: payloadFinal,
    width: 250,
    height: 250,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  const info = document.createElement('div');
  info.className = 'nome-valor';
  info.innerHTML = `
    <p><strong>Nome:</strong> ${nomeRecebedor}</p>
    <p><strong>CPF (PIX):</strong> ${chavePix}</p>
    <p><strong>Valor:</strong> R$ ${valor}</p>
  `;
  qrCodeDiv.appendChild(info);
}

function confirmarPagamento() {
  confettiAnimation();
  setTimeout(() => {
    alert('Pagamento confirmado com sucesso! 🎉');
    localStorage.removeItem('carrinho');
    localStorage.removeItem('cupomUsado');
    window.location.href = '../principal/index.html';
  }, 2000);
}

function voltar() {
  window.location.href = '../principal/index.html';
}

function confettiAnimation() {
  const duration = 2000;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    confetti({
      particleCount: 50,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      ...defaults
    });
  }, 200);
}

window.onload = calcularValores;
