# WPPLight

# Ferramenta Veloz de Engenharia Reversa para WhatsApp

## Descrição

Este projeto visa fornecer uma ferramenta de engenharia reversa rápida e eficiente para uso do WhatsApp sem a necessidade de APIs externas. Utilizando técnicas avançadas de engenharia reversa, esta ferramenta permite a interação direta com o WhatsApp, possibilitando o envio e recebimento de mensagens, além de outras funcionalidades essenciais, sem depender de APIs proprietárias.

## Funcionalidades

- **Envio de Mensagens:** Permite o envio de mensagens de texto para contatos e grupos.
- **Recebimento de Mensagens:** Captura e armazena mensagens recebidas.
- **Automação de Tarefas:** Suporte para scripts de automação para interações repetitivas.
- **Integração Simples:** Fácil integração com outros sistemas e ferramentas.
- **Segurança:** Implementações de segurança para garantir a privacidade e a integridade dos dados.

## Requisitos

- **Node.js 18+**
- **Bibliotecas Necessárias:** 
  - `axios`
  - `qrcode-terminal`
  - `fs`
  - `path`
  - `and more...`

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/G4br1e3l/WPPLight
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd WPPLight
    ```
3. Instale as dependências:
    ```bash
    npm i
    ```

## Uso

### Configuração

1. Configure suas credenciais e outros parâmetros no arquivo `config.json`.

### Executando a Ferramenta

1. Para iniciar a ferramenta, execute:
    ```bash
    node WPPLight.js
    ```

2. Siga as instruções no terminal para escanear o QR code e conectar ao WhatsApp.

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`).
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`).
4. Faça o push para a branch (`git push origin feature/AmazingFeature`).
5. Abra um Pull Request.

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.