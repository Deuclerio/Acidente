/* Sistema de Autocomplete Reutilizável */

class Autocomplete {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            data: options.data || [],
            minChars: options.minChars || 1,
            maxResults: options.maxResults || 10,
            onSelect: options.onSelect || (() => {}),
            filterFunction: options.filterFunction || this.defaultFilter.bind(this),
            renderItem: options.renderItem || this.defaultRender.bind(this),
            debounceTime: options.debounceTime || 300
        };
        
        this.isOpen = false;
        this.selectedIndex = -1;
        this.filteredData = [];
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        // Criar container de autocomplete
        const container = document.createElement('div');
        container.className = 'autocomplete-container';
        
        // Envolver o input
        this.input.parentNode.insertBefore(container, this.input);
        container.appendChild(this.input);
        
        // Criar lista de sugestões
        this.list = document.createElement('div');
        this.list.className = 'autocomplete-list';
        container.appendChild(this.list);
        
        // Event listeners
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('focus', (e) => this.handleFocus(e));
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                this.close();
            }
        });
    }
    
    handleInput(e) {
        clearTimeout(this.debounceTimer);
        
        const value = e.target.value.trim();
        
        if (value.length < this.options.minChars) {
            this.close();
            return;
        }
        
        this.debounceTimer = setTimeout(() => {
            this.search(value);
        }, this.options.debounceTime);
    }
    
    handleFocus(e) {
        const value = e.target.value.trim();
        if (value.length >= this.options.minChars) {
            this.search(value);
        }
    }
    
    handleKeydown(e) {
        if (!this.isOpen) return;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectPrevious();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectItem(this.filteredData[this.selectedIndex]);
                }
                break;
            case 'Escape':
                this.close();
                break;
        }
    }
    
    search(query) {
        this.filteredData = this.options.filterFunction(query, this.options.data);
        this.filteredData = this.filteredData.slice(0, this.options.maxResults);
        this.render();
    }
    
    defaultFilter(query, data) {
        const lowerQuery = query.toLowerCase();
        return data.filter(item => {
            const searchText = typeof item === 'string' ? item : JSON.stringify(Object.values(item));
            return searchText.toLowerCase().includes(lowerQuery);
        });
    }
    
    defaultRender(item, query) {
        const text = typeof item === 'string' ? item : item.nome || item.name || JSON.stringify(item);
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);
        
        if (index === -1) return text;
        
        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);
        
        return `${before}<strong>${match}</strong>${after}`;
    }
    
    render() {
        this.list.innerHTML = '';
        this.selectedIndex = -1;
        
        if (this.filteredData.length === 0) {
            this.list.innerHTML = '<div class="autocomplete-empty">Nenhum resultado encontrado</div>';
            this.open();
            return;
        }
        
        this.filteredData.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.innerHTML = this.options.renderItem(item, this.input.value.trim());
            div.addEventListener('click', () => this.selectItem(item));
            this.list.appendChild(div);
        });
        
        this.open();
    }
    
    selectNext() {
        const items = this.list.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;
        
        if (this.selectedIndex < items.length - 1) {
            this.selectedIndex++;
            this.updateSelection(items);
        }
    }
    
    selectPrevious() {
        const items = this.list.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;
        
        if (this.selectedIndex > 0) {
            this.selectedIndex--;
            this.updateSelection(items);
        }
    }
    
    updateSelection(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    selectItem(item) {
        const value = typeof item === 'string' ? item : item.nome || item.name || '';
        this.input.value = value;
        this.options.onSelect(item);
        this.close();
    }
    
    open() {
        this.list.classList.add('show');
        this.isOpen = true;
    }
    
    close() {
        this.list.classList.remove('show');
        this.isOpen = false;
        this.selectedIndex = -1;
    }
    
    updateData(newData) {
        this.options.data = newData;
    }
    
    destroy() {
        this.list.remove();
        this.input.removeEventListener('input', this.handleInput);
        this.input.removeEventListener('keydown', this.handleKeydown);
        this.input.removeEventListener('focus', this.handleFocus);
    }
}

// Função helper para inicializar autocomplete facilmente
function initAutocomplete(inputId, data, options = {}) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.warn(`Input com id "${inputId}" não encontrado`);
        return null;
    }
    
    return new Autocomplete(input, {
        data: data,
        ...options
    });
}

// Função para converter <select> em autocomplete
function convertSelectToAutocomplete(selectId, data, options = {}) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.warn(`Select com id "${selectId}" não encontrado`);
        return null;
    }
    
    // Criar input de substituição
    const input = document.createElement('input');
    input.type = 'text';
    input.id = selectId;
    input.className = select.className;
    input.placeholder = options.placeholder || 'Digite para buscar...';
    input.required = select.required;
    
    // Criar campo hidden para armazenar o ID selecionado
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = selectId + '_value';
    hiddenInput.name = select.name;
    
    // Substituir select por input
    select.parentNode.insertBefore(input, select);
    select.parentNode.insertBefore(hiddenInput, select);
    select.style.display = 'none';
    
    // Configurar autocomplete
    const autocomplete = new Autocomplete(input, {
        data: data,
        minChars: options.minChars || 0,
        maxResults: options.maxResults || 15,
        filterFunction: options.filterFunction || ((query, items) => {
            if (!query) return items;
            const lowerQuery = query.toLowerCase();
            return items.filter(item => {
                const text = options.getItemText ? options.getItemText(item) : (item.nome || item.name || String(item));
                return text.toLowerCase().includes(lowerQuery);
            });
        }),
        renderItem: options.renderItem || ((item, query) => {
            const text = options.getItemText ? options.getItemText(item) : (item.nome || item.name || String(item));
            if (!query) return text;
            
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerText.indexOf(lowerQuery);
            
            if (index === -1) return text;
            
            const before = text.substring(0, index);
            const match = text.substring(index, index + query.length);
            const after = text.substring(index + query.length);
            
            return `${before}<strong>${match}</strong>${after}`;
        }),
        onSelect: (item) => {
            const itemId = options.getItemId ? options.getItemId(item) : (item.id || item);
            const itemText = options.getItemText ? options.getItemText(item) : (item.nome || item.name || String(item));
            
            input.value = itemText;
            hiddenInput.value = itemId;
            select.value = itemId;
            
            if (options.onSelect) options.onSelect(item);
        }
    });
    
    // Quando o input recebe foco e está vazio, mostrar todas as opções
    input.addEventListener('focus', () => {
        if (!input.value || input.value.trim() === '') {
            autocomplete.search('');
        }
    });
    
    // Limpar hidden quando input é limpo
    input.addEventListener('input', () => {
        if (!input.value) {
            hiddenInput.value = '';
            select.value = '';
        }
    });
    
    return {
        autocomplete: autocomplete,
        input: input,
        hiddenInput: hiddenInput,
        originalSelect: select,
        setValue: (id, text) => {
            input.value = text || '';
            hiddenInput.value = id || '';
            select.value = id || '';
        },
        getValue: () => hiddenInput.value,
        getText: () => input.value
    };
}

// Função para criar autocomplete de Estado e Cidade vinculados
function initEstadoCidadeAutocomplete(estadoInputId, cidadeInputId, options = {}) {
    const estadoInput = document.getElementById(estadoInputId);
    const cidadeInput = document.getElementById(cidadeInputId);
    
    if (!estadoInput) {
        console.warn(`Input de estado "${estadoInputId}" não encontrado`);
        return null;
    }
    
    if (!cidadeInput) {
        console.warn(`Input de cidade "${cidadeInputId}" não encontrado`);
        return null;
    }
    
    // Lista de estados para autocomplete
    const estados = Object.keys(ESTADOS_CIDADES_BR);
    
    let cidadeAutocomplete = null;
    let estadoAutocomplete = null;
    
    // Função para atualizar autocomplete de cidade baseado no estado
    function updateCidadeAutocomplete() {
        const estadoSelecionado = estadoInput.value.toUpperCase().trim();
        const cidades = estadoSelecionado && ESTADOS_CIDADES_BR[estadoSelecionado] 
            ? getCidadesByEstado(estadoSelecionado) 
            : getAllCidades();
        
        if (cidadeAutocomplete) {
            cidadeAutocomplete.updateData(cidades);
        }
    }
    
    // Inicializar autocomplete de estado
    estadoAutocomplete = new Autocomplete(estadoInput, {
        data: estados,
        minChars: 0,
        maxResults: 27,
        filterFunction: (query, items) => {
            if (!query) return items;
            const lowerQuery = query.toLowerCase();
            return items.filter(uf => uf.toLowerCase().includes(lowerQuery));
        },
        renderItem: (uf, query) => {
            const nomeEstado = getEstadoNome(uf);
            const displayText = `${uf} - ${nomeEstado}`;
            if (!query) return displayText;
            
            const lowerUF = uf.toLowerCase();
            const lowerNome = nomeEstado.toLowerCase();
            const lowerQuery = query.toLowerCase();
            
            if (lowerUF.includes(lowerQuery)) {
                const index = lowerUF.indexOf(lowerQuery);
                const before = uf.substring(0, index);
                const match = uf.substring(index, index + query.length);
                const after = uf.substring(index + query.length);
                return `<strong>${before}${match}${after}</strong> - ${nomeEstado}`;
            }
            
            if (lowerNome.includes(lowerQuery)) {
                const index = lowerNome.indexOf(lowerQuery);
                const before = nomeEstado.substring(0, index);
                const match = nomeEstado.substring(index, index + query.length);
                const after = nomeEstado.substring(index + query.length);
                return `${uf} - ${before}<strong>${match}</strong>${after}`;
            }
            
            return displayText;
        },
        onSelect: (uf) => {
            estadoInput.value = uf;
            cidadeInput.value = ''; // Limpar cidade ao trocar estado
            updateCidadeAutocomplete();
            if (options.onEstadoSelect) options.onEstadoSelect(uf);
        }
    });
    
    // Inicializar autocomplete de cidade
    cidadeAutocomplete = new Autocomplete(cidadeInput, {
        data: getAllCidades(),
        minChars: 0,
        maxResults: 15,
        filterFunction: (query, items) => {
            if (!query) return items;
            const lowerQuery = query.toLowerCase();
            return items.filter(cidade => cidade.toLowerCase().includes(lowerQuery));
        },
        renderItem: (cidade, query) => {
            if (!query) return cidade;
            
            const lowerCidade = cidade.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerCidade.indexOf(lowerQuery);
            
            if (index === -1) return cidade;
            
            const before = cidade.substring(0, index);
            const match = cidade.substring(index, index + query.length);
            const after = cidade.substring(index + query.length);
            
            return `${before}<strong>${match}</strong>${after}`;
        },
        onSelect: (cidade) => {
            cidadeInput.value = cidade;
            if (options.onCidadeSelect) options.onCidadeSelect(cidade);
        }
    });
    
    // Atualizar cidades quando estado mudar manualmente
    estadoInput.addEventListener('input', () => {
        clearTimeout(estadoInput._updateTimer);
        estadoInput._updateTimer = setTimeout(updateCidadeAutocomplete, 300);
    });
    
    // Inicializar com todas as cidades
    updateCidadeAutocomplete();
    
    return {
        estadoAutocomplete,
        cidadeAutocomplete,
        setEstado: (uf) => {
            estadoInput.value = uf || '';
            updateCidadeAutocomplete();
        },
        setCidade: (cidade) => {
            cidadeInput.value = cidade || '';
        },
        getEstado: () => estadoInput.value,
        getCidade: () => cidadeInput.value,
        update: updateCidadeAutocomplete
    };
}

// Função auxiliar para obter nome completo do estado
function getEstadoNome(uf) {
    const nomes = {
        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
        'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
        'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
        'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
        'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
        'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
        'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    return nomes[uf] || uf;
}

// Função para criar autocomplete de cidade vinculado a um select de estado
function initCidadeAutocomplete(cidadeInputId, estadoSelectId, options = {}) {
    const cidadeInput = document.getElementById(cidadeInputId);
    const estadoSelect = document.getElementById(estadoSelectId);
    
    if (!cidadeInput) {
        console.warn(`Input de cidade "${cidadeInputId}" não encontrado`);
        return null;
    }
    
    if (!estadoSelect) {
        console.warn(`Select de estado "${estadoSelectId}" não encontrado`);
        return null;
    }
    
    let currentAutocomplete = null;
    
    function updateCidadeAutocomplete() {
        const estadoSelecionado = estadoSelect.value;
        const cidades = estadoSelecionado ? getCidadesByEstado(estadoSelecionado) : getAllCidades();
        
        // Destruir autocomplete anterior se existir
        if (currentAutocomplete) {
            currentAutocomplete.destroy();
        }
        
        // Criar novo autocomplete com as cidades do estado
        currentAutocomplete = new Autocomplete(cidadeInput, {
            data: cidades,
            minChars: options.minChars || 0,
            maxResults: options.maxResults || 15,
            filterFunction: (query, items) => {
                if (!query) return items;
                const lowerQuery = query.toLowerCase();
                return items.filter(cidade => cidade.toLowerCase().includes(lowerQuery));
            },
            renderItem: (cidade, query) => {
                if (!query) return cidade;
                
                const lowerCidade = cidade.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const index = lowerCidade.indexOf(lowerQuery);
                
                if (index === -1) return cidade;
                
                const before = cidade.substring(0, index);
                const match = cidade.substring(index, index + query.length);
                const after = cidade.substring(index + query.length);
                
                return `${before}<strong>${match}</strong>${after}`;
            },
            onSelect: (cidade) => {
                if (options.onSelect) options.onSelect(cidade);
            }
        });
    }
    
    // Atualizar quando o estado mudar
    estadoSelect.addEventListener('change', () => {
        cidadeInput.value = ''; // Limpar cidade ao trocar estado
        updateCidadeAutocomplete();
    });
    
    // Inicializar
    updateCidadeAutocomplete();
    
    return {
        update: updateCidadeAutocomplete,
        destroy: () => {
            if (currentAutocomplete) {
                currentAutocomplete.destroy();
            }
        }
    };
}
