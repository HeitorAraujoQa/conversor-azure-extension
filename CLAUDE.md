# Conversor de Horas — Azure DevOps (Extensão Chrome)

## O que é este projeto

Extensão do Chrome (Manifest V3, popup) que converte horas e minutos para o
formato decimal usado nos lançamentos de tempo do Azure DevOps.

Fórmula: `horas decimais = horas + (minutos / 60)`, arredondado para 2 casas.
Exibição sempre com vírgula como separador decimal (pt-BR).
Atenção: 1h40 = 1,67 — nunca 1,40.

## Estrutura

- `manifest.json` — Manifest V3, sem permissões (propósito único, revisão rápida na Web Store)
- `popup.html` — UI completa com CSS inline no `<style>`; largura fixa de 380px (popups não têm viewport de página)
- `popup.js` — toda a lógica; JS externo é obrigatório (MV3 proíbe script inline por CSP)
- `icons/` — losango azul #0078D4 em 16/48/128px

Existe também uma versão standalone anterior (`index.html` único, responsivo,
com media queries) que deu origem a este projeto — a extensão é a adaptação dela.

## Decisões de design

- Visual Fluent/Azure: fonte Segoe UI, azul primário #0078D4, cinza #F3F2F1 de fundo, cards com sombra sutil, border-radius 4px
- Tabela de referência (5min=0,08 ... 60min=1,00) dentro de `<details>` recolhível para não alongar o popup
- Validações: horas inteiras ≥ 0; minutos inteiros entre 0 e 59; campos vazios tratados como 0; mensagens de erro em pt-BR com destaque vermelho no campo inválido
- Conversão automática no evento `input`, além do botão "Converter para horas do Azure"
- Botão copiar usa `navigator.clipboard` com fallback para `execCommand`

## Regras para alterações

- Manter todo o texto da UI em português
- Não adicionar `permissions` ao manifest sem necessidade real — quebra a revisão rápida e a política de propósito único da Web Store
- Não adicionar script inline no HTML (CSP do MV3)
- Manter propósito único: só conversão de horas; funcionalidades não relacionadas devem virar outra extensão

## Como testar

1. `chrome://extensions` → ativar Modo do desenvolvedor
2. "Carregar sem compactação" → selecionar esta pasta
3. Após cada alteração, clicar no botão de recarregar da extensão

## Publicação (Chrome Web Store)

- Zip com os arquivos na raiz (não a pasta dentro do zip): `zip -r conversor-azure.zip manifest.json popup.html popup.js icons/`
- Dashboard: https://chrome.google.com/webstore/devconsole — taxa única de US$ 5
- Usar e-mail da organização (Rocket IT), não conta pessoal
- Visibilidade "não listada" para uso interno da equipe (compartilhar por link)
- Extensão não coleta dados — declarar isso na aba Privacy
- Atualizações: incrementar `version` no manifest, gerar novo zip, reenviar no mesmo item

## Backlog de ideias

- `chrome.storage.local` para lembrar o último valor convertido
- Atalho de teclado via `"commands"` no manifest para abrir o popup
- Conversão inversa (decimal → horas e minutos)
