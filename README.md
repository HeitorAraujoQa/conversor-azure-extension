# Conversor de Horas — Azure DevOps

Extensão de navegador que converte **horas e minutos** para o formato **decimal**
usado nos lançamentos de tempo do Azure DevOps.

> Fórmula: `horas decimais = horas + (minutos / 60)`, arredondado para 2 casas.
> Exemplo: **1h40 = 1,67** (nunca 1,40).

<p align="center">
  <img src="docs/popup.png" alt="Popup da extensão Conversor de horas — Azure DevOps" width="360">
</p>

---

## Instalação no Google Chrome

A extensão ainda não está publicada na Web Store — a instalação é feita
manualmente ("sem compactação"). Leva menos de um minuto.

1. Baixe ou clone esta pasta para o seu computador.
2. Abra o Chrome e acesse `chrome://extensions` na barra de endereço.
3. Ative o **Modo do desenvolvedor** no canto superior direito.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta do projeto (a que contém o arquivo `manifest.json`).
6. Pronto! O ícone (losango azul) aparece na barra de extensões. Clique nele
   para abrir o conversor.

> 💡 Fixe o ícone: clique no quebra-cabeça 🧩 na barra do Chrome e no alfinete
> ao lado de "Conversor de Horas".

**Para atualizar após mudanças:** volte em `chrome://extensions` e clique no
botão de recarregar (⟳) no card da extensão.

O mesmo procedimento vale para navegadores baseados em Chromium — **Microsoft
Edge** (`edge://extensions`), **Brave** (`brave://extensions`) e **Opera**.

---

## Instalação no Mozilla Firefox

No Firefox a extensão é carregada como **complemento temporário** — ela funciona
normalmente, mas é removida quando o navegador é fechado. Basta repetir o
processo na próxima vez que precisar.

1. Baixe ou clone esta pasta para o seu computador.
2. Abra o Firefox e acesse `about:debugging` na barra de endereço.
3. No menu à esquerda, clique em **Este Firefox** (*This Firefox*).
4. Clique em **Carregar complemento temporário…** (*Load Temporary Add-on…*).
5. Navegue até a pasta do projeto e selecione o arquivo **`manifest.json`**.
6. Pronto! O ícone aparece na barra de ferramentas. Clique nele para abrir o
   conversor.

**Para atualizar após mudanças:** na mesma tela `about:debugging`, clique em
**Recarregar** (*Reload*) no card da extensão.

> ⚠️ Complementos temporários somem ao reiniciar o Firefox. Para uma instalação
> permanente é necessário empacotar e assinar a extensão pela
> [Mozilla Add-ons (AMO)](https://addons.mozilla.org/developers/) — ainda não
> feito neste projeto.

---

## Como usar

1. Clique no ícone da extensão.
2. Digite as **horas** e os **minutos** trabalhados.
3. O valor decimal aparece automaticamente (ex.: `1` hora e `40` min → `1,67`).
4. Leve o resultado ao Azure DevOps de uma destas formas:
   - **Copiar** — copia o valor decimal para a área de transferência e você cola
     manualmente no campo desejado.
   - **Adicionar automaticamente** — veja abaixo.
   - **Limpar** — zera os campos.

Há também uma **tabela de referência** recolhível (5min = 0,08 … 60min = 1,00)
dentro do popup.

### Adicionar automaticamente ao Azure

Se você estiver com o **item do Azure DevOps aberto** (aquele em que a hora deve
ser lançada):

1. Preencha os campos de **Horas** e **Minutos** no popup.
2. Clique em **Adicionar automaticamente**.
3. A extensão insere o valor decimal diretamente no campo **Horas Realizadas
   (Completed Work)** do item — sem precisar copiar e colar.

---

## Versão standalone (sem instalar)

O arquivo [`index.html`](index.html) é uma versão avulsa do conversor. Basta
abri-lo no navegador (duplo clique) — não requer instalação de extensão.

---

## Solução de problemas

| Problema | Solução |
| --- | --- |
| "Manifest não encontrado" | Selecione a pasta que contém o `manifest.json` (Chrome) ou o próprio arquivo `manifest.json` (Firefox). |
| Ícone não aparece | Verifique se a pasta `icons/` está junto do `manifest.json`. |
| Mudanças não refletem | Recarregue a extensão (⟳ no Chrome / Reload no Firefox). |
| Extensão sumiu no Firefox | É esperado após reiniciar — recarregue como complemento temporário. |
