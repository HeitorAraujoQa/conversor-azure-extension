// ==========================================================
// Conversor de horas → decimal (Azure DevOps)
// Fórmula: horas decimais = horas + (minutos / 60)
// ==========================================================

const inputHoras   = document.getElementById('horas');
const inputMinutos = document.getElementById('minutos');
const btnConverter = document.getElementById('btnConverter');
const btnCopiar    = document.getElementById('btnCopiar');
const btnLimpar    = document.getElementById('btnLimpar');
const boxErro      = document.getElementById('erro');
const boxResultado = document.getElementById('resultado');
const spanValor    = document.getElementById('valorDecimal');
const spanCopiado  = document.getElementById('copiado');

let timerCopiado = null;

// ----------------------------------------------------------
// Validação: horas ≥ 0 (inteiro), minutos entre 0 e 59
// ----------------------------------------------------------
function validar() {
  const horas   = inputHoras.value === ''   ? 0 : Number(inputHoras.value);
  const minutos = inputMinutos.value === '' ? 0 : Number(inputMinutos.value);

  inputHoras.classList.remove('invalid');
  inputMinutos.classList.remove('invalid');

  if (!Number.isFinite(horas) || !Number.isInteger(horas)) {
    inputHoras.classList.add('invalid');
    return { ok: false, mensagem: 'Informe as horas como um número inteiro.' };
  }
  if (horas < 0) {
    inputHoras.classList.add('invalid');
    return { ok: false, mensagem: 'As horas não podem ser negativas.' };
  }
  if (!Number.isFinite(minutos) || !Number.isInteger(minutos)) {
    inputMinutos.classList.add('invalid');
    return { ok: false, mensagem: 'Informe os minutos como um número inteiro.' };
  }
  if (minutos < 0 || minutos > 59) {
    inputMinutos.classList.add('invalid');
    return { ok: false, mensagem: 'Os minutos devem estar entre 0 e 59.' };
  }

  return { ok: true, horas, minutos };
}

// ----------------------------------------------------------
// Conversão com arredondamento para 2 casas e vírgula
// ----------------------------------------------------------
function converter() {
  const v = validar();

  if (!v.ok) {
    boxErro.textContent = v.mensagem;
    boxErro.classList.add('show');
    boxResultado.classList.remove('show');
    return;
  }

  boxErro.classList.remove('show');

  const decimal = v.horas + (v.minutos / 60);
  spanValor.textContent = decimal.toFixed(2).replace('.', ',');
  boxResultado.classList.add('show');
}

// ----------------------------------------------------------
// Copiar resultado para a área de transferência
// ----------------------------------------------------------
async function copiarResultado() {
  if (!boxResultado.classList.contains('show')) converter();
  if (!boxResultado.classList.contains('show')) return; // erro de validação

  try {
    await navigator.clipboard.writeText(spanValor.textContent);
  } catch {
    // Fallback raro em popups de extensão
    const tmp = document.createElement('textarea');
    tmp.value = spanValor.textContent;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
  }

  spanCopiado.classList.add('show');
  clearTimeout(timerCopiado);
  timerCopiado = setTimeout(() => spanCopiado.classList.remove('show'), 1800);
}

// ----------------------------------------------------------
// Limpar campos e mensagens
// ----------------------------------------------------------
function limpar() {
  inputHoras.value = '';
  inputMinutos.value = '';
  inputHoras.classList.remove('invalid');
  inputMinutos.classList.remove('invalid');
  boxErro.classList.remove('show');
  boxResultado.classList.remove('show');
  inputHoras.focus();
}

// ----------------------------------------------------------
// Eventos
// ----------------------------------------------------------
btnConverter.addEventListener('click', converter);
btnCopiar.addEventListener('click', copiarResultado);
btnLimpar.addEventListener('click', limpar);

// Conversão automática ao digitar
inputHoras.addEventListener('input', converter);
inputMinutos.addEventListener('input', converter);

// Enter também converte
[inputHoras, inputMinutos].forEach(el =>
  el.addEventListener('keydown', e => { if (e.key === 'Enter') converter(); })
);

// Foco inicial ao abrir o popup
inputHoras.focus();
