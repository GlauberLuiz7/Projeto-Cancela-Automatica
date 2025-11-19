// ===== VARIÁVEIS GLOBAIS =====
let currentPage = 'dashboard';
let selectedGateId = null;
let selectedWalletId = null;
let selectedPaymentMethod = 'pix';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initModals();
    renderDashboard();
    renderAllPages();
});

// ===== NAVEGAÇÃO =====
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
            
            // Fechar sidebar no mobile
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });

    menuToggle.addEventListener('click', function() {
        sidebar.classList.add('active');
    });

    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('active');
    });

    // Fechar sidebar ao clicar fora (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function navigateToPage(page) {
    currentPage = page;
    
    // Atualizar navegação ativa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Mostrar página correspondente
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
    
    // Renderizar página específica
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'cancelas':
            renderCancelas();
            break;
        case 'usuarios':
            renderUsuarios();
            break;
        case 'veiculos':
            renderVeiculos();
            break;
        case 'saldos':
            renderSaldos();
            break;
        case 'estadias':
            renderEstadias();
            break;
        case 'relatorios':
            renderRelatorios();
            break;
        case 'auditoria':
            renderAuditoria();
            break;
        case 'configuracoes':
            renderConfiguracoes();
            break;
    }
}

// ===== DASHBOARD =====
function renderDashboard() {
    const stats = DATA.dashboardStats;
    
    // Atualizar estatísticas
    document.getElementById('veiculosEstacionamento').textContent = stats.veiculosNoEstacionamento;
    document.getElementById('ocupacaoPercent').textContent = stats.ocupacaoPercentual.toFixed(1) + '%';
    document.getElementById('receitaDia').textContent = formatCurrency(stats.receitaDia);
    document.getElementById('estadiasHoje').textContent = stats.estadiasHoje;
    document.getElementById('cancelasOp').textContent = stats.cancelasOperacionais;
    document.getElementById('cancelasTotal').textContent = stats.cancelasTotal;
    document.getElementById('alertasAtivos').textContent = stats.alertasAtivos;
    document.getElementById('saldoMedio').textContent = formatCurrency(stats.saldoMedioUsuarios);
    
    // Renderizar veículos em estacionamento
    renderVeiculosEstacionamento();
    
    // Renderizar atividades recentes
    renderAtividadesRecentes();
    
    // Renderizar gráfico de receita
    renderReceitaChart();
}

function renderVeiculosEstacionamento() {
    const container = document.getElementById('veiculosLista');
    const estadiasAtivas = DATA.estadias.filter(e => e.status === 'em_andamento');
    
    if (estadiasAtivas.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum veículo no estacionamento</p>';
        return;
    }
    
    container.innerHTML = estadiasAtivas.map(estadia => `
        <div class="vehicle-item">
            <div class="vehicle-left">
                <div class="vehicle-icon">
                    <i class="fas fa-car"></i>
                </div>
                <div class="vehicle-info">
                    <p>${estadia.placa}</p>
                    <p>${estadia.metodoIdentificacao.toUpperCase()}</p>
                </div>
            </div>
            <div class="vehicle-right">
                <div class="vehicle-time">${getTimeSince(estadia.entrada)}</div>
                <div class="vehicle-since">desde ${formatTime(estadia.entrada)}</div>
            </div>
        </div>
    `).join('');
}

function renderAtividadesRecentes() {
    const container = document.getElementById('atividadesRecentes');
    const eventos = DATA.eventosCancelas.slice(0, 5);
    
    container.innerHTML = eventos.map(evento => `
        <div class="activity-item">
            <div class="activity-left">
                <div class="activity-icon ${evento.tipo === 'abertura_automatica' ? 'auto' : 'manual'}">
                    <i class="fas fa-door-open"></i>
                </div>
                <div class="activity-info">
                    <p>${evento.tipo === 'abertura_automatica' ? 'Abertura Automática' : 'Abertura Manual'}</p>
                    <p>Placa: ${evento.veiculoPlaca || 'N/A'}</p>
                    ${evento.motivo ? `<p style="font-size: 0.75rem; color: var(--color-gray-500); margin-top: 0.25rem;">${evento.motivo}</p>` : ''}
                </div>
            </div>
            <div class="activity-right">
                <div class="activity-time">${formatTime(evento.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function renderReceitaChart() {
    const container = document.getElementById('receitaChart');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const valores = DATA.receitaSemanal;
    const maxValor = Math.max(...valores);
    
    container.innerHTML = valores.map((valor, index) => {
        const altura = (valor / maxValor) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-bar-inner" style="height: ${altura}%">
                    <div class="chart-value">R$ ${valor.toFixed(2)}</div>
                </div>
                <div class="chart-label">${dias[index]}</div>
            </div>
        `;
    }).join('');
}

// ===== CANCELAS =====
function renderCancelas() {
    renderCancelasGrid();
    renderCancelasStatus();
}

function renderCancelasGrid() {
    const container = document.getElementById('cancelasGrid');
    
    container.innerHTML = DATA.cancelas.map(cancela => `
        <div class="cancela-card ${cancela.status}">
            <div class="cancela-header">
                <div class="cancela-title ${cancela.status}">
                    <i class="fas ${cancela.status === 'aberta' ? 'fa-door-open' : cancela.status === 'fechada' ? 'fa-door-closed' : cancela.status === 'manutencao' ? 'fa-tools' : 'fa-exclamation-triangle'}"></i>
                    <div>
                        <div class="cancela-name">${cancela.nome}</div>
                        <div class="cancela-zone">Zona ${cancela.zona}</div>
                    </div>
                </div>
                <span class="cancela-status ${cancela.status}">${cancela.status.toUpperCase()}</span>
            </div>
            <div class="cancela-info">
                <div class="info-row">
                    <span class="info-label">Tipo:</span>
                    <span class="info-value">${cancela.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Última atualização:</span>
                    <span class="info-value">${formatTime(cancela.ultimaAtualizacao)}</span>
                </div>
            </div>
            <div class="cancela-actions">
                <button class="btn btn-primary btn-sm" onclick="abrirCancelaAuto('${cancela.id}')" ${cancela.status !== 'fechada' ? 'disabled' : ''}>
                    <i class="fas fa-check-circle"></i>
                    Abrir Auto
                </button>
                <button class="btn btn-dark btn-sm" onclick="abrirCancelaManual('${cancela.id}')" ${cancela.status !== 'fechada' ? 'disabled' : ''}>
                    <i class="fas fa-door-open"></i>
                    Manual
                </button>
            </div>
        </div>
    `).join('');
}

function renderCancelasStatus() {
    const container = document.getElementById('cancelasStatus');
    const fechadas = DATA.cancelas.filter(c => c.status === 'fechada').length;
    const abertas = DATA.cancelas.filter(c => c.status === 'aberta').length;
    const manutencao = DATA.cancelas.filter(c => c.status === 'manutencao').length;
    const erro = DATA.cancelas.filter(c => c.status === 'erro').length;
    
    container.innerHTML = `
        <div class="status-item operacionais">
            <div class="status-value">${fechadas}</div>
            <div class="status-label">Operacionais</div>
        </div>
        <div class="status-item abertas">
            <div class="status-value">${abertas}</div>
            <div class="status-label">Abertas</div>
        </div>
        <div class="status-item manutencao">
            <div class="status-value">${manutencao}</div>
            <div class="status-label">Manutenção</div>
        </div>
        <div class="status-item erro">
            <div class="status-value">${erro}</div>
            <div class="status-label">Com Erro</div>
        </div>
    `;
}

function abrirCancelaAuto(gateId) {
    const cancela = DATA.cancelas.find(c => c.id === gateId);
    if (!cancela) return;
    
    // Atualizar status da cancela
    cancela.status = 'aberta';
    cancela.ultimaAtualizacao = new Date();
    
    // Adicionar evento
    const novoEvento = {
        id: `evento-${Date.now()}`,
        cancelaId: gateId,
        tipo: 'abertura_automatica',
        timestamp: new Date(),
        veiculoPlaca: 'AUTO-' + Math.floor(Math.random() * 9999)
    };
    DATA.eventosCancelas.unshift(novoEvento);
    
    // Adicionar log de auditoria
    const novoLog = {
        id: `log-${Date.now()}`,
        ator: 'Sistema',
        acao: 'ABERTURA_AUTOMATICA_CANCELA',
        alvo: cancela.nome,
        timestamp: new Date(),
        detalhes: 'Abertura automática da cancela',
        ip: 'SYSTEM'
    };
    DATA.logsAuditoria.unshift(novoLog);
    
    // Re-renderizar
    renderCancelas();
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        cancela.status = 'fechada';
        cancela.ultimaAtualizacao = new Date();
        renderCancelas();
    }, 5000);
}

function abrirCancelaManual(gateId) {
    selectedGateId = gateId;
    document.getElementById('modalAbertura').classList.add('active');
}

// ===== USUÁRIOS =====
function renderUsuarios() {
    renderUsuariosTable();
    renderUsuariosStats();
    
    // Adicionar event listeners
    document.getElementById('searchUsuarios').addEventListener('input', renderUsuariosTable);
    document.getElementById('filterTipoUsuario').addEventListener('change', renderUsuariosTable);
}

function renderUsuariosTable() {
    const container = document.getElementById('usuariosTable');
    const search = document.getElementById('searchUsuarios').value.toLowerCase();
    const filter = document.getElementById('filterTipoUsuario').value;
    
    const usuariosFiltrados = DATA.usuarios.filter(usuario => {
        const matchSearch = usuario.nome.toLowerCase().includes(search) || 
                          usuario.email.toLowerCase().includes(search) ||
                          (usuario.cpf && usuario.cpf.includes(search));
        const matchFilter = filter === 'todos' || usuario.tipo === filter;
        return matchSearch && matchFilter;
    });
    
    const tipoLabels = {
        funcionario: 'Funcionário',
        aluno: 'Aluno',
        visitante: 'Visitante',
        admin: 'Administrador',
        operador: 'Operador'
    };
    
    container.innerHTML = `
        <thead>
            <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            ${usuariosFiltrados.map(usuario => `
                <tr>
                    <td>
                        <div class="text-primary">${usuario.nome}</div>
                        ${usuario.cpf ? `<div style="font-size: 0.75rem; color: var(--color-gray-500);">CPF: ${usuario.cpf}</div>` : ''}
                    </td>
                    <td>${usuario.email}</td>
                    <td>
                        <span class="badge badge-${usuario.tipo}">${tipoLabels[usuario.tipo]}</span>
                    </td>
                    <td>
                        <span class="badge badge-${usuario.status}">
                            <i class="fas ${usuario.status === 'ativo' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)}
                        </span>
                    </td>
                    <td>${formatDate(usuario.dataCadastro)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="table-btn edit"><i class="fas fa-edit"></i></button>
                            <button class="table-btn delete" onclick="deletarUsuario('${usuario.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function renderUsuariosStats() {
    const container = document.getElementById('usuariosStats');
    const total = DATA.usuarios.length;
    const funcionarios = DATA.usuarios.filter(u => u.tipo === 'funcionario').length;
    const alunos = DATA.usuarios.filter(u => u.tipo === 'aluno').length;
    const admins = DATA.usuarios.filter(u => u.tipo === 'admin').length;
    const ativos = DATA.usuarios.filter(u => u.status === 'ativo').length;
    
    container.innerHTML = `
        <div class="card">
            <div class="card-content" style="text-align: center; padding: 1rem;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.25rem;">${total}</div>
                <div style="font-size: 0.875rem; color: var(--color-gray-600);">Total</div>
            </div>
        </div>
        <div class="card">
            <div class="card-content" style="text-align: center; padding: 1rem;">
                <div style="font-size: 2rem; font-weight: 700; color: #3B82F6; margin-bottom: 0.25rem;">${funcionarios}</div>
                <div style="font-size: 0.875rem; color: var(--color-gray-600);">Funcionários</div>
            </div>
        </div>
        <div class="card">
            <div class="card-content" style="text-align: center; padding: 1rem;">
                <div style="font-size: 2rem; font-weight: 700; color: #22C55E; margin-bottom: 0.25rem;">${alunos}</div>
                <div style="font-size: 0.875rem; color: var(--color-gray-600);">Alunos</div>
            </div>
        </div>
        <div class="card">
            <div class="card-content" style="text-align: center; padding: 1rem;">
                <div style="font-size: 2rem; font-weight: 700; color: #A855F7; margin-bottom: 0.25rem;">${admins}</div>
                <div style="font-size: 0.875rem; color: var(--color-gray-600);">Admins</div>
            </div>
        </div>
        <div class="card">
            <div class="card-content" style="text-align: center; padding: 1rem;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-success); margin-bottom: 0.25rem;">${ativos}</div>
                <div style="font-size: 0.875rem; color: var(--color-gray-600);">Ativos</div>
            </div>
        </div>
    `;
}

function deletarUsuario(usuarioId) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const index = DATA.usuarios.findIndex(u => u.id === usuarioId);
        if (index > -1) {
            DATA.usuarios.splice(index, 1);
            renderUsuarios();
        }
    }
}

// ===== VEÍCULOS =====
function renderVeiculos() {
    const container = document.getElementById('veiculosTable');
    
    container.innerHTML = `
        <thead>
            <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Proprietário</th>
                <th>RFID</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${DATA.veiculos.map(veiculo => {
                const proprietario = DATA.usuarios.find(u => u.id === veiculo.usuarioId);
                return `
                    <tr>
                        <td class="text-primary">${veiculo.placa}</td>
                        <td>${veiculo.modelo || '-'}</td>
                        <td>${proprietario ? proprietario.nome : 'Não encontrado'}</td>
                        <td>${veiculo.rfid || '-'}</td>
                        <td>
                            <span class="badge badge-${veiculo.ativo}">${veiculo.ativo.toUpperCase()}</span>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
}

// ===== SALDOS E RECARGAS =====
function renderSaldos() {
    renderSaldosStats();
    renderCarteiras();
}

function renderSaldosStats() {
    const container = document.getElementById('saldosStats');
    const totalSaldo = DATA.carteiras.reduce((sum, c) => sum + c.saldo, 0);
    const totalRecargas = DATA.transacoes.filter(t => t.tipo === 'recarga').reduce((sum, t) => sum + t.valor, 0);
    
    container.innerHTML = `
        <div class="stat-card stat-primary">
            <div class="stat-icon"><i class="fas fa-wallet"></i></div>
            <div class="stat-content">
                <div class="stat-value">${formatCurrency(totalSaldo)}</div>
                <div class="stat-label">Saldo Total em Carteiras</div>
            </div>
        </div>
        <div class="stat-card stat-accent">
            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
            <div class="stat-content">
                <div class="stat-value">${formatCurrency(totalRecargas)}</div>
                <div class="stat-label">Total de Recargas</div>
            </div>
        </div>
        <div class="stat-card stat-success">
            <div class="stat-icon"><i class="fas fa-credit-card"></i></div>
            <div class="stat-content">
                <div class="stat-value">${DATA.carteiras.length}</div>
                <div class="stat-label">Carteiras Ativas</div>
            </div>
        </div>
    `;
}

function renderCarteiras() {
    const container = document.getElementById('carteirasLista');
    
    container.innerHTML = `
        <div class="card-header">
            <h3>Carteiras de Usuários</h3>
        </div>
        <div class="card-content">
            ${DATA.carteiras.map(carteira => {
                const usuario = DATA.usuarios.find(u => u.id === carteira.usuarioId);
                const transacoes = getTransacoesByCarteira(carteira.id);
                
                return `
                    <div style="padding: 1.5rem; border-bottom: 1px solid var(--color-gray-200);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                            <div>
                                <h4 class="text-primary" style="margin-bottom: 0.25rem;">${usuario ? usuario.nome : 'Usuário não encontrado'}</h4>
                                <p style="font-size: 0.875rem; color: var(--color-gray-500);">ID: ${carteira.id}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 0.25rem;">Saldo Atual</p>
                                <p style="font-size: 2rem; font-weight: 700; color: ${carteira.saldo >= 0 ? 'var(--color-success)' : 'var(--color-alert)'};">
                                    ${formatCurrency(carteira.saldo)}
                                </p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.875rem;">
                            <div>
                                <span style="color: var(--color-gray-600);">Limite Negativo:</span>
                                <span class="text-primary">${formatCurrency(carteira.limiteNegativo)}</span>
                            </div>
                            ${carteira.ultimaRecarga ? `
                                <div>
                                    <span style="color: var(--color-gray-600);">Última Recarga:</span>
                                    <span style="color: var(--color-gray-500);">${formatDate(carteira.ultimaRecarga)}</span>
                                </div>
                            ` : ''}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-sm" onclick="abrirModalRecarga('${carteira.id}')">
                                <i class="fas fa-credit-card"></i>
                                Adicionar Recarga
                            </button>
                            <button class="btn btn-dark btn-sm" onclick="toggleExtrato('${carteira.id}')">
                                <i class="fas fa-file-invoice"></i>
                                Ver Extrato
                            </button>
                        </div>
                        <div id="extrato-${carteira.id}" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-gray-200);">
                            <h4 class="text-primary" style="font-size: 0.875rem; margin-bottom: 0.75rem;">Extrato de Transações</h4>
                            <div style="max-height: 300px; overflow-y: auto;">
                                ${transacoes.map(t => `
                                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--color-gray-50); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                                        <div style="flex: 1;">
                                            <p style="font-size: 0.875rem; color: var(--color-gray-900); margin-bottom: 0.125rem;">${t.descricao}</p>
                                            <p style="font-size: 0.75rem; color: var(--color-gray-500);">${formatDateTime(t.data)}</p>
                                            ${t.metodoPagamento ? `<p style="font-size: 0.75rem; color: var(--color-gray-500);">${t.metodoPagamento.toUpperCase()}</p>` : ''}
                                        </div>
                                        <div style="text-align: right;">
                                            <p style="color: ${t.valor >= 0 ? 'var(--color-success)' : 'var(--color-alert)'}; font-weight: 600;">
                                                ${t.valor >= 0 ? '+' : ''}${formatCurrency(t.valor)}
                                            </p>
                                            <span class="badge" style="background: ${
                                                t.tipo === 'recarga' ? 'rgba(34, 197, 94, 0.1)' :
                                                t.tipo === 'cobranca' ? 'rgba(239, 68, 68, 0.1)' :
                                                'rgba(251, 191, 36, 0.1)'
                                            }; color: ${
                                                t.tipo === 'recarga' ? '#166534' :
                                                t.tipo === 'cobranca' ? '#991B1B' :
                                                '#92400E'
                                            };">${t.tipo.toUpperCase()}</span>
                                        </div>
                                    </div>
                                `).join('')}
                                ${transacoes.length === 0 ? '<p class="empty-state">Nenhuma transação encontrada</p>' : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function toggleExtrato(carteiraId) {
    const extrato = document.getElementById(`extrato-${carteiraId}`);
    extrato.style.display = extrato.style.display === 'none' ? 'block' : 'none';
}

function abrirModalRecarga(carteiraId) {
    selectedWalletId = carteiraId;
    document.getElementById('modalRecarga').classList.add('active');
}

// ===== ESTADIAS =====
function renderEstadias() {
    const container = document.getElementById('estadiasTable');
    
    container.innerHTML = `
        <thead>
            <tr>
                <th>Placa</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th>Método</th>
                <th>Status</th>
                <th style="text-align: right;">Valor</th>
            </tr>
        </thead>
        <tbody>
            ${DATA.estadias.map(estadia => `
                <tr>
                    <td class="text-primary">${estadia.placa}</td>
                    <td>${formatDateTime(estadia.entrada)}</td>
                    <td>${estadia.saida ? formatDateTime(estadia.saida) : '-'}</td>
                    <td>${estadia.metodoIdentificacao.toUpperCase()}</td>
                    <td>
                        <span class="badge" style="background: ${
                            estadia.status === 'finalizada' ? 'rgba(34, 197, 94, 0.1)' :
                            estadia.status === 'em_andamento' ? 'rgba(59, 130, 246, 0.1)' :
                            'rgba(156, 163, 175, 0.1)'
                        }; color: ${
                            estadia.status === 'finalizada' ? '#166534' :
                            estadia.status === 'em_andamento' ? '#1E40AF' :
                            '#374151'
                        };">
                            ${estadia.status === 'finalizada' ? 'FINALIZADA' :
                              estadia.status === 'em_andamento' ? 'EM ANDAMENTO' :
                              'CANCELADA'}
                        </span>
                    </td>
                    <td class="text-primary" style="text-align: right;">${formatCurrency(estadia.valorFinal)}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// ===== RELATÓRIOS =====
function renderRelatorios() {
    renderRelatoriosStats();
    renderReceitaMensalChart();
}

function renderRelatoriosStats() {
    const container = document.getElementById('relatoriosStats');
    const totalReceita = DATA.estadias.filter(e => e.status === 'finalizada').reduce((sum, e) => sum + e.valorFinal, 0);
    const totalRecargas = DATA.transacoes.filter(t => t.tipo === 'recarga').reduce((sum, t) => sum + t.valor, 0);
    const ticketMedio = DATA.estadias.filter(e => e.status === 'finalizada').length > 0 
        ? totalReceita / DATA.estadias.filter(e => e.status === 'finalizada').length 
        : 0;
    
    container.innerHTML = `
        <div class="stat-card stat-primary">
            <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
            <div class="stat-content">
                <div class="stat-label">Receita Total</div>
                <div class="stat-value">${formatCurrency(totalReceita)}</div>
            </div>
        </div>
        <div class="stat-card stat-accent">
            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
            <div class="stat-content">
                <div class="stat-label">Total Recargas</div>
                <div class="stat-value">${formatCurrency(totalRecargas)}</div>
            </div>
        </div>
        <div class="stat-card stat-success">
            <div class="stat-icon"><i class="fas fa-car"></i></div>
            <div class="stat-content">
                <div class="stat-label">Ticket Médio</div>
                <div class="stat-value">${formatCurrency(ticketMedio)}</div>
            </div>
        </div>
    `;
}

function renderReceitaMensalChart() {
    const container = document.getElementById('receitaMensalChart');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const valores = meses.map(() => Math.random() * 5000 + 1000);
    const maxValor = Math.max(...valores);
    
    container.innerHTML = valores.map((valor, index) => {
        const altura = (valor / maxValor) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-bar-inner" style="height: ${altura}%">
                    <div class="chart-value">${formatCurrency(valor)}</div>
                </div>
                <div class="chart-label">${meses[index]}</div>
            </div>
        `;
    }).join('');
}

// ===== AUDITORIA =====
function renderAuditoria() {
    renderAuditoriaStats();
    renderAuditoriaTimeline();
}

function renderAuditoriaStats() {
    const container = document.getElementById('auditoriaStats');
    const total = DATA.logsAuditoria.length;
    const automaticas = DATA.logsAuditoria.filter(l => l.acao.includes('AUTOMATICA')).length;
    const manuais = DATA.logsAuditoria.filter(l => l.acao.includes('MANUAL')).length;
    
    container.innerHTML = `
        <div class="stat-card stat-primary">
            <div class="stat-icon"><i class="fas fa-shield-alt"></i></div>
            <div class="stat-content">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Total de Eventos</div>
            </div>
        </div>
        <div class="stat-card stat-accent">
            <div class="stat-icon"><i class="fas fa-filter"></i></div>
            <div class="stat-content">
                <div class="stat-value">${total}</div>
                <div class="stat-label">Registros Filtrados</div>
            </div>
        </div>
        <div class="stat-card stat-success">
            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
            <div class="stat-content">
                <div class="stat-value">${automaticas}</div>
                <div class="stat-label">Ações Automáticas</div>
            </div>
        </div>
        <div class="stat-card stat-alert">
            <div class="stat-icon"><i class="fas fa-hand-paper"></i></div>
            <div class="stat-content">
                <div class="stat-value">${manuais}</div>
                <div class="stat-label">Ações Manuais</div>
            </div>
        </div>
    `;
}

function renderAuditoriaTimeline() {
    const container = document.getElementById('auditoriaTimeline');
    
    function getBadgeClass(acao) {
        if (acao.includes('ABERTURA_MANUAL')) return 'badge' + ' ' + 'badge-operador';
        if (acao.includes('COBRANCA')) return 'badge' + ' ' + 'badge-aluno';
        if (acao.includes('ERRO')) return 'badge' + ' ' + 'badge-bloqueado';
        return 'badge' + ' ' + 'badge-admin';
    }
    
    container.innerHTML = DATA.logsAuditoria.map(log => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="${getBadgeClass(log.acao)}">${log.acao}</span>
                    <span class="timeline-time">${formatDateTime(log.timestamp)}</span>
                </div>
                <div class="timeline-body">
                    <p><strong>Ator:</strong> ${log.ator}</p>
                    <p><strong>Alvo:</strong> ${log.alvo}</p>
                    ${log.detalhes ? `<div class="timeline-details">${log.detalhes}</div>` : ''}
                    ${log.ip ? `<div class="timeline-ip">IP: ${log.ip}</div>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ===== CONFIGURAÇÕES =====
function renderConfiguracoes() {
    renderTarifasConfig();
    renderDescontosLista();
    renderSimuladorCobranca();
    renderParametrosOperacionais();
}

function renderTarifasConfig() {
    const container = document.getElementById('tarifasConfig');
    const tarifa = DATA.tarifas[0];
    
    if (!tarifa) return;
    
    container.innerHTML = `
        <div class="form-group">
            <label>Nome da Tarifa</label>
            <input type="text" value="${tarifa.nome}" readonly>
        </div>
        <div class="form-group">
            <label>Valor por Fração (R$)</label>
            <input type="number" value="${tarifa.valorFracao}" step="0.01" readonly>
            <p style="font-size: 0.75rem; color: var(--color-gray-500); margin-top: 0.25rem;">Valor cobrado por cada fração de tempo</p>
        </div>
        <div class="form-group">
            <label>Tempo da Fração (minutos)</label>
            <input type="number" value="${tarifa.tempoFracao}" readonly>
            <p style="font-size: 0.75rem; color: var(--color-gray-500); margin-top: 0.25rem;">Tempo que corresponde a uma fração de cobrança</p>
        </div>
        <div class="form-group">
            <label>Tolerância (minutos)</label>
            <input type="number" value="${tarifa.tolerancia}" readonly>
            <p style="font-size: 0.75rem; color: var(--color-gray-500); margin-top: 0.25rem;">Tempo gratuito antes de iniciar a cobrança</p>
        </div>
        <div class="form-group">
            <label>Teto Diário (R$)</label>
            <input type="number" value="${tarifa.tetoDiario}" step="0.01" readonly>
        </div>
        <div class="form-group">
            <label>Valor Pernoite (R$)</label>
            <input type="number" value="${tarifa.valorPernoite}" step="0.01" readonly>
        </div>
        <button class="btn btn-primary" style="width: 100%;">
            <i class="fas fa-save"></i>
            Salvar Alterações
        </button>
    `;
}

function renderDescontosLista() {
    const container = document.getElementById('descontosLista');
    
    container.innerHTML = DATA.descontos.map(desconto => `
        <div class="discount-item">
            <div class="discount-header">
                <div>
                    <div class="discount-name">${desconto.nome}</div>
                    <div class="discount-target">Público: ${desconto.publicoAlvo.join(', ')}</div>
                </div>
                <span class="badge ${desconto.ativo ? 'badge-ativo' : 'badge-inativo'}">
                    ${desconto.ativo ? 'ATIVO' : 'INATIVO'}
                </span>
            </div>
            <div class="discount-details">
                <div class="discount-detail">
                    <i class="fas fa-percent"></i>
                    <span>${desconto.tipo === 'percentual' ? desconto.valor + '%' : formatCurrency(desconto.valor)}</span>
                </div>
                <div class="discount-detail">
                    <i class="fas fa-clock"></i>
                    <span>${formatDate(desconto.vigenciaInicio)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSimuladorCobranca() {
    const container = document.getElementById('simuladorCobranca');
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
                <label>Tempo de Permanência (minutos)</label>
                <input type="number" value="180">
            </div>
            <div class="form-group">
                <label>Tipo de Usuário</label>
                <select>
                    <option value="visitante">Visitante</option>
                    <option value="funcionario">Funcionário</option>
                    <option value="aluno">Aluno</option>
                </select>
            </div>
            <div class="form-group" style="display: flex; align-items: flex-end;">
                <button class="btn btn-primary" style="width: 100%;">Calcular</button>
            </div>
        </div>
        <div style="padding: 1rem; background: var(--color-gray-50); border-radius: 0.5rem;">
            <h4 class="text-primary" style="margin-bottom: 0.75rem;">Resultado da Simulação</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                <div>
                    <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 0.25rem;">Tempo</p>
                    <p style="font-size: 1.125rem; font-weight: 600; color: var(--color-primary);">3h 00min</p>
                </div>
                <div>
                    <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 0.25rem;">Frações</p>
                    <p style="font-size: 1.125rem; font-weight: 600; color: var(--color-primary);">3</p>
                </div>
                <div>
                    <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 0.25rem;">Desconto</p>
                    <p style="font-size: 1.125rem; font-weight: 600; color: var(--color-success);">-R$ 3,00 (20%)</p>
                </div>
                <div>
                    <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 0.25rem;">Valor Final</p>
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">R$ 12,00</p>
                </div>
            </div>
        </div>
    `;
}

function renderParametrosOperacionais() {
    const container = document.getElementById('parametrosOperacionais');
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
            <div class="form-group">
                <label>Capacidade Total de Vagas</label>
                <input type="number" value="200">
            </div>
            <div class="form-group">
                <label>Tempo Máximo de Abertura da Cancela (segundos)</label>
                <input type="number" value="10">
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="blockExit" checked>
                    <label for="blockExit" style="margin: 0; cursor: pointer;">Bloquear saída em caso de saldo insuficiente</label>
                </div>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="antiFraud" checked>
                    <label for="antiFraud" style="margin: 0; cursor: pointer;">Ativar política antifraude (veículo não pode reentrar sem sair)</label>
                </div>
            </div>
        </div>
    `;
}

// ===== MODAIS =====
function initModals() {
    // Modal de Abertura Manual
    const modalAbertura = document.getElementById('modalAbertura');
    const btnCancelarAbertura = document.getElementById('btnCancelarAbertura');
    const btnConfirmarAbertura = document.getElementById('btnConfirmarAbertura');
    
    btnCancelarAbertura.addEventListener('click', () => {
        modalAbertura.classList.remove('active');
        document.getElementById('placaVeiculo').value = '';
        document.getElementById('motivoAbertura').value = '';
    });
    
    btnConfirmarAbertura.addEventListener('click', confirmarAberturaManual);
    
    // Modal de Recarga
    const modalRecarga = document.getElementById('modalRecarga');
    const btnCancelarRecarga = document.getElementById('btnCancelarRecarga');
    const btnConfirmarRecarga = document.getElementById('btnConfirmarRecarga');
    
    btnCancelarRecarga.addEventListener('click', () => {
        modalRecarga.classList.remove('active');
        document.getElementById('valorRecarga').value = '';
    });
    
    btnConfirmarRecarga.addEventListener('click', confirmarRecarga);
    
    // Fechar modais ao clicar no X
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Botões de método de pagamento
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.getAttribute('data-method');
        });
    });
    
    // Botão Novo Usuário
    document.getElementById('btnNovoUsuario').addEventListener('click', () => {
        alert('Funcionalidade de cadastro de usuário será implementada');
    });
}

function confirmarAberturaManual() {
    const placa = document.getElementById('placaVeiculo').value;
    const motivo = document.getElementById('motivoAbertura').value;
    
    if (!placa || !motivo) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }
    
    const cancela = DATA.cancelas.find(c => c.id === selectedGateId);
    if (!cancela) return;
    
    // Atualizar status da cancela
    cancela.status = 'aberta';
    cancela.ultimaAtualizacao = new Date();
    
    // Adicionar evento
    const novoEvento = {
        id: `evento-${Date.now()}`,
        cancelaId: selectedGateId,
        tipo: 'abertura_manual',
        timestamp: new Date(),
        veiculoPlaca: placa,
        motivo: motivo
    };
    DATA.eventosCancelas.unshift(novoEvento);
    
    // Adicionar log de auditoria
    const novoLog = {
        id: `log-${Date.now()}`,
        ator: 'Operador Manual',
        acao: 'ABERTURA_MANUAL_CANCELA',
        alvo: cancela.nome,
        timestamp: new Date(),
        detalhes: `${motivo} | Placa: ${placa}`,
        ip: '192.168.1.100'
    };
    DATA.logsAuditoria.unshift(novoLog);
    
    // Fechar modal
    document.getElementById('modalAbertura').classList.remove('active');
    document.getElementById('placaVeiculo').value = '';
    document.getElementById('motivoAbertura').value = '';
    
    // Re-renderizar
    renderCancelas();
    
    // Fechar automaticamente após 5 segundos
    setTimeout(() => {
        cancela.status = 'fechada';
        cancela.ultimaAtualizacao = new Date();
        renderCancelas();
    }, 5000);
}

function confirmarRecarga() {
    const valor = parseFloat(document.getElementById('valorRecarga').value);
    
    if (!valor || valor <= 0) {
        alert('Por favor, insira um valor válido');
        return;
    }
    
    const carteira = DATA.carteiras.find(c => c.id === selectedWalletId);
    if (!carteira) return;
    
    // Atualizar saldo
    carteira.saldo += valor;
    carteira.ultimaRecarga = new Date();
    
    // Adicionar transação
    const novaTransacao = {
        id: `trans-${Date.now()}`,
        carteiraId: selectedWalletId,
        tipo: 'recarga',
        valor: valor,
        data: new Date(),
        metodoPagamento: selectedPaymentMethod,
        descricao: `Recarga via ${selectedPaymentMethod.toUpperCase()}`
    };
    DATA.transacoes.unshift(novaTransacao);
    
    // Adicionar log de auditoria
    const usuario = DATA.usuarios.find(u => u.id === carteira.usuarioId);
    const novoLog = {
        id: `log-${Date.now()}`,
        ator: usuario ? usuario.nome : 'Usuário',
        acao: 'RECARGA_CARTEIRA',
        alvo: `Carteira ${selectedWalletId}`,
        timestamp: new Date(),
        detalhes: `Recarga de ${formatCurrency(valor)} via ${selectedPaymentMethod.toUpperCase()}`,
        ip: '192.168.1.100'
    };
    DATA.logsAuditoria.unshift(novoLog);
    
    // Fechar modal
    document.getElementById('modalRecarga').classList.remove('active');
    document.getElementById('valorRecarga').value = '';
    
    // Re-renderizar
    renderSaldos();
    
    // Mostrar mensagem de sucesso
    alert(`Recarga de ${formatCurrency(valor)} realizada com sucesso!`);
}

// ===== RENDER ALL PAGES =====
function renderAllPages() {
    renderCancelas();
    renderUsuarios();
    renderVeiculos();
    renderSaldos();
    renderEstadias();
    renderRelatorios();
    renderAuditoria();
    renderConfiguracoes();
}
