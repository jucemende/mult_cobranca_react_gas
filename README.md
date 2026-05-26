# MultCobranças — Documentação Técnica
 
> Sistema de gestão de cobranças construído sobre Google Apps Script com frontend React.  
> Versão do documento: 1.0 | Ambiente: Google Workspace
 
---
 
## Sumário
 
1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Fluxo de Dados](#5-fluxo-de-dados)
6. [Backend](#6-backend)
   - 6.1 [Ponto de Entrada](#61-ponto-de-entrada)
   - 6.2 [Roteamento](#62-roteamento)
   - 6.3 [Camada de Domínio](#63-camada-de-domínio)
   - 6.4 [Repositórios (Infra)](#64-repositórios-infra)
   - 6.5 [Use Cases](#65-use-cases)
   - 6.6 [Controllers e DTOs](#66-controllers-e-dtos)
   - 6.7 [Presentation Layer](#67-presentation-layer)
   - 6.8 [Banco de Dados (SQSheets)](#68-banco-de-dados-sqsheets)
   - 6.9 [Sistema de Cache](#69-sistema-de-cache)
   - 6.10 [Migrations](#610-migrations)
   - 6.11 [Bootstrap Index](#611-bootstrap-index)
7. [Domínios de Negócio](#7-domínios-de-negócio)
   - 7.1 [Clientes](#71-clientes)
   - 7.2 [Faturas](#72-faturas)
   - 7.3 [Cobranças](#73-cobranças)
   - 7.4 [Régua de Cobrança](#74-régua-de-cobrança)
   - 7.5 [Encargos](#75-encargos)
   - 7.6 [Vendedores](#76-vendedores)
   - 7.7 [Dashboard](#77-dashboard)
8. [Frontend](#8-frontend)
   - 8.1 [Estrutura React sem Build](#81-estrutura-react-sem-build)
   - 8.2 [Comunicação com Backend](#82-comunicação-com-backend)
   - 8.3 [Gerenciamento de Estado](#83-gerenciamento-de-estado)
   - 8.4 [Sistema de Filtros](#84-sistema-de-filtros)
   - 8.5 [Componentes](#85-componentes)
9. [Envio de Cobranças](#9-envio-de-cobranças)
   - 9.1 [Por WhatsApp](#91-por-whatsapp)
   - 9.2 [Por Email](#92-por-email)
   - 9.3 [Envio em Massa (BulkEmail)](#93-envio-em-massa-bulkemail)
10. [Migrations e Setup Inicial](#10-migrations-e-setup-inicial)
11. [Referência da API Interna](#11-referência-da-api-interna)
12. [Padrões e Convenções](#12-padrões-e-convenções)
13. [Glossário](#13-glossário)
---
 
## 1. Visão Geral
 
O **MultCobranças** é uma aplicação web de gestão do ciclo de cobrança, projetada para equipes financeiras que precisam acompanhar faturas em aberto, acionar clientes inadimplentes e registrar histórico de contatos.
 
### Principais funcionalidades
 
| Funcionalidade | Descrição |
|---|---|
| Gestão de Clientes | Cadastro, edição e classificação de clientes por status e tipo |
| Gestão de Faturas | Importação via CSV e manutenção manual de títulos em aberto |
| Régua de Cobrança | Configuração de fases e intervalos de atraso com mensagens personalizadas |
| Encargos | Configuração de multa e juros por tipo e recorrência |
| Cobranças | Registro de contatos, envio por WhatsApp e Email |
| Envio em Massa | Disparo automático de emails para todos os clientes elegíveis |
| Dashboard | KPIs, aging de carteira, canais de cobrança e status de clientes |
 
### Tecnologias principais
 
- **Backend:** Google Apps Script (V8 runtime)
- **Frontend:** React 18 + React Query 4 + Chart.js 4
- **Banco de dados:** Google Sheets (via classe `SQSheets`)
- **Email:** Gmail API (via `GmailApp`)
- **Ícones:** Lucide
- **Transpilação:** Babel Standalone (em tempo de execução no browser)
---
 
## 2. Stack Tecnológica
 
### Por que Google Apps Script?
 
O Apps Script permite criar aplicações web sem infraestrutura de servidor, hospedando tudo dentro do ecossistema Google. A base de dados em Sheets oferece visibilidade direta para usuários não técnicos.
 
### Por que React sem build?
 
O frontend usa React, ReactDOM e Babel carregados via CDN. O Babel Standalone transpila JSX diretamente no browser, eliminando a necessidade de Node.js, Webpack ou qualquer pipeline de build. Isso é viável porque o Google Apps Script serve o HTML como template server-side, incluindo os `<script>` no momento da renderização.
 
```
Browser ←── HTML Template ←── Apps Script (doGet)
    |
    └── React + Babel (CDN) → JSX compilado em runtime
```
 
---
 
## 3. Arquitetura do Sistema
 
O projeto segue uma **arquitetura em camadas** inspirada em Clean Architecture / DDD:
 
```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  Views → Hooks (React Query) → googleFetch() → GAS Run  │
└────────────────────────┬────────────────────────────────┘
                         │ google.script.run
┌────────────────────────▼────────────────────────────────┐
│                    BACKEND (Apps Script)                  │
│                                                          │
│  doGet / fetchApp                                        │
│       │                                                  │
│  app(request) ──► RouterRegistry                         │
│       │                                                  │
│  *Routers ──► *Controller ──► *Service / UseCase         │
│                                    │                     │
│                            *Repository (interface)       │
│                                    │                     │
│                      Sheets*Repository (infra)           │
│                                    │                     │
│                              SQSheets (ORM)              │
│                                    │                     │
│                           Google Sheets API              │
└─────────────────────────────────────────────────────────┘
```
 
### Camadas
 
| Camada | Responsabilidade |
|---|---|
| **Interface** | Receber requisições, delegar ao controller, retornar resposta |
| **Controller** | Orquestrar use cases, DTOs e presentation |
| **Use Case** | Regras de negócio, validações e orquestração |
| **Domain** | Entidades com invariantes e contratos de repositório |
| **Infra** | Implementação concreta de repositórios (Sheets) |
| **Presentation** | Formatação de dados para o frontend (tabelas, filtros, enumerações) |
 
---
 
## 4. Estrutura de Pastas
 
```
mult_cobranca_react_gas/
├── appsscript.json                  # Configurações do Apps Script
├── skeep.md                         # Documento de arquitetura interno
│
├── backend/
│   ├── server.gs                    # Ponto de entrada público
│   ├── serverApp.gs                 # Roteador principal e parseQuery
│   │
│   └── shared/
│       ├── BaseDTO.gs               # Classe base para DTOs com validações
│       ├── BuildFilters.gs          # Sistema de filtros dinâmicos
│       └── databese/
│           ├── SQSheets.gs          # ORM para Google Sheets
│           └── Migrations.gs        # Runner de migrations de schema
│       └── middleware/
│           └── BootstrapIndex.gs    # Índices em memória para lookups
│
│   └── src/models/
│       ├── clientes/
│       ├── cobrancas/
│       ├── dashboard/
│       ├── encargos/
│       ├── faturas/
│       ├── regua/
│       └── vendedor/
│
│   # Cada domínio contém:
│   # ├── domain/           → Entidade + contrato de repositório
│   # ├── infra/            → SheetsXRepository
│   # ├── interface/        → Controller + Router + DTOs
│   # ├── useCase/          → Service / UseCase
│   # └── presentation/     → Configuração de tabelas e filtros
│
└── frontend/
    ├── index.html                   # Página principal (template GAS)
    ├── style.html                   # Estilos globais
    │
    ├── componentes/
    │   ├── Loading.html
    │   ├── Navbar.html
    │   ├── Table.html
    │   ├── Select.html
    │   └── forms/
    │       ├── FormCliente.html
    │       ├── FormCobrancas.html
    │       ├── FormEncargos.html
    │       ├── FormFaturas.html
    │       ├── FormFiltro.html
    │       ├── FormHistorico.html
    │       ├── FormRegua.html
    │       └── FormVendedor.html
    │
    ├── views/
    │   ├── Clientes.html
    │   ├── Cobrancas.html
    │   ├── Configuracoes.html
    │   ├── Dashboard.html
    │   └── Vendedores.html
    │
    └── src/
        ├── service/api.html          # googleFetch() wrapper
        └── hooks/
            ├── Clientes.html
            ├── Cobrancas.html
            ├── Configuracoes.html
            ├── Faturas.html
            ├── Filtros.html
            └── Vendedores.html
```
 
---
 
## 5. Fluxo de Dados
 
### Requisição completa (GET com filtros)
 
```
1. Usuário digita na busca → handleChange() com debounce 600ms
2. queryString construída: "cliente=ACME&status=ATIVO"
3. useQuery dispara → googleFetch().get('clientes-list', queryString)
4. google.script.run.fetchApp({ method:'GET', url:'clientes-list?cliente=ACME&status=ATIVO' })
5. fetchApp → segura(app)(request) [wrapper de try/catch]
6. app() → parseQuery(queryString) → { cliente: [{op:'=', value:'ACME'}] }
7. RouterRegistry['clientes'] → ClienteRouters(request)
8. ClienteController.get({ params })
9. ClienteService.getAll(params)
10.  SheetsClienteRepository.getAll() → SQSheets.load() → cache ou Sheets
11.  applyAdvancedSearch() → applyFilters()
12.  return { data: rows, presentation: clientesPresentation() }
13. { success: true, response: { data, presentation } }
14. React Query recebe e atualiza componente
```
 
### Tratamento de erros
 
```
fetchApp → segura(fn)(args)
  ├── success: true  → { success: true, response: resultado }
  └── success: false → { success: false, message: err.message }
 
googleFetch:
  ├── res.success === false → reject(new Error(res.message))
  └── erro de rede → reject(err)
 
React Query:
  └── onError: (err) => showToast("Ops! " + err.message, "error")
```
 
---
 
## 6. Backend
 
### 6.1 Ponto de Entrada
 
**`backend/server.gs`**
 
```javascript
// Serve a aplicação web
function doGet() {
  const template = HtmlService.createTemplateFromFile('frontend/index');
  return template.evaluate()
    .setTitle('MultCobranças')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
 
// Inclui arquivos parciais no template (SSR de componentes)
function include(file, params = {}) { ... }
 
// Wrapper de segurança: captura exceções e padroniza resposta
function segura(fn) { ... }
 
// Ponto de entrada de todas as chamadas do frontend
function fetchApp(request = {}) {
  return segura(app)(request)
}
```
 
### 6.2 Roteamento
 
**`backend/serverApp.gs`**
 
O roteador principal extrai o domínio da URL e delega ao roteador correto:
 
```javascript
const RouterRegistry = {
  encargos:  EncargosRouters,
  reguas:    ReguaRouters,
  vendedores: VendedorRouters,
  clientes:  ClienteRouters,
  faturas:   FaturasRouters,
  cobrancas: CobrancasRouters,
  dashboard: DashboardRouters,
};
 
function app(request) {
  const { method = 'GET', url, body } = request;
  let [path, queryString] = url.split('?');
  const params = parseQuery(queryString);
 
  let domain = path.split('/').filter(Boolean)[0].split('-')[0]; // "cobrancas-list" → "cobrancas"
  const router = RouterRegistry[domain];
 
  return router({ method, path, body, params });
}
```
 
#### Formato das URLs internas
 
| URL | Domínio extraído | Roteador |
|---|---|---|
| `clientes` | `clientes` | ClienteRouters |
| `clientes/abc-123` | `clientes` | ClienteRouters |
| `cobrancas-list` | `cobrancas` | CobrancasRouters |
| `cobrancas-view/9419` | `cobrancas` | CobrancasRouters |
| `faturas-agrupadas` | `faturas` | FaturasRouters |
 
#### Query String parsing
 
```
"cliente=ACME&diasAtraso>=30&diasAtraso<=90"
→ {
    cliente:    [{ op: '=',  value: 'ACME' }],
    diasAtraso: [{ op: '>=', value: 30 }, { op: '<=', value: 90 }]
  }
```
 
Operadores suportados: `=`, `!=`, `>`, `<`, `>=`, `<=`
 
### 6.3 Camada de Domínio
 
Cada entidade de domínio é uma classe que encapsula validações e invariantes de negócio. Segue o padrão de **factory estática** (`criar`) e **imutabilidade via `upDates`**.
 
#### Exemplo: entidade `Cliente`
 
```javascript
class Cliente {
  constructor(propsCliente = {}) {
    // Valida que todos os campos obrigatórios foram fornecidos
    this._validaPreenchimento(props);
 
    this._status = this._validarStatus(props.status);
    this._tipo   = this._validarTipo(props.tipo);
    this._cnpjCpf = this._validarCnpjCPF(props.cnpjCpf);
    this._permiteNotificacao = this._validaPerimissao(props.permiteNotificacao);
    // ...
  }
 
  // Só clientes ATIVOS podem receber notificações
  _validaPerimissao(valor) {
    if (this._status !== 'ATIVO' && valor === true) {
      throw new Error('Somente clientes ativos podem receber notificações');
    }
    return valor;
  }
 
  static criar(props) { return new Cliente(props) }
 
  upDates(props) {
    return new Cliente({ ...this._toProps(), ...props, criadoEm: this._criadoEm })
  }
}
```
 
#### Entidades e seus schemas obrigatórios
 
| Entidade | Campos obrigatórios (undefined proibido) |
|---|---|
| `Cliente` | `cod`, `cliente`, `status`, `permiteNotificacao` |
| `Fatura` | `documento`, `codCliente`, `vencimento`, `vlrLiquido`, `possuiEncargos` |
| `Cobranca` | `documento`, `codCliente`, `diasAtraso`, `vlrLiquido`, `dataContato`, `reguaId`, `canal`, `acao`, `status` |
| `Regua` | `faseRegua`, `titulo`, `atrasoDe`, `atrasoAte`, `acoesRegua`, `mensagemPadrao` |
| `Encargo` | `taxaJuros`, `tipoCobranca`, `aplicacao`, `recorrencia` |
| `Vendedor` | `vendedor`, `email` |
 
#### Regras de negócio nas entidades
 
**Fatura:**
- `possuiEncargos = true` → `tipoDocumento = MENSALIDADE`
- `possuiEncargos = false` → `tipoDocumento = REEMBOLSO`
- `diasAtraso` calculado automaticamente, respeitando fins de semana
**Encargo:**
- `MULTA` só pode ser aplicada em `ATRASO` com recorrência `UNICA`
- `JUROS` em `PARCELAMENTO` exige recorrência `MENSAL`
- `JUROS` em `ATRASO` exige recorrência `DIARIA`
**Régua:**
- Fase `PREVENTIVA`: `atrasoAte` deve ser ≤ 0 e não permite bloqueio
- `atrasoAte` não pode ser > 1826 dias (5 anos)
- `atrasoAte` deve ser maior que `atrasoDe`
### 6.4 Repositórios (Infra)
 
Cada domínio tem uma **interface abstrata** e uma **implementação concreta** para Google Sheets.
 
```javascript
// Interface (contrato)
class ClienteRepository {
  getAll(params)                { throw new Error('não implementado') }
  getById(id)                   { throw new Error('não implementado') }
  insert(cliente)               { throw new Error('não implementado') }
  update(cliente)               { throw new Error('não implementado') }
  applyFilters(rows, params)    { throw new Error('não implementado') }
  applyAdvancedSearch(rows, v)  { throw new Error('não implementado') }
  validateDuplicate(ignoreId)   { throw new Error('não implementado') }
}
 
// Implementação concreta
class SheetsClienteRepository extends ClienteRepository {
  constructor() {
    this.db = new SQSheets({ tableName: 'bdClientes', idField: 'id' });
  }
 
  _toEntity(row) { return Cliente.criar({ id: row.id, cod: row.cod, ... }) }
  _toPersistence(cliente) { return { id: cliente.id, cod: cliente.cod, ... } }
}
```
 
#### Mapeamento de colunas (snake_case no Sheets → camelCase no domínio)
 
| Coluna no Sheets | Propriedade no domínio |
|---|---|
| `id_vendedor` | `idVendedor` |
| `cnpj_cpf` | `cnpjCpf` |
| `permite_notificacao` | `permiteNotificacao` |
| `vlr_liquido` | `vlrLiquido` |
| `data_contato` | `dataContato` |
| `regua_id` | `reguaId` |
| `criado_em` | `criadoEm` |
 
### 6.5 Use Cases
 
Use Cases orquestram entidades e repositórios, implementando as regras de negócio de alto nível.
 
#### ClienteService
 
```javascript
class ClienteService {
  create(data) {
    const cliente = Cliente.criar({ ...schemaDomainCliente(), ...data })
    this._validaDuplicidade(cliente)           // valida código e CPF/CNPJ
    cliente.id = Utilities.getUuid()
    return this.repository.insert(cliente)
  }
 
  _validaDuplicidade(cliente, id = null) {
    const { existsCod, existsCpfCnpj } = this.repository.validateDuplicate(id)
    if (existsCod(cliente.cod))       throw new Error(`Código ${cliente.cod} já cadastrado`)
    if (existsCpfCnpj(cliente.cnpjCpf)) throw new Error(`${cliente.tipo} já cadastrado`)
  }
}
```
 
#### FaturasUseCase
 
Além do CRUD, gerencia a **importação via CSV**:
 
```
importCsv(data):
  1. _validateImportData()     → valida cabeçalhos do CSV
  2. _normalizeImportRows()    → converte linhas para objetos padronizados
  3. _removeDuplicatedDocuments() → deduplica por número de documento
  4. _clearFaturasSheet()      → limpa a aba antes de reimportar
  5. _createFaturas()          → cria entidades Fatura
  6. _persistFaturas()         → salva todas de uma vez (batch insert)
  7. _createMissingClients()   → cria clientes ausentes encontrados no CSV
```
 
#### CobrancasUseCase
 
```javascript
class CobrancasUseCase {
  getAll(params) {
    // Agrupa cobranças por documento, exibe apenas a última
    // Filtra apenas documentos que ainda têm fatura aberta
  }
 
  _getReguaPrincipal(faturas) {
    // Encontra a régua mais severa que cobre o diasAtraso das faturas
    // Estratégia: maior atrasoDe entre as réguas que fazem match
  }
}
```
 
### 6.6 Controllers e DTOs
 
Controllers recebem a requisição já parseada pelo router e retornam dados prontos para o frontend.
 
```javascript
class ClienteController {
  static get({ id, params }) {
    if (id) {
      return {
        data:      this.service().getById(id),
        status:    getEnunsClientes().statusCliente,  // enumerações para o form
        vendedores: BootstrapIndex().vendedores()      // lista para select
      }
    }
    return {
      data:         this.service().getAll(params),
      presentation: clientesPresentation()            // configuração de tabela
    }
  }
}
```
 
**DTOs** são classes que validam e tipam os dados de entrada:
 
```javascript
class ClienteCreatDTO extends BaseDTO {
  constructor({ cliente, tipo, cnpjCpf, status, permiteNotificacao, ... }) {
    this.cliente  = this._isString(cliente, 'Nome do Cliente')  // obrigatório
    this.telefone = this._isString(telefone, 'Telefone', false)  // opcional
    this.criado_em = this._isISODate(criado_em, 'Criado em', false)
  }
}
```
 
**BaseDTO** provê os helpers de validação: `_isString`, `_isNumber`, `_isFloat`, `_isISODate`.
 
### 6.7 Presentation Layer
 
A camada de presentation define como os dados são exibidos no frontend, descrevendo tabelas, filtros e enumerações de forma declarativa.
 
```javascript
function clientesPresentation() {
  return {
    tableHeaders: [
      { key: 'cod',    label: 'Cód.' },
      { key: 'status', label: 'Status', style: styles.status } // com tag colorida
    ],
    actions: [
      { type: 'edit-clientes', title: 'Editar', icon: 'square-pen' }
    ],
    filtersLayout: [
      { type: 'row', columns: 1, children: [
        { type: 'field', name: 'status' }
      ]}
    ],
    fields: {
      status: {
        element: 'select',
        name: 'status',
        label: 'Status',
        options: enuns.status,
        op: '='
      }
    }
  }
}
```
 
Tipos de elementos de filtro suportados: `select`, `input`, `date`, `radio`, `checkbox`.
 
### 6.8 Banco de Dados (SQSheets)
 
`SQSheets` é um mini-ORM que abstrai o acesso ao Google Sheets:
 
```javascript
class SQSheets {
  // Lê toda a aba, converte para array de objetos
  load()        // com cache automático em CacheService
 
  select()      // alias para load()
  insert(row)   // aceita objeto único ou array (batch)
  update(id, newData) // busca a linha pelo idField e atualiza
  delete(id)    // remove a linha do Sheets
}
```
 
#### Schema das tabelas
 
| Tabela | Campos principais |
|---|---|
| `bdClientes` | id, cod, id_vendedor, cliente, tipo, cnpj_cpf, telefone, email, status, permite_notificacao, obs, criado_em |
| `bdFaturasAbertas` | id, documento, cod, vencimento, vlr_liquido, possui_encargos, criado_em |
| `bdCobrancas` | id, documento, cliente_id, dias_atraso, vlr_liquido, data_contato, regua_id, canal, acao, status, criado_em |
| `bdConfigRegua` | id, fase_regua, titulo, atraso_de, atraso_ate, acoes_regua, permite_bloqueio, mensagem_padrao, criado_em |
| `bdConfigEncargos` | id, taxa_juros, tipo_cobranca, aplicacao, recorrencia, criado_em |
| `bdVendedores` | id, vendedor, email, comissao, criado_em |
 
### 6.9 Sistema de Cache
 
`SQSheets.load()` usa `CacheService.getScriptCache()` para evitar leituras repetidas ao Sheets:
 
```javascript
load() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(this.tableName);
  if (cached) { /* deserializa e retorna */ }
 
  // Lê do Sheets, normaliza datas
  const cleanRows = rows.map(row =>
    row.map(cell => cell instanceof Date ? cell.toISOString() : cell || null)
  );
 
  // Salva se payload < 100KB
  if (cachePayload.length < 100000) {
    cache.put(this.tableName, cachePayload, 0);
  }
}
```
 
Toda operação de escrita (`insert`, `update`, `delete`) invalida o cache da tabela afetada.
 
### 6.10 Migrations
 
`runMigrations()` verifica e cria abas no Sheets automaticamente. Deve ser executada manualmente no editor do Apps Script na primeira configuração.
 
```
runMigrations():
  Para cada schema em MIGRATION_SCHEMAS:
    ├── Aba não existe → cria + insere cabeçalhos + formata
    ├── Aba vazia      → insere cabeçalhos
    └── Aba existente  → verifica colunas faltantes e adiciona ao final
```
 
**Não destrói dados existentes.** Apenas adiciona estrutura ausente.
 
### 6.11 Bootstrap Index
 
`BootstrapIndex()` cria índices em memória para lookups O(1), evitando queries repetidas ao Sheets dentro de um mesmo request:
 
```javascript
function BootstrapIndex() {
  const clientes  = () => ({ [cod]: clienteObj })    // indexado por cod
  const faturas   = () => ({ [documento]: faturaObj }) // indexado por documento
  const vendedores = () => ({ [id]: vendedorObj })   // indexado por id
  const encargos  = () => ({ [recorrencia]: encargoObj }) // indexado por recorrência
  const regua     = () => ({ [id]: reguaObj })        // indexado por id
  const cobrancas = () => ({ [documento]: [cobrancas] }) // indexado por documento (array)
}
```
 
---
 
## 7. Domínios de Negócio
 
### 7.1 Clientes
 
#### Enumerações
 
```
statusCliente: ATIVO | CANCELADO | INATIVO | SUSPENSO
tipoPessoa:    CNPJ | CPF
```
 
#### Validações de negócio
 
- CNPJ deve ter 18 caracteres (formato `00.000.000/0000-00`)
- CPF deve ter 14 caracteres (formato `000.000.000-00`)
- Apenas clientes `ATIVO` podem ter `permiteNotificacao = true`
- `cod` e `cnpjCpf` devem ser únicos
#### Endpoints
 
| Método | URL | Descrição |
|---|---|---|
| GET | `clientes` | Lista todos os clientes com presentation |
| GET | `clientes/{id}` | Busca cliente por ID com enumerações para o form |
| POST | `clientes` | Cria novo cliente |
| PUT | `clientes/{id}` | Atualiza cliente existente |
 
### 7.2 Faturas
 
#### Enumerações
 
```
status:        ABERTA | VENCIDA
tipoDocumento: MENSALIDADE | REEMBOLSO
```
 
#### Cálculo de encargos
 
```javascript
calcularEncargos({ taxaJuros, taxaMulta }) {
  const multa = vlrLiquido * taxaMulta
  const juros = vlrLiquido * (diasAtraso * taxaJuros)
  const total = vlrLiquido + multa + juros
  return { multa, juros, total }
}
```
 
#### Cálculo de atraso (com ajuste de fim de semana)
 
```javascript
_verificaAtraso(date) {
  const vencimento = new Date(date);
  const diaSemana  = vencimento.getUTCDay();
  if (diaSemana === 6) vencimento.setUTCDate(vencimento.getUTCDate() + 2); // sábado → segunda
  if (diaSemana === 0) vencimento.setUTCDate(vencimento.getUTCDate() + 1); // domingo → segunda
  return Math.floor((today - vencimento) / (1000 * 60 * 60 * 24));
}
```
 
#### Importação via CSV
 
O CSV deve conter as colunas: `Cód.`, `Cód.Cliente`, `Contato`, `Dt. Venc.`, `Valor`, `Baixado`, `Dt. Baixa`, `Total`, `Histórico`
 
O parser suporta CSV com separador `;`, aspas duplas e encodings UTF-8 e Latin-1.
 
Linhas com `REEMBOLSO` no histórico geram `possuiEncargos = false`.
 
#### Endpoints
 
| Método | URL | Descrição |
|---|---|---|
| GET | `faturas-list` | Lista faturas com encargos calculados |
| GET | `faturas-list/{id}` | Fatura por ID |
| GET | `faturas-agrupadas` | Faturas agrupadas por cliente |
| POST | `faturas` | Nova fatura |
| POST | `faturas-import` | Importação em lote via CSV |
| PUT | `faturas/{id}` | Atualiza fatura |
| DELETE | `faturas/{id}` | Remove fatura |
 
### 7.3 Cobranças
 
#### Enumerações
 
```
canais: WHATSAPP | EMAIL | CHAT | LIGACAO | AUTOMACAO
acoes:  LEMBRETE | NOTIFICACAO | NEGOCIACAO
status: PENDENTE | FINALIZADO | FALHA
```
 
#### Fluxo de criação de cobrança
 
```
1. Frontend seleciona cliente e clica em "Cobrar"
2. GET cobrancas-view/{codCliente}
   ├── Busca faturas elegíveis (dentro do intervalo de alguma régua)
   ├── Identifica régua principal (mais severa)
   └── Retorna CobrancaViewDTO com dados para exibição
3. Usuário escolhe canal, ação e status
4. POST cobrancas-sendCharge → envia mensagem
5. POST cobrancas → persiste o registro
```
 
#### Endpoints
 
| Método | URL | Descrição |
|---|---|---|
| GET | `cobrancas-list` | Lista cobranças pendentes (agrupadas por documento) |
| GET | `cobrancas-list/{documento}` | Histórico de cobranças de um documento |
| GET | `cobrancas-view/{codCliente}` | Visualização de cobrança (faturas + régua) |
| POST | `cobrancas` | Registra cobrança |
| POST | `cobrancas-sendCharge` | Envia cobrança (WhatsApp ou Email) |
 
### 7.4 Régua de Cobrança
 
A régua define fases com intervalos de dias de atraso e mensagens padrão.
 
#### Enumerações
 
```
faseRegua: PREVENTIVA | LEVE | MEDIA | ALTA | CRITICA
```
 
#### Lógica de fases
 
| Fase | Intervalo típico | Características |
|---|---|---|
| PREVENTIVA | atrasoDe < 0 até atrasoAte ≤ 0 | Antes do vencimento; não permite bloqueio |
| LEVE | 1–15 dias | Notificação amigável |
| MEDIA | 16–60 dias | Cobrança formal |
| ALTA | 61–180 dias | Permite bloqueio |
| CRITICA | > 180 dias | Intervenção manual necessária |
 
#### Validação de sobreposição
 
```javascript
validateDuplicate(inicio, fim, ignoreId) {
  // Detecta conflito de intervalos: atraso_de <= fim && atraso_ate >= inicio
  return this.db.select().some(row =>
    row.atraso_de <= fim && row.atraso_ate >= inicio &&
    String(row.id) !== String(ignoreId)
  );
}
```
 
### 7.5 Encargos
 
Define as taxas de multa e juros aplicadas sobre faturas vencidas.
 
#### Matriz de configuração válida
 
| tipoCobranca | aplicacao | recorrencia |
|---|---|---|
| JUROS | ATRASO | DIARIA |
| JUROS | PARCELAMENTO | MENSAL |
| MULTA | ATRASO | UNICA |
 
Qualquer outra combinação é rejeitada pela entidade `Encargo`.
 
### 7.6 Vendedores
 
CRUD simples sem regras de negócio complexas. Vendedores são associados a clientes e usados para segmentação no dashboard.
 
### 7.7 Dashboard
 
O dashboard agrega dados de múltiplas fontes para oferecer visão gerencial:
 
#### KPIs calculados
 
| KPI | Fonte | Cálculo |
|---|---|---|
| Total em Aberto | Faturas | Soma de `vlrLiquido` |
| Títulos Atrasados | Faturas | Count com `diasAtraso > 0` |
| Média de Atraso | Faturas | Média de `diasAtraso` dos atrasados |
| Clientes Ativos | Clientes | Count com `status = ATIVO` |
| Taxa de Sucesso | Cobranças | `cobFinalizadas / totalCobrancas * 100` |
 
#### Aging de carteira
 
Segmenta faturas em faixas de atraso: 1–15, 16–30, 31–60, 61–90, 91–180, 181–365, >365 dias.
 
---
 
## 8. Frontend
 
### 8.1 Estrutura React sem Build
 
Todos os componentes são definidos em arquivos `.html` incluídos via template do Apps Script:
 
```html
<!-- index.html -->
<?!= include("frontend/componentes/Table"); ?>
<?!= include("frontend/views/Clientes"); ?>
<?!= include("frontend/src/hooks/Clientes"); ?>
```
 
Os componentes são declarados como `const Clientes = () => { ... }` em blocos `<script type="text/babel">` e ficam disponíveis globalmente. O Babel os transpila em runtime.
 
### 8.2 Comunicação com Backend
 
**`frontend/src/service/api.html`** — o wrapper `googleFetch()`:
 
```javascript
function googleFetch() {
  const api = (payload) => new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(res => {
        if (res?.success === false) reject(new Error(res.message))
        else resolve(res)
      })
      .withFailureHandler(err => reject(err))
      .fetchApp(payload)
  })
 
  return {
    get:    (endpoint, filters) => api({ method:'GET',    url: filters ? `${endpoint}?${filters}` : endpoint }),
    post:   (url, body)         => api({ method:'POST',   url, body }),
    put:    (url, body)         => api({ method:'PUT',    url, body }),
    delete: (url)               => api({ method:'DELETE', url }),
  }
}
```
 
### 8.3 Gerenciamento de Estado
 
React Query gerencia o cache, loading states e invalidação de queries:
 
```javascript
// Query com cache de 5 minutos
function useClientesList(filters) {
  return useQuery({
    queryKey: ['clientes-list', filters],
    queryFn:  () => googleFetch().get('clientes', filters),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
 
// Mutation com invalidação automática
function useSaveCliente(onClose) {
  return useMutation({
    mutationFn: (body) => body.id
      ? googleFetch().put(`clientes/${body.id}`, body)
      : googleFetch().post('clientes', body),
    onSuccess: async () => {
      await window.queryClient.invalidateQueries({ queryKey: ['clientes-list'] });
      onClose();
    }
  })
}
```
 
### 8.4 Sistema de Filtros
 
O hook `useFiltros` gerencia estado de filtros e constrói a query string:
 
```javascript
const useFiltros = (delay = 600) => {
  const [filtros, setFiltros] = React.useState({})
 
  // Constrói: "cliente=ACME&diasAtraso>=30&diasAtraso<=90"
  const queryString = React.useMemo(() => {
    return Object.keys(debounced).map(key => {
      const { field, op, value } = debounced[key]
      const fieldName = field || key
      if (Array.isArray(value)) {
        return value.map(v => `${fieldName}${op}${v}`).join('&')
      }
      return `${fieldName}${op}${value}`
    }).join('&')
  }, [debounced])
 
  return { filtros, mergeFiltros, clearFiltros, queryString, handleChange }
}
```
 
#### Configuração de um campo de filtro (backend → frontend)
 
```javascript
// Backend (presentation)
fields: {
  status: {
    element: 'select',
    name: 'status',
    label: 'Status',
    options: [{ key: 'ATIVO', value: 'ATIVO' }],
    op: '='
  },
  diasAtrasoMin: {
    element: 'input',
    type: 'number',
    field: 'diasAtraso',   // campo real no dado
    name: 'diasAtrasoMin', // nome no formulário
    label: 'Atraso de',
    op: '>='
  }
}
 
// Frontend (BuildFilters.gs no backend)
// "diasAtraso>=" + 30 → filtra rows onde row.diasAtraso >= 30
```
 
### 8.5 Componentes
 
#### Table
 
Renderiza tabela a partir da configuração de `presentation.tableHeaders`:
 
- `col.style` → renderiza tags coloridas
- `col.icon` → renderiza ícone `circle-check-big` ou `circle-x`
- `col.date` → formata com `toLocaleDateString()`
- `actions` → renderiza botões com ícone Lucide
#### FormFiltro
 
Renderiza formulário de filtros dinamicamente a partir de `filtersLayout` e `fields`. Suporta layouts em grid com `columns`.
 
#### Select
 
Componente controlado simples com placeholder "Selecione".
 
#### Loading
 
Animação de três pontos pulsantes.
 
---
 
## 9. Envio de Cobranças
 
### 9.1 Por WhatsApp
 
```javascript
_whatsAppBuilder(data) {
  const mensagem = [
    `Prezado(a) *${cliente}*,`,
    mensagemLimpa,                 // mensagem da régua sem HTML
    `*Detalhes:*`,
    linhasFaturas,                 // cada fatura em uma linha
    `administrativo@multbovinos.com.br`
  ].join('\n')
 
  const telefoneLimpo = String(telefone).replace(/\D/g, '')
  const link = `https://web.whatsapp.com/send?phone=${telefoneLimpo}&text=${encodeURIComponent(mensagem)}`
 
  return { to: telefoneLimpo, message: mensagem, link }
}
```
 
O frontend recebe o `link` e abre em nova aba com `window.open(link, '_blank')`.
 
### 9.2 Por Email
 
```javascript
_emailBuilder(data) {
  // Monta HTML completo com tabela de faturas
  // Assunto = título da régua
  // CC automático para administrativo@multbovinos.com.br
  return { to: email, subject: reguaPrincipal.titulo, html: corpoEmail }
}
 
// GmailGateWay.send()
GmailApp.sendEmail(emailPayload.to, emailPayload.subject, "", {
  htmlBody: emailPayload.html,
  name: 'MultSoft Desenvolvimento de Sistemas',
  cc: 'administrativo@multbovinos.com.br'
})
```
 
Verifica cota diária antes do envio:
```javascript
if (MailApp.getRemainingDailyQuota() <= 10) {
  throw new Error('Limite de envios diários próximo do limite permitido')
}
```
 
### 9.3 Envio em Massa (BulkEmail)
 
`BulkEmailUseCase` executa o pipeline completo de envio automático:
 
```
execute():
  Etapa 1: _step1_filterEligibleFaturas()
    ├── Carrega réguas das fases: PREVENTIVA, LEVE, MEDIA
    ├── Filtra faturas dentro dos intervalos das réguas
    └── Filtra clientes com permiteNotificacao=true e email preenchido
 
  Etapa 2: _step2_groupByClient()
    ├── Associa régua principal (mais severa) a cada cliente
    └── Calcula encargos por fatura
 
  Etapa 3: _step3_buildQueue()
    └── Monta BulkEmailQueueItemDTO para cada cliente elegível
 
  Etapa 4: _step4_sendQueue()
    ├── Divide em lotes de 10 (configúrável)
    ├── Envia cada lote
    └── Aguarda 2000ms entre lotes (evita rate-limit)
 
  Etapa 5: _step5_persistCobrancas()
    ├── Cria registro Cobranca para cada fatura de cada cliente
    ├── Status: FINALIZADO (sucesso) ou FALHA (erro)
    └── Insert em lote único no Sheets
 
  Retorna: { sent, failed, skipped, saved, results[] }
```
 
#### Funções de disparo manual
 
```javascript
runBulkEmail()       // configuração de produção (batchSize=10, delay=2000ms)
runBulkEmail_TEST()  // teste (batchSize=2, delay=500ms, status=PENDENTE)
```
 
---
 
## 10. Migrations e Setup Inicial
 
### Passo a passo para novo ambiente
 
1. Abrir o projeto no editor do Google Apps Script
2. Configurar a variável de ambiente:
   ```
   Propriedades do script → Adicionar: ENV = PROD (ou DEV)
   ```
3. Configurar o ID da planilha em `SQSheets.getSpreadsheet()`:
   ```javascript
   const PROD_ID = 'SEU_SPREADSHEET_ID_AQUI'
   ```
4. Executar `runMigrations()` no editor
5. Publicar como Web App: **Executar como** usuário que acessa, **Quem tem acesso** = você mesmo
6. Copiar a URL da Web App para uso
---
 
## 11. Referência da API Interna
 
### Formato de requisição
 
```javascript
fetchApp({
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: 'dominio[-sufixo][/id][?queryString]',
  body: { /* dados para POST/PUT */ }
})
```
 
### Formato de resposta
 
```javascript
// Sucesso
{ success: true, response: { data, presentation?, totais? } }
 
// Erro
{ success: false, message: 'Descrição do erro' }
```
 
### Tabela completa de rotas
 
| Método | URL | Controller | Ação |
|---|---|---|---|
| GET | `clientes` | ClienteController | getAll |
| GET | `clientes/{id}` | ClienteController | getById |
| POST | `clientes` | ClienteController | create |
| PUT | `clientes/{id}` | ClienteController | update |
| GET | `vendedores` | VendedorController | getAll |
| GET | `vendedores/{id}` | VendedorController | getById |
| POST | `vendedores` | VendedorController | create |
| PUT | `vendedores/{id}` | VendedorController | update |
| DELETE | `vendedores/{id}` | VendedorController | delete |
| GET | `faturas-list` | FaturasController | getInvoice |
| GET | `faturas-list/{id}` | FaturasController | getById |
| GET | `faturas-agrupadas` | FaturasController | getGrouped |
| POST | `faturas` | FaturasController | postInvoice |
| POST | `faturas-import` | FaturasController | importInvoice |
| PUT | `faturas/{id}` | FaturasController | putInvoice |
| DELETE | `faturas/{id}` | FaturasController | deleteInvoice |
| GET | `cobrancas-list` | CobrancasController | getAll |
| GET | `cobrancas-list/{doc}` | CobrancasController | getById (histórico) |
| GET | `cobrancas-view/{cod}` | CobrancasController | getView |
| POST | `cobrancas` | CobrancasController | create |
| POST | `cobrancas-sendCharge` | CobrancasController | sendCharge |
| GET | `reguas` | ReguaController | getAll |
| GET | `reguas/{id}` | ReguaController | getById |
| POST | `reguas` | ReguaController | create |
| PUT | `reguas/{id}` | ReguaController | update |
| DELETE | `reguas/{id}` | ReguaController | delete |
| GET | `encargos` | EncargosController | getAll |
| POST | `encargos` | EncargosController | create |
| PUT | `encargos/{id}` | EncargosController | update |
| DELETE | `encargos/{id}` | EncargosController | delete |
| GET | `dashboard` | DashboardController | get |
 
---
 
## 12. Padrões e Convenções
 
### Nomenclatura
 
| Contexto | Convenção | Exemplo |
|---|---|---|
| Colunas no Sheets | snake_case | `criado_em`, `id_vendedor` |
| Propriedades no domínio | camelCase | `criadoEm`, `idVendedor` |
| Nomes de classes | PascalCase | `ClienteService`, `SheetsClienteRepository` |
| Funções de apresentação | camelCase | `clientesPresentation()` |
| IDs de registros | UUID v4 | `Utilities.getUuid()` |
 
### Padrão de entidade
 
```javascript
class MinhaEntidade {
  constructor(props) { /* valida e atribui */ }
  static criar(props) { return new MinhaEntidade(props) }
  upDates(props) { return new MinhaEntidade({ ...atual, ...props }) }
  get id() { return this._id }
  set id(value) { this._id = value }
}
```
 
### Padrão de repositório
 
```javascript
class SheetsXRepository extends XRepository {
  constructor() { this.db = new SQSheets({ tableName: 'bdX', idField: 'id' }) }
  _toEntity(row) { return X.criar({ id: row.id, ... }) }
  _toPersistence(entity) { return { id: entity.id, ... } }
}
```
 
### Padrão de hook React Query
 
```javascript
function useXList(filters) {
  return useQuery({
    queryKey: ['x-list', filters],
    queryFn:  () => googleFetch().get('x', filters),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
```
 
### Tratamento de erros
 
- Todas as exceções do backend são capturadas por `segura()` e retornadas como `{ success: false, message }`
- O frontend converte `success: false` em `Promise.reject`
- React Query captura e exibe via `showToast`
- Nunca expor stack traces ao frontend em produção
---
 
## 13. Glossário
 
| Termo | Definição |
|---|---|
| **Régua de Cobrança** | Conjunto de regras que define ações por fase/intervalo de atraso |
| **Encargo** | Taxa de juros ou multa configurável aplicada sobre faturas vencidas |
| **Fatura** | Título financeiro em aberto (documento/NF) |
| **Cobrança** | Registro de um contato de cobrança realizado com um cliente |
| **Aging** | Segmentação da carteira de faturas por faixa de dias de atraso |
| **Bootstrap Index** | Índice em memória criado no início de cada request para lookups rápidos |
| **SQSheets** | ORM interno para Google Sheets — abstrai leitura, escrita e cache |
| **Presentation** | Objeto retornado pelo backend com configuração de tabelas e filtros para o frontend |
| **SendCharge** | Caso de uso de envio de mensagem de cobrança (WhatsApp ou Email) |
| **BulkEmail** | Envio em massa automático para todos os clientes elegíveis |
| **BootstrapIndex** | Cache em memória de dados auxiliares (clientes, réguas, encargos) por request |
| **GAS** | Google Apps Script |
