const extensionApi = globalThis.browser ?? globalThis.chrome;

extensionApi.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'PREENCHER_AZURE') return false;

  const inputAzure = document.querySelector('#__bolt-Realizado-input');
  if (!inputAzure) {
    sendResponse({ success: false, error: 'Campo Realizado do Azure DevOps não encontrado.' });
    return false;
  }

  // O setter nativo permite que controles gerenciados pelo React percebam a mudança.
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  if (valueSetter) valueSetter.call(inputAzure, message.value);
  else inputAzure.value = message.value;

  inputAzure.dispatchEvent(new Event('input', { bubbles: true }));
  inputAzure.dispatchEvent(new Event('change', { bubbles: true }));
  inputAzure.focus();
  sendResponse({ success: true });
  return false;
});