/* Dados mock para testes */
const PER_PAGE = 10;

const ESTADOS = ['SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'ES', 'MT', 'MS', 'PA', 'RN', 'PB', 'AL', 'SE', 'RO', 'RR', 'AM', 'AP', 'MA', 'PI', 'TO'];
const CIDADES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Florianópolis', 'Salvador', 'Recife', 'Fortaleza', 'Goiânia', 'Brasília', 'Vitória', 'Cuiabá', 'Campo Grande', 'Belém', 'Natal', 'João Pessoa', 'Maceió', 'Aracaju', 'Porto Velho', 'Boa Vista', 'Manaus', 'Macapá', 'São Luís', 'Teresina', 'Palmas'];

// Todos os 27 estados do BR e capitais (ordem: UF, capital)
const ESTADOS_BR = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
const CAPITAIS_BR = ['Rio Branco', 'Maceió', 'Macapá', 'Manaus', 'Salvador', 'Fortaleza', 'Brasília', 'Vitória', 'Goiânia', 'São Luís', 'Cuiabá', 'Campo Grande', 'Belo Horizonte', 'Belém', 'João Pessoa', 'Curitiba', 'Recife', 'Teresina', 'Rio de Janeiro', 'Natal', 'Porto Alegre', 'Porto Velho', 'Boa Vista', 'Florianópolis', 'São Paulo', 'Aracaju', 'Palmas'];

function gerarClientes(quantidade = 15) {
    const lista = [];
    const nomes = ['Empresa Alpha SA', 'Comércio Beta Ltda', 'Indústria Sigma SA', 'Serviços Delta Ltda', 'Tech Omega SA', 'Global Prime Ltda', 'Nacional Nova SA', 'Regional Total Ltda', 'Grupo Max SA', 'Associados Plus Ltda', 'Cliente Top SA', 'Parceiro Super Ltda', 'Holdings Mega SA', 'Consultoria Ultra Ltda', 'Solutions Pro SA'];
    const emails = ['contato@alpha.com.br', 'vendas@beta.com.br', 'comercial@sigma.com.br', 'atendimento@delta.com.br', 'suporte@omega.com.br', 'info@prime.com.br', 'contato@nova.com.br', 'sac@total.com.br', 'contato@max.com.br', 'comercial@plus.com.br', 'vendas@top.com.br', 'contato@super.com.br', 'info@mega.com.br', 'atendimento@ultra.com.br', 'contato@pro.com.br'];
    const telefones = ['(11) 98765-4321', '(21) 97654-3210', '(31) 96543-2109', '(41) 95432-1098', '(51) 94321-0987', '(48) 93210-9876', '(71) 92109-8765', '(81) 91098-7654', '(85) 90987-6543', '(62) 99876-5432', '(61) 98765-4322', '(27) 97654-3211', '(65) 96543-2110', '(67) 95432-1099', '(91) 94321-0988'];
    const cpfsCnpjs = ['12.345.678/0001-90', '23.456.789/0001-01', '34.567.890/0001-12', '45.678.901/0001-23', '56.789.012/0001-34', '67.890.123/0001-45', '78.901.234/0001-56', '89.012.345/0001-67', '90.123.456/0001-78', '01.234.567/0001-89', '11.222.333/0001-44', '22.333.444/0001-55', '33.444.555/0001-66', '44.555.666/0001-77', '55.666.777/0001-88'];
    const enderecos = ['Rua das Flores, 123', 'Av. Paulista, 1500', 'Rua Augusta, 850', 'Av. Ipiranga, 2000', 'Rua Oscar Freire, 300', 'Av. Brigadeiro Faria Lima, 1200', 'Rua Haddock Lobo, 450', 'Av. Rebouças, 3000', 'Rua da Consolação, 1800', 'Av. São João, 900', 'Rua Vergueiro, 2500', 'Av. Tiradentes, 600', 'Rua do Comércio, 750', 'Av. Industrial, 1100', 'Rua Central, 200'];
    const bairros = ['Centro', 'Jardins', 'Vila Mariana', 'Pinheiros', 'Moema', 'Itaim Bibi', 'Higienópolis', 'Perdizes', 'Consolação', 'República', 'Ipiranga', 'Bom Retiro', 'Brás', 'Mooca', 'Tatuapé'];
    const ceps = ['01310-100', '01311-200', '01312-300', '01313-400', '01314-500', '01315-600', '01316-700', '01317-800', '01318-900', '01319-000', '01320-100', '01321-200', '01322-300', '01323-400', '01324-500'];
    
    for (let i = 1; i <= 15; i++) {
        lista.push({
            id: i,
            nome: nomes[i - 1],
            email: emails[i - 1],
            telefone: telefones[i - 1],
            cpfCnpj: cpfsCnpjs[i - 1],
            endereco: enderecos[i - 1],
            bairro: bairros[i - 1],
            cidade: CAPITAIS_BR[i % CAPITAIS_BR.length],
            estado: ESTADOS_BR[i % ESTADOS_BR.length],
            cep: ceps[i - 1],
            observacoes: i % 3 === 0 ? 'Cliente prioritário com atendimento especial' : ''
        });
    }
    return lista;
}

function gerarHospitais(quantidade = 27) {
    const lista = [];
    const nomesBase = ['Santa Casa de', 'Hospital Regional de', 'Hospital Geral de', 'Hospital Municipal de', 'Hospital de Clínicas de', 'Hospital Universitário de'];
    const tipos = ['Público', 'Privado', 'Filantrópico', 'Universitário'];
    const bairros = ['Centro', 'Zona Sul', 'Zona Norte', 'Jardins', 'Vila Nova', 'Boa Vista'];
    const especialidades = ['Ortopedia, Traumatologia', 'Neurologia, Cardiologia', 'UTI, Emergência', 'Pediatria, Maternidade', 'Clínica Geral', 'Oncologia, Hematologia'];
    const responsaveis = ['Dr. Carlos Silva', 'Dra. Maria Santos', 'Dr. José Oliveira', 'Dra. Ana Costa', 'Dr. Pedro Lima', 'Dra. Julia Souza'];
    
    for (let i = 0; i < ESTADOS_BR.length; i++) {
        const uf = ESTADOS_BR[i];
        const capital = CAPITAIS_BR[i];
        const ddd = ['68', '82', '96', '92', '71', '85', '61', '27', '62', '98', '65', '67', '31', '91', '83', '41', '81', '86', '21', '84', '51', '69', '95', '48', '11', '79', '63'][i];
        lista.push({
            id: i + 1,
            nome: nomesBase[i % nomesBase.length] + ' ' + capital,
            tipo: tipos[i % tipos.length],
            cnpj: String(10 + (i % 90)).padStart(2, '0') + '.' + String(100 + (i * 33) % 900).padStart(3, '0') + '.' + String(400 + (i * 17) % 600).padStart(3, '0') + '/0001-' + String(10 + (i % 90)).padStart(2, '0'),
            cnes: String(1000000 + i * 12345).substring(0, 7),
            telefone: '(' + ddd + ') 3' + String(1000 + (i + 1)).padStart(4, '0') + '-' + String(1000 + (i + 1)).padStart(4, '0'),
            telefone2: '(' + ddd + ') 3' + String(2000 + (i + 1)).padStart(4, '0') + '-' + String(2000 + (i + 1)).padStart(4, '0'),
            email: 'contato@hospital' + (i + 1) + '.com.br',
            site: 'https://www.hospital' + capital.toLowerCase().replace(/\s+/g, '') + '.com.br',
            endereco: 'Av. Principal',
            numero: String(100 + (i + 1) * 50),
            bairro: bairros[i % bairros.length],
            cep: String(10000 + i * 1000).padStart(5, '0') + '-' + String(100 + i * 10).padStart(3, '0'),
            cidade: capital,
            estado: uf,
            responsavel: responsaveis[i % responsaveis.length],
            crm: 'CRM/' + uf + ' ' + String(10000 + i * 1234).padStart(5, '0'),
            especialidades: especialidades[i % especialidades.length],
            observacoes: i % 5 === 0 ? 'Hospital referência em atendimento de emergência na região.' : ''
        });
    }
    return lista;
}

function gerarSeguradoras(quantidade = 45) {
    const lista = [];
    const nomes = ['Sul América', 'Porto Seguro', 'Bradesco Seguros', 'Itaú Seguros', 'Liberty Seguros', 'Zurich', 'Allianz', 'Tokio Marine', 'HDI Seguros', 'Mapfre', 'Azul Seguros', 'Sompo', 'Chubb', 'AXA', 'Generali'];
    const bairros = ['Centro', 'Jardins', 'Vila Olímpia', 'Itaim Bibi', 'Pinheiros', 'Moema', 'Brooklin', 'Consolação', 'Bela Vista', 'República'];
    const contatos = ['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Lima', 'Julia Souza', 'Lucas Pereira', 'Fernanda Alves', 'Rafael Gomes', 'Camila Ferreira'];
    
    for (let i = 1; i <= quantidade; i++) {
        const cidade = CIDADES[i % CIDADES.length];
        const estado = ESTADOS[i % ESTADOS.length];
        const nomeBase = (i <= 15 ? nomes[i - 1] : 'Seguradora ' + i);
        const nomeSemEspacos = nomeBase.toLowerCase().replace(/\s+/g, '').replace(/[áàãâ]/g, 'a').replace(/[éèê]/g, 'e').replace(/[íìî]/g, 'i').replace(/[óòõô]/g, 'o').replace(/[úùû]/g, 'u');
        
        lista.push({
            id: i,
            nome: nomeBase,
            cnpj: String(10 + (i % 90)).padStart(2, '0') + '.' + String(100 + (i % 900)).padStart(3, '0') + '.' + String(400 + (i % 600)).padStart(3, '0') + '/0001-' + String(10 + (i % 90)).padStart(2, '0'),
            codigoSusep: String(10000 + i * 111).padStart(5, '0'),
            telefone: '(11) 4000-' + (1000 + i),
            telefoneSinistro: '0800 ' + String(700 + i).padStart(3, '0') + ' ' + String(1000 + i * 11).padStart(4, '0'),
            email: 'contato@' + nomeSemEspacos + '.com.br',
            site: 'https://www.' + nomeSemEspacos + '.com.br',
            contatoNome: contatos[i % contatos.length],
            contatoTelefone: '(11) 9' + String(8000 + i * 11).padStart(4, '0') + '-' + String(1000 + i * 7).padStart(4, '0'),
            contatoEmail: contatos[i % contatos.length].toLowerCase().replace(/\s+/g, '.') + '@' + nomeSemEspacos + '.com.br',
            endereco: 'Av. Paulista',
            numero: String(1000 + i * 100),
            bairro: bairros[i % bairros.length],
            cep: '01310-' + String(100 + i).padStart(3, '0'),
            cidade: cidade,
            estado: estado,
            observacoes: i % 7 === 0 ? 'Parceiro prioritário com condições especiais de atendimento.' : ''
        });
    }
    return lista;
}

function gerarUsuarios(quantidade = 5) {
    const lista = [];
    const nomes = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo'];
    const perfis = ['Administrador', 'Usuário', 'Operador', 'Visualizador', 'Usuário'];
    for (let i = 1; i <= quantidade; i++) {
        lista.push({
            id: i,
            nome: nomes[i - 1] + ' ' + ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima'][i - 1],
            email: 'usuario' + i + '@sistema.com.br',
            login: 'user' + i,
            perfil: perfis[i - 1],
            status: i === 4 ? 'Inativo' : 'Ativo'
        });
    }
    return lista;
}

function gerarProcessos(quantidade = 40, clientes) {
    const lista = [];
    const tipos = ['Previdenciário', 'Trabalhista', 'Seguro de vida', 'Acidente', 'Danos corporais'];
    const status = ['Em análise', 'Em andamento', 'Aguardando audiência', 'Aguardando decisão', 'Concluído', 'Arquivado'];
    const advogados = ['Dr. João Silva', 'Dra. Maria Santos', 'Dr. Carlos Lima', 'Dra. Ana Costa', 'Dr. Pedro Oliveira'];
    const nomesClientes = ['Empresa Alpha', 'Comércio Beta', 'Indústria Sigma', 'Tech Delta', 'Grupo Omega', 'Cliente Prime', 'Parceiro Nova', 'Holdings Total', 'Consultoria Max', 'Solutions Plus'];
    for (let i = 1; i <= quantidade; i++) {
        const cliente = clientes && clientes.length ? clientes[i % clientes.length] : null;
        const ano = 2023 + (i % 3);
        const dataAbertura = ano + '-' + String((i % 12) + 1).padStart(2, '0') + '-' + String((i % 28) + 1).padStart(2, '0');
        lista.push({
            id: i,
            numero: String(1000 + i).padStart(7, '0') + '-' + String(50 + (i % 20)).padStart(2, '0') + '.' + ano + '.8.26.0100',
            tipo: tipos[i % tipos.length],
            clienteId: cliente ? cliente.id : ((i % 10) + 1),
            clienteNome: cliente ? cliente.nome : nomesClientes[i % nomesClientes.length] + ' ' + i,
            cpf: String(100 + i) + '.' + String(200 + i) + '.' + String(300 + i) + '-00',
            dataAbertura: dataAbertura,
            status: status[i % status.length],
            valorCausa: 5000 + i * 1500,
            advogado: advogados[i % advogados.length]
        });
    }
    return lista;
}

function gerarPagamentos(processos, clientes) {
    const lista = [];
    const situacoes = ['Pendente', 'Pago', 'Atrasado'];
    let id = 1;
    const procs = processos && processos.length ? processos : [];
    const clis = clientes && clientes.length ? clientes : [];
    
    // Obter ano e mês atual
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;

    // Função para calcular data de vencimento (último dia útil do mês)
    function calcularDataVencimento(ano, mes) {
        // Vencimento no dia 28 do mês
        return ano + '-' + String(mes).padStart(2, '0') + '-28';
    }

    // Pagamentos do ano atual (até o mês atual)
    for (let mes = 1; mes <= mesAtual; mes++) {
        const proc = procs[(mes - 1) % procs.length];
        const cliente = proc ? clis.find(c => c.id == proc.clienteId) || clis[(mes - 1) % clis.length] : clis[(mes - 1) % clis.length];
        lista.push({
            id: id++,
            processoId: proc ? proc.id : 1,
            processoNumero: proc ? proc.numero : '0001001-00.' + anoAtual + '.8.26.0100',
            clienteId: cliente ? cliente.id : (proc ? proc.clienteId : 1),
            clienteNome: cliente ? cliente.nome : (proc ? proc.clienteNome : 'Cliente 1'),
            competencia: anoAtual + '-' + String(mes).padStart(2, '0'),
            valor: 800 + mes * 80,
            situacao: mes < mesAtual ? 'Pago' : 'Pendente',
            dataVencimento: calcularDataVencimento(anoAtual, mes)
        });
    }

    // Pagamentos de 2025 (ano completo)
    for (let mes = 1; mes <= 12; mes++) {
        const proc = procs[(mes - 1) % procs.length];
        const cliente = proc ? clis.find(c => c.id == proc.clienteId) || clis[(mes - 1) % clis.length] : clis[(mes - 1) % clis.length];
        lista.push({
            id: id++,
            processoId: proc ? proc.id : 1,
            processoNumero: proc ? proc.numero : '0001001-00.2025.8.26.0100',
            clienteId: cliente ? cliente.id : (proc ? proc.clienteId : 1),
            clienteNome: cliente ? cliente.nome : (proc ? proc.clienteNome : 'Cliente 1'),
            competencia: '2025-' + String(mes).padStart(2, '0'),
            valor: 800 + mes * 80,
            situacao: 'Pago',
            dataVencimento: calcularDataVencimento(2025, mes)
        });
    }

    // Pagamentos de 2024 (para ter histórico)
    for (let mes = 1; mes <= 12; mes++) {
        const proc = procs[(mes + 11) % procs.length];
        const cliente = proc ? clis.find(c => c.id == proc.clienteId) || clis[(mes - 1) % clis.length] : clis[(mes - 1) % clis.length];
        lista.push({
            id: id++,
            processoId: proc ? proc.id : (mes % 40) + 1,
            processoNumero: proc ? proc.numero : '000' + (1000 + mes) + '-00.2024.8.26.0100',
            clienteId: cliente ? cliente.id : (proc ? proc.clienteId : (mes % 15) + 1),
            clienteNome: cliente ? cliente.nome : (proc ? proc.clienteNome : 'Cliente ' + mes),
            competencia: '2024-' + String(mes).padStart(2, '0'),
            valor: 800 + mes * 50,
            situacao: 'Pago',
            dataVencimento: calcularDataVencimento(2024, mes)
        });
    }

    return lista;
}

function gerarPrescricoes(quantidade = 35, processos, clientes) {
    const lista = [];
    const hoje = new Date();
    const statusOptions = ['Ativa', 'Ativa', 'Ativa', 'Prescrita', 'Suspensa'];
    for (let i = 1; i <= quantidade; i++) {
        const diasOffset = (i - 15) * 12;
        const d = new Date(hoje);
        d.setDate(d.getDate() + diasOffset);
        const dataLimite = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const proc = processos && processos.length && processos[i % processos.length];
        const cliente = clientes && clientes.length && clientes[i % clientes.length];
        
        // Determina status baseado na data
        let status = statusOptions[i % statusOptions.length];
        if (d < hoje) {
            status = 'Prescrita';
        }
        
        lista.push({
            id: i,
            processoId: proc ? proc.id : (i % 35) + 1,
            processoNumero: proc ? proc.numero : '000' + (1000 + i) + '-00.2024.8.26.0100',
            clienteId: cliente ? cliente.id : (i % 35) + 1,
            clienteNome: cliente ? cliente.nome : 'Cliente ' + i,
            descricao: i % 3 === 0 ? 'Prescrição para ajuizamento' : '',
            dataLimite: dataLimite,
            status: status
        });
    }
    return lista;
}

function gerarAcidentes(quantidade = 35) {
    const lista = [];
    const tipos = ['Colisão frontal', 'Colisão traseira', 'Colisão lateral', 'Atropelamento', 'Capotamento', 'Saída de pista', 'Choque com objeto fixo'];
    const status = ['Registrado', 'Em andamento', 'Concluído'];
    const ano = new Date().getFullYear();
    for (let i = 1; i <= quantidade; i++) {
        const mes = (i % 12) + 1;
        const dia = (i % 28) + 1;
        lista.push({
            id: i,
            protocolo: 'AC' + ano + String(i).padStart(6, '0'),
            data: ano + '-' + String(mes).padStart(2, '0') + '-' + String(dia).padStart(2, '0'),
            hora: String(6 + (i % 12)).padStart(2, '0') + ':' + (i % 2 === 0 ? '30' : '00'),
            tipo: tipos[i % tipos.length],
            endereco: 'Rodovia BR-' + (100 + (i % 400)) + ', km ' + (i * 2),
            cidade: CIDADES[i % CIDADES.length],
            estado: ESTADOS[i % ESTADOS.length],
            descricao: 'Acidente registrado.',
            condicoes: i % 3 === 0 ? 'Chuva' : 'Tempo bom',
            envolvidos: [{ nome: 'Envolvido ' + i, tipo: 'Condutor', veiculo: 'ABC-' + (1000 + i) }],
            policiaAcionada: i % 2 === 0,
            numeroBO: i % 2 === 0 ? '2025/' + (100000 + i) : '',
            samuAcionado: i % 5 === 0,
            hospitalizacao: i % 6 === 0,
            hospital: i % 6 === 0 ? '1' : '',
            vitimas: i % 10 === 0 ? 1 : 0,
            gravidade: i % 10 === 0 ? 'Leve' : 'Sem vítimas',
            observacoes: '',
            status: status[i % status.length],
            dataRegistro: new Date().toISOString()
        });
    }
    return lista;
}

function buildPaginationHTML(total, currentPage, onPageChangeFuncName) {
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const start = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
    const end = Math.min(currentPage * PER_PAGE, total);
    let html = '<div class="pagination-wrap"><span class="pagination-info">Mostrando ' + (total === 0 ? '0' : start + '-' + end) + ' de ' + total + '</span><div class="pagination">';
    html += '<button type="button" ' + (currentPage <= 1 ? 'disabled' : '') + ' onclick="' + onPageChangeFuncName + '(' + (currentPage - 1) + ')">Anterior</button>';
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2))
            html += '<button type="button" class="' + (p === currentPage ? 'active' : '') + '" onclick="' + onPageChangeFuncName + '(' + p + ')">' + p + '</button>';
        else if (p === currentPage - 3 || p === currentPage + 3)
            html += '<span style="padding:0 4px">…</span>';
    }
    html += '<button type="button" ' + (currentPage >= totalPages ? 'disabled' : '') + ' onclick="' + onPageChangeFuncName + '(' + (currentPage + 1) + ')">Próxima</button></div></div>';
    return html;
}

// ==========================================
// SISTEMA DE DADOS CENTRALIZADOS
// Garante que todas as páginas usem os mesmos dados
// ==========================================

const MOCK_VERSION = '1.0.5'; // Incrementar para forçar regeneração dos dados

function initMockData() {
    // Verifica se precisa regenerar os dados
    const storedVersion = localStorage.getItem('mockDataVersion');
    if (storedVersion !== MOCK_VERSION) {
        // Limpa dados antigos e regenera
        localStorage.removeItem('clientes');
        localStorage.removeItem('hospitais');
        localStorage.removeItem('seguradoras');
        localStorage.removeItem('usuarios');
        localStorage.removeItem('processos');
        localStorage.removeItem('pagamentos');
        localStorage.removeItem('prescricoes');
        localStorage.removeItem('acidentes');
        localStorage.setItem('mockDataVersion', MOCK_VERSION);
    }
}

function getClientes() {
    initMockData();
    let data = localStorage.getItem('clientes');
    if (!data) {
        const generated = gerarClientes();
        localStorage.setItem('clientes', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getHospitais() {
    initMockData();
    let data = localStorage.getItem('hospitais');
    if (!data) {
        const generated = gerarHospitais();
        localStorage.setItem('hospitais', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getSeguradoras() {
    initMockData();
    let data = localStorage.getItem('seguradoras');
    if (!data) {
        const generated = gerarSeguradoras();
        localStorage.setItem('seguradoras', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getUsuarios() {
    initMockData();
    let data = localStorage.getItem('usuarios');
    if (!data) {
        const generated = gerarUsuarios();
        localStorage.setItem('usuarios', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getProcessos() {
    initMockData();
    let data = localStorage.getItem('processos');
    if (!data) {
        const clientes = getClientes();
        const generated = gerarProcessos(18, clientes);
        localStorage.setItem('processos', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getPagamentos() {
    initMockData();
    let data = localStorage.getItem('pagamentos');
    if (!data) {
        const clientes = getClientes();
        const processos = getProcessos();
        const generated = gerarPagamentos(processos, clientes);
        localStorage.setItem('pagamentos', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getPrescricoes() {
    initMockData();
    let data = localStorage.getItem('prescricoes');
    if (!data) {
        const clientes = getClientes();
        const processos = getProcessos();
        const generated = gerarPrescricoes(35, processos, clientes);
        localStorage.setItem('prescricoes', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

function getAcidentes() {
    initMockData();
    let data = localStorage.getItem('acidentes');
    if (!data) {
        const generated = gerarAcidentes();
        localStorage.setItem('acidentes', JSON.stringify(generated));
        return generated;
    }
    return JSON.parse(data);
}

// Função para salvar dados (usado pelas páginas ao criar/editar)
function saveClientes(data) { localStorage.setItem('clientes', JSON.stringify(data)); }
function saveHospitais(data) { localStorage.setItem('hospitais', JSON.stringify(data)); }
function saveSeguradoras(data) { localStorage.setItem('seguradoras', JSON.stringify(data)); }
function saveUsuarios(data) { localStorage.setItem('usuarios', JSON.stringify(data)); }
function saveProcessos(data) { localStorage.setItem('processos', JSON.stringify(data)); }
function savePagamentos(data) { localStorage.setItem('pagamentos', JSON.stringify(data)); }
function savePrescricoes(data) { localStorage.setItem('prescricoes', JSON.stringify(data)); }
function saveAcidentes(data) { localStorage.setItem('acidentes', JSON.stringify(data)); }
