const extensionApi = globalThis.browser ?? globalThis.chrome;

const inputHoras = document.getElementById('horas');
const inputMinutos = document.getElementById('minutos');
const btnConverter = document.getElementById('btnConverter');
const btnFecharTask = document.getElementById('btnFecharTask');
const btnCopiar = document.getElementById('btnCopiar');
const btnAdicionar = document.getElementById('btnAdicionar');
const btnLimpar = document.getElementById('btnLimpar');
const boxErro = document.getElementById('erro');
const boxResultado = document.getElementById('resultado');
const spanValor = document.getElementById('valorDecimal');
const spanCopiado = document.getElementById('copiado');

let timerCopiado = null;

function validar() {
  const horas = inputHoras.value === '' ? 0 : Number(inputHoras.value);
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

function converter() {
  const valores = validar();

  if (!valores.ok) {
    boxErro.textContent = valores.mensagem;
    boxErro.classList.add('show');
    boxResultado.classList.remove('show');
    return false;
  }

  boxErro.classList.remove('show');
  const decimal = valores.horas + (valores.minutos / 60);
  spanValor.textContent = decimal.toFixed(2).replace('.', ',');
  boxResultado.classList.add('show');
  return true;
}

async function copiarResultado() {
  if (!boxResultado.classList.contains('show') && !converter()) return;

  try {
    await navigator.clipboard.writeText(spanValor.textContent);
  } catch {
    const temporario = document.createElement('textarea');
    temporario.value = spanValor.textContent;
    document.body.appendChild(temporario);
    temporario.select();
    document.execCommand('copy');
    temporario.remove();
  }

  spanCopiado.classList.add('show');
  clearTimeout(timerCopiado);
  timerCopiado = setTimeout(() => spanCopiado.classList.remove('show'), 1800);
}

function limpar() {
  inputHoras.value = '';
  inputMinutos.value = '';
  inputHoras.classList.remove('invalid');
  inputMinutos.classList.remove('invalid');
  boxErro.classList.remove('show');
  boxResultado.classList.remove('show');
  inputHoras.focus();
}

function consultarGuias(queryInfo) {
  if (globalThis.browser) return extensionApi.tabs.query(queryInfo);

  return new Promise((resolve, reject) => {
    extensionApi.tabs.query(queryInfo, tabs => {
      const error = extensionApi.runtime.lastError;
      if (error) reject(new Error(error.message));
      else resolve(tabs);
    });
  });
}

function enviarMensagemUmaVez(tabId, message) {
  if (globalThis.browser) return extensionApi.tabs.sendMessage(tabId, message);

  return new Promise((resolve, reject) => {
    extensionApi.tabs.sendMessage(tabId, message, response => {
      const error = extensionApi.runtime.lastError;
      if (error) reject(new Error(error.message));
      else resolve(response);
    });
  });
}

function ehGuiaAzureDevOps(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === 'dev.azure.com' || hostname.endsWith('.visualstudio.com');
  } catch {
    return false;
  }
}

function executarContentScript(tabId) {
  const details = { target: { tabId }, files: ['content-script.js'] };
  if (globalThis.browser) return extensionApi.scripting.executeScript(details);

  return new Promise((resolve, reject) => {
    extensionApi.scripting.executeScript(details, result => {
      const error = extensionApi.runtime.lastError;
      if (error) reject(new Error(error.message));
      else resolve(result);
    });
  });
}

function receptorNaoExiste(error) {
  return /receiving end does not exist|could not establish connection/i.test(error?.message || '');
}

async function enviarMensagem(tab, message) {
  if (!tab?.id) throw new Error('Não foi possível identificar a guia ativa.');
  if (!ehGuiaAzureDevOps(tab.url)) {
    throw new Error('Abra um item do Azure DevOps em dev.azure.com ou visualstudio.com para usar esta ação.');
  }

  try {
    return await enviarMensagemUmaVez(tab.id, message);
  } catch (error) {
    if (!receptorNaoExiste(error)) throw error;
    await executarContentScript(tab.id);
    return enviarMensagemUmaVez(tab.id, message);
  }
}

async function adicionar() {
  if (!converter()) return;

  boxErro.classList.remove('show');

  try {
    const [tab] = await consultarGuias({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('Não foi possível identificar a guia ativa.');

    const response = await enviarMensagem(tab, {
      type: 'PREENCHER_AZURE',
      value: spanValor.textContent
    });

    if (!response?.success) {
      throw new Error(response?.error || 'Não foi possível preencher o campo do Azure DevOps.');
    }
  } catch (error) {
    boxErro.textContent = error?.message || 'Erro ao enviar dados para a página ativa.';
    boxErro.classList.add('show');
  }
}

btnConverter.addEventListener('click', converter);
btnFecharTask.addEventListener('click', FecharTask);
btnCopiar.addEventListener('click', copiarResultado);
btnAdicionar.addEventListener('click', adicionar);
btnLimpar.addEventListener('click', limpar);
inputHoras.addEventListener('input', converter);
inputMinutos.addEventListener('input', converter);
[inputHoras, inputMinutos].forEach(elemento => {
  elemento.addEventListener('keydown', evento => {
    if (evento.key === 'Enter') converter();
  });
});

inputHoras.focus();

async function FecharTask() {
  boxErro.classList.remove('show');

  try {
    const [tab] = await consultarGuias({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('Não foi possível identificar a guia ativa.');

    const response = await enviarMensagem(tab, { type: 'FECHAR_TASK' });
    if (!response) {
      throw new Error('A página do Azure não respondeu. Atualize a aba do Azure e tente novamente.');
    }
    if (!response?.success) {
      throw new Error(response.error || 'Não foi possível calcular o tempo da task.');
    }

    spanValor.textContent = response.value;
    boxResultado.classList.add('show');
  } catch (error) {
    boxErro.textContent = error?.message || 'Erro ao acessar a página do Azure DevOps.';
    boxErro.classList.add('show');
  }
}
