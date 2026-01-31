// Submenu Cadastros
function toggleSubmenu(event) {
    event.preventDefault();
    const parent = event.target.closest('.menu-item-parent');
    parent.classList.toggle('open');
}

// Menu mobile
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
sidebarOverlay.addEventListener('click', toggleMobileMenu);

document.querySelectorAll('.sidebar-nav .submenu a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

// Nome do usuário
document.getElementById('headerUserName').textContent = sessionStorage.getItem('username') || 'Usuário';

// Dados centralizados
let acidentes = getAcidentes();
const hospitais = getHospitais();
const seguradoras = getSeguradoras();
let currentPageAcidentes = 1;

function goToPageAcidentes(p) {
    const filtered = getFilteredAcidentes();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE_ACIDENTES));
    if (p < 1 || p > totalPages) return;
    currentPageAcidentes = p;
    renderAcidentes();
}

function getFilteredAcidentes() {
    const protocolo = (document.getElementById('filtroProtocolo')?.value || '').trim().toLowerCase();
    const tipo = document.getElementById('filtroTipo')?.value || '';
    const status = document.getElementById('filtroStatus')?.value || '';
    const dataInicio = document.getElementById('filtroDataInicio')?.value || '';
    const dataFim = document.getElementById('filtroDataFim')?.value || '';
    const estado = (document.getElementById('filtroEstado')?.value || '').trim().toUpperCase();
    const cidade = (document.getElementById('filtroCidade')?.value || '').trim().toLowerCase();

    return acidentes.filter(a => {
        if (protocolo && !(a.protocolo || '').toLowerCase().includes(protocolo)) return false;
        if (tipo && a.tipo !== tipo) return false;
        if (status && a.status !== status) return false;
        if (dataInicio && (a.data || '') < dataInicio) return false;
        if (dataFim && (a.data || '') > dataFim) return false;
        if (estado && !(a.estado || '').toUpperCase().includes(estado)) return false;
        if (cidade && !(a.cidade || '').toLowerCase().includes(cidade)) return false;
        return true;
    });
}

function aplicarFiltros() {
    currentPageAcidentes = 1;
    renderAcidentes();
}

function limparFiltros() {
    const ids = ['filtroProtocolo', 'filtroTipo', 'filtroStatus', 'filtroDataInicio', 'filtroDataFim', 'filtroEstado', 'filtroCidade'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    currentPageAcidentes = 1;
    renderAcidentes();
}

// Preencher selects
function preencherSelects() {
    const selectHospital = document.getElementById('acidenteHospital');
    hospitais.forEach(h => {
        const option = document.createElement('option');
        option.value = h.id;
        option.textContent = `${h.nome} - ${h.cidade}/${h.estado}`;
        selectHospital.appendChild(option);
    });

    // Seguradoras nos envolvidos
    atualizarSelectsSeguradoras();
}

function atualizarSelectsSeguradoras() {
    document.querySelectorAll('.envolvido-seguradora').forEach(select => {
        select.innerHTML = '<option value="">Nenhuma</option>';
        seguradoras.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = s.nome;
            select.appendChild(option);
        });
    });
}

// Renderizar tabela (paginação de 10 itens por página)
const PER_PAGE_ACIDENTES = 10;

function renderAcidentes() {
    const tbody = document.getElementById('acidentesTable');
    const emptyState = document.getElementById('acidentesEmpty');
    const paginationEl = document.getElementById('acidentesPagination');
    tbody.innerHTML = '';

    const filtered = getFilteredAcidentes();

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        if (paginationEl) paginationEl.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';
    const start = (currentPageAcidentes - 1) * PER_PAGE_ACIDENTES;
    const pageData = filtered.slice(start, start + PER_PAGE_ACIDENTES);
    pageData.forEach(a => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = function(e) {
            // Não abre modal se clicar nos botões de ação
            if (e.target.closest('.actions')) return;
            viewAcidente(a.id);
        };
        const statusClass = a.status === 'Concluído' ? 'success' : a.status === 'Em andamento' ? 'warning' : 'secondary';
        tr.innerHTML = `
            <td><strong>${a.protocolo}</strong></td>
            <td>${formatarData(a.data)} ${a.hora}</td>
            <td>${a.cidade}/${a.estado}</td>
            <td>${a.tipo}</td>
            <td><span class="badge badge-${statusClass}">${a.status}</span></td>
            <td>
                <div class="actions">
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); editAcidente(${a.id})">Editar</button>
                    <button class="btn btn-danger" onclick="event.stopPropagation(); deleteAcidente(${a.id})">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    if (paginationEl && typeof buildPaginationHTML === 'function') {
        paginationEl.innerHTML = buildPaginationHTML(filtered.length, currentPageAcidentes, 'goToPageAcidentes');
    } else if (paginationEl) {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE_ACIDENTES));
        const end = Math.min(currentPageAcidentes * PER_PAGE_ACIDENTES, filtered.length);
        const begin = filtered.length === 0 ? 0 : (currentPageAcidentes - 1) * PER_PAGE_ACIDENTES + 1;
        let html = '<div class="pagination-wrap"><span class="pagination-info">Mostrando ' + begin + '-' + end + ' de ' + filtered.length + '</span><div class="pagination">';
        html += '<button type="button" ' + (currentPageAcidentes <= 1 ? 'disabled' : '') + ' onclick="goToPageAcidentes(' + (currentPageAcidentes - 1) + ')">Anterior</button>';
        for (let p = 1; p <= totalPages; p++) {
            if (p === 1 || p === totalPages || (p >= currentPageAcidentes - 2 && p <= currentPageAcidentes + 2))
                html += '<button type="button" class="' + (p === currentPageAcidentes ? 'active' : '') + '" onclick="goToPageAcidentes(' + p + ')">' + p + '</button>';
            else if (p === currentPageAcidentes - 3 || p === currentPageAcidentes + 3)
                html += '<span style="padding:0 4px">…</span>';
        }
        html += '<button type="button" ' + (currentPageAcidentes >= totalPages ? 'disabled' : '') + ' onclick="goToPageAcidentes(' + (currentPageAcidentes + 1) + ')">Próxima</button></div></div>';
        paginationEl.innerHTML = html;
    }
}

function formatarData(data) {
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

// Gerar protocolo
function gerarProtocolo() {
    const ano = new Date().getFullYear();
    const numero = String(acidentes.length + 1).padStart(6, '0');
    return `AC${ano}${numero}`;
}

// Abas
let currentTab = 0;

function showTab(tabIndex) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, i) => {
        if (i === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    contents.forEach((content, i) => {
        if (i === tabIndex) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    currentTab = tabIndex;
}

// Modal
function openModalAcidente() {
    document.getElementById('modalAcidenteTitle').textContent = 'Novo Registro de Acidente';
    document.getElementById('formAcidente').reset();
    document.getElementById('acidenteId').value = '';
    showTab(0);
    resetEnvolvidos();
    preencherSelects();
    document.getElementById('modalAcidente').classList.add('active');
}

function closeModalAcidente() {
    document.getElementById('modalAcidente').classList.remove('active');
}

// Envolvidos
function resetEnvolvidos() {
    const container = document.getElementById('envolvidosContainer');
    container.innerHTML = `
        <div class="envolvido-item">
            <h5>Envolvido 1</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Nome Completo *</label>
                    <input type="text" class="envolvido-nome" required>
                </div>
                <div class="form-group">
                    <label>CPF</label>
                    <input type="text" class="envolvido-cpf" maxlength="14" placeholder="000.000.000-00">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="tel" class="envolvido-telefone" placeholder="(00) 00000-0000">
                </div>
                <div class="form-group">
                    <label>Tipo</label>
                    <select class="envolvido-tipo">
                        <option value="Condutor">Condutor</option>
                        <option value="Passageiro">Passageiro</option>
                        <option value="Pedestre">Pedestre</option>
                        <option value="Ciclista">Ciclista</option>
                        <option value="Motociclista">Motociclista</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Veículo (Placa)</label>
                <input type="text" class="envolvido-veiculo" placeholder="ABC-1234">
            </div>
            <div class="form-group">
                <label>Seguradora</label>
                <select class="envolvido-seguradora">
                    <option value="">Nenhuma</option>
                </select>
            </div>
        </div>
    `;
    atualizarSelectsSeguradoras();
}

function addEnvolvido() {
    const container = document.getElementById('envolvidosContainer');
    const count = container.children.length + 1;
    const div = document.createElement('div');
    div.className = 'envolvido-item';
    div.innerHTML = `
        <h5>Envolvido ${count} <button type="button" class="btn-remove" onclick="removeEnvolvido(this)">×</button></h5>
        <div class="form-row">
            <div class="form-group">
                <label>Nome Completo *</label>
                <input type="text" class="envolvido-nome" required>
            </div>
            <div class="form-group">
                <label>CPF</label>
                <input type="text" class="envolvido-cpf" maxlength="14" placeholder="000.000.000-00">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Telefone</label>
                <input type="tel" class="envolvido-telefone" placeholder="(00) 00000-0000">
            </div>
            <div class="form-group">
                <label>Tipo</label>
                <select class="envolvido-tipo">
                    <option value="Condutor">Condutor</option>
                    <option value="Passageiro">Passageiro</option>
                    <option value="Pedestre">Pedestre</option>
                    <option value="Ciclista">Ciclista</option>
                    <option value="Motociclista">Motociclista</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Veículo (Placa)</label>
            <input type="text" class="envolvido-veiculo" placeholder="ABC-1234">
        </div>
        <div class="form-group">
            <label>Seguradora</label>
            <select class="envolvido-seguradora">
                <option value="">Nenhuma</option>
            </select>
        </div>
    `;
    container.appendChild(div);
    atualizarSelectsSeguradoras();
}

function removeEnvolvido(btn) {
    btn.closest('.envolvido-item').remove();
    // Renumerar
    document.querySelectorAll('.envolvido-item h5').forEach((h5, i) => {
        h5.innerHTML = `Envolvido ${i + 1}${i > 0 ? ' <button type="button" class="btn-remove" onclick="removeEnvolvido(this)">×</button>' : ''}`;
    });
}

// Toggle hospital
function toggleHospital() {
    const checked = document.getElementById('acidenteHospitalizacao').checked;
    document.getElementById('hospitalGroup').style.display = checked ? 'block' : 'none';
}

// Preview de arquivos
document.getElementById('acidenteFotos')?.addEventListener('change', function(e) {
    previewFiles(e.target.files, 'fotosPreview', 'image');
});

document.getElementById('acidenteVideos')?.addEventListener('change', function(e) {
    previewFiles(e.target.files, 'videosPreview', 'video');
});

document.getElementById('acidenteDocumentos')?.addEventListener('change', function(e) {
    previewFiles(e.target.files, 'documentosPreview', 'doc');
});

function previewFiles(files, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    Array.from(files).forEach(file => {
        const div = document.createElement('div');
        div.className = 'file-preview-item';
        div.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        container.appendChild(div);
    });
}

// Salvar
function saveAcidente(e) {
    e.preventDefault();
    
    const id = document.getElementById('acidenteId').value;
    
    // Coletar envolvidos
    const envolvidos = [];
    document.querySelectorAll('.envolvido-item').forEach(item => {
        envolvidos.push({
            nome: item.querySelector('.envolvido-nome').value,
            cpf: item.querySelector('.envolvido-cpf').value,
            telefone: item.querySelector('.envolvido-telefone').value,
            tipo: item.querySelector('.envolvido-tipo').value,
            veiculo: item.querySelector('.envolvido-veiculo').value,
            seguradora: item.querySelector('.envolvido-seguradora').value
        });
    });
    
    const existing = id ? acidentes.find(x => x.id == id) : null;
    const acidente = {
        data: document.getElementById('acidenteData').value,
        hora: document.getElementById('acidenteHora').value,
        tipo: document.getElementById('acidenteTipo').value,
        endereco: document.getElementById('acidenteEndereco').value,
        cidade: document.getElementById('acidenteCidade').value,
        estado: document.getElementById('acidenteEstado').value,
        descricao: document.getElementById('acidenteDescricao').value,
        condicoes: document.getElementById('acidenteCondicoes').value,
        envolvidos: envolvidos,
        policiaAcionada: document.getElementById('acidentePoliciaAcionada').checked,
        numeroBO: document.getElementById('acidenteNumeroBO').value,
        samuAcionado: document.getElementById('acidenteSamuAcionado').checked,
        hospitalizacao: document.getElementById('acidenteHospitalizacao').checked,
        hospital: document.getElementById('acidenteHospital').value,
        vitimas: document.getElementById('acidenteVitimas').value,
        gravidade: document.getElementById('acidenteGravidade').value,
        observacoes: document.getElementById('acidenteObservacoes').value,
        status: existing ? (existing.status || 'Registrado') : 'Registrado'
    };
    
    if (id) {
        const idx = acidentes.findIndex(x => x.id == id);
        if (idx >= 0) {
            acidentes[idx] = { ...acidentes[idx], ...acidente };
        }
    } else {
        const newId = acidentes.length ? Math.max(...acidentes.map(x => x.id)) + 1 : 1;
        acidente.id = newId;
        acidente.protocolo = gerarProtocolo();
        acidente.dataRegistro = new Date().toISOString();
        acidentes.push(acidente);
    }
    
    localStorage.setItem('acidentes', JSON.stringify(acidentes));
    renderAcidentes();
    closeModalAcidente();
}

let currentViewAcidenteId = null;

function viewAcidente(id) {
    const a = acidentes.find(x => x.id === id || x.id == id);
    if (!a) return;
    currentViewAcidenteId = a.id;

    const statusClass = a.status === 'Concluído' ? 'success' : a.status === 'Em andamento' ? 'warning' : 'secondary';
    document.getElementById('viewProtocolo').textContent = a.protocolo || '—';
    document.getElementById('viewStatusBadge').textContent = a.status || '—';
    document.getElementById('viewStatusBadge').className = 'modal-view-badge badge badge-' + statusClass;

    document.getElementById('viewData').textContent = a.data ? formatarData(a.data) : '—';
    document.getElementById('viewHora').textContent = a.hora || '—';
    document.getElementById('viewTipo').textContent = a.tipo || '—';
    const localStr = [a.endereco, a.cidade, a.estado].filter(Boolean).join(', ') || '—';
    document.getElementById('viewLocal').textContent = localStr;
    document.getElementById('viewCondicoes').textContent = a.condicoes || '—';
    document.getElementById('viewDescricao').textContent = a.descricao || '—';

    const envolvidos = Array.isArray(a.envolvidos) ? a.envolvidos : [];
    if (envolvidos.length === 0) {
        document.getElementById('viewEnvolvidos').innerHTML = '<p class="view-empty">Nenhum envolvido registrado.</p>';
    } else {
        document.getElementById('viewEnvolvidos').innerHTML = envolvidos.map((env, i) => {
            const nome = env.nome || '—';
            const tipo = env.tipo || '—';
            const veiculo = env.veiculo ? (env.veiculo) : '—';
            const cpf = env.cpf ? ('CPF: ' + env.cpf) : '';
            const tel = env.telefone ? ('Tel: ' + env.telefone) : '';
            const extra = [cpf, tel].filter(Boolean).join(' · ');
            return '<div class="view-envolvido-card"><div class="view-envolvido-num">' + (i + 1) + '</div><div class="view-envolvido-info"><strong>' + nome + '</strong><span class="view-envolvido-tipo">' + tipo + '</span>' + (veiculo !== '—' ? '<span>Veículo: ' + veiculo + '</span>' : '') + (extra ? '<span class="view-envolvido-extra">' + extra + '</span>' : '') + '</div></div>';
        }).join('');
    }

    document.getElementById('viewPolicia').textContent = a.policiaAcionada ? 'Sim' : 'Não';
    document.getElementById('viewBO').textContent = a.numeroBO || '—';
    document.getElementById('viewSamu').textContent = a.samuAcionado ? 'Sim' : 'Não';
    document.getElementById('viewHospitalizacao').textContent = a.hospitalizacao ? 'Sim' : 'Não';
    let hospitalNome = '—';
    if (a.hospitalizacao && a.hospital) {
        const h = hospitais.find(x => x.id == a.hospital);
        hospitalNome = h ? (h.nome + ' — ' + (h.cidade || '') + '/' + (h.estado || '')) : '—';
    }
    document.getElementById('viewHospital').textContent = hospitalNome;
    document.getElementById('viewVitimas').textContent = a.vitimas != null && a.vitimas !== '' ? a.vitimas : '0';
    document.getElementById('viewGravidade').textContent = a.gravidade || '—';
    document.getElementById('viewObservacoes').textContent = a.observacoes || '—';

    if (a.dataRegistro) {
        try {
            const d = new Date(a.dataRegistro);
            document.getElementById('viewDataRegistro').textContent = d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch (e) {
            document.getElementById('viewDataRegistro').textContent = a.dataRegistro;
        }
    } else {
        document.getElementById('viewDataRegistro').textContent = '—';
    }

    document.getElementById('modalVerAcidente').classList.add('active');
}

function closeViewAcidente() {
    document.getElementById('modalVerAcidente').classList.remove('active');
}

function editAcidente(id) {
    // Carrega os dados do acidente correspondente à linha clicada no grid (id do registro)
    const a = acidentes.find(x => x.id === id || x.id == id);
    if (!a) return;

    document.getElementById('modalAcidenteTitle').textContent = 'Editar Registro de Acidente' + (a.protocolo ? ' — ' + a.protocolo : '');
    document.getElementById('acidenteId').value = a.id;

    // Aba 1: Dados do Acidente
    document.getElementById('acidenteData').value = a.data || '';
    document.getElementById('acidenteHora').value = (a.hora || '').substring(0, 5) || ''; // HH:MM
    document.getElementById('acidenteTipo').value = a.tipo || '';
    document.getElementById('acidenteEndereco').value = a.endereco || '';
    document.getElementById('acidenteEstado').value = a.estado || '';
    document.getElementById('acidenteCidade').value = a.cidade || '';
    document.getElementById('acidenteDescricao').value = a.descricao || '';
    document.getElementById('acidenteCondicoes').value = a.condicoes || '';

    // Aba 2: Envolvidos
    resetEnvolvidos();
    const envolvidosList = Array.isArray(a.envolvidos) ? a.envolvidos : [];
    const container = document.getElementById('envolvidosContainer');
    envolvidosList.forEach((env, index) => {
        if (index > 0) addEnvolvido();
        const items = container.querySelectorAll('.envolvido-item');
        const item = items[index];
        if (!item) return;
        item.querySelector('.envolvido-nome').value = env.nome || '';
        item.querySelector('.envolvido-cpf').value = env.cpf || '';
        item.querySelector('.envolvido-telefone').value = env.telefone || '';
        const tipoSelect = item.querySelector('.envolvido-tipo');
        if (tipoSelect) tipoSelect.value = env.tipo || 'Condutor';
        item.querySelector('.envolvido-veiculo').value = env.veiculo || '';
        const segSelect = item.querySelector('.envolvido-seguradora');
        if (segSelect) segSelect.value = env.seguradora || '';
    });
    atualizarSelectsSeguradoras();
    // Reaplicar valores de seguradora após repopular options
    envolvidosList.forEach((env, index) => {
        const items = container.querySelectorAll('.envolvido-item');
        const item = items[index];
        if (item && env.seguradora) {
            const segSelect = item.querySelector('.envolvido-seguradora');
            if (segSelect) segSelect.value = env.seguradora;
        }
    });

    // Aba 3: Atendimento
    document.getElementById('acidentePoliciaAcionada').checked = !!a.policiaAcionada;
    document.getElementById('acidenteNumeroBO').value = a.numeroBO || '';
    document.getElementById('acidenteSamuAcionado').checked = !!a.samuAcionado;
    document.getElementById('acidenteHospitalizacao').checked = !!a.hospitalizacao;
    document.getElementById('acidenteHospital').value = a.hospital || '';
    document.getElementById('acidenteVitimas').value = a.vitimas != null && a.vitimas !== '' ? a.vitimas : 0;
    document.getElementById('acidenteGravidade').value = a.gravidade || 'Sem vítimas';
    document.getElementById('acidenteObservacoes').value = a.observacoes || '';
    document.getElementById('hospitalGroup').style.display = a.hospitalizacao ? 'block' : 'none';

    showTab(0);
    document.getElementById('modalAcidente').classList.add('active');
}

function deleteAcidente(id) {
    if (confirm('Deseja realmente excluir este registro?')) {
        acidentes = acidentes.filter(x => x.id !== id);
        const filtered = getFilteredAcidentes();
        const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE_ACIDENTES));
        if (currentPageAcidentes > totalPages) currentPageAcidentes = totalPages;
        localStorage.setItem('acidentes', JSON.stringify(acidentes));
        renderAcidentes();
    }
}

// Inicializar
preencherSelects();
renderAcidentes();

// Inicializar autocomplete
let autocompleteProtocolo, filtroEstadoCidadeAC, modalEstadoCidadeAC;

window.addEventListener('DOMContentLoaded', () => {
    // Autocomplete para Protocolo no filtro
    autocompleteProtocolo = initAutocomplete('filtroProtocolo', acidentes, {
        minChars: 2,
        maxResults: 10,
        filterFunction: (query, data) => {
            const lowerQuery = query.toLowerCase();
            return data.filter(a => a.protocolo.toLowerCase().includes(lowerQuery));
        },
        renderItem: (item, query) => {
            const lowerProtocolo = item.protocolo.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerProtocolo.indexOf(lowerQuery);
            
            if (index === -1) return item.protocolo;
            
            const before = item.protocolo.substring(0, index);
            const match = item.protocolo.substring(index, index + query.length);
            const after = item.protocolo.substring(index + query.length);
            
            return `${before}<strong>${match}</strong>${after}`;
        },
        onSelect: (item) => {
            aplicarFiltros();
        }
    });

    // Autocomplete de Estado-Cidade no filtro
    filtroEstadoCidadeAC = initEstadoCidadeAutocomplete('filtroEstado', 'filtroCidade', {
        onEstadoSelect: () => {
            currentPageAcidentes = 1;
            renderAcidentes();
        },
        onCidadeSelect: () => {
            currentPageAcidentes = 1;
            renderAcidentes();
        }
    });

    // Autocomplete de Estado-Cidade no modal
    modalEstadoCidadeAC = initEstadoCidadeAutocomplete('acidenteEstado', 'acidenteCidade');

    // Busca em tempo real ao digitar ou limpar
    let debounceFiltroAcidentes;
    function aplicarFiltroAcidentesAoDigitar() {
        clearTimeout(debounceFiltroAcidentes);
        debounceFiltroAcidentes = setTimeout(function() {
            currentPageAcidentes = 1;
            renderAcidentes();
        }, 300);
    }
    document.getElementById('filtroProtocolo').addEventListener('input', aplicarFiltroAcidentesAoDigitar);
    document.getElementById('filtroCidade').addEventListener('input', aplicarFiltroAcidentesAoDigitar);
    document.getElementById('filtroEstado').addEventListener('input', aplicarFiltroAcidentesAoDigitar);
    document.getElementById('filtroTipo').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroDataInicio').addEventListener('input', aplicarFiltroAcidentesAoDigitar);
    document.getElementById('filtroDataInicio').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroDataFim').addEventListener('input', aplicarFiltroAcidentesAoDigitar);
    document.getElementById('filtroDataFim').addEventListener('change', aplicarFiltros);
});
