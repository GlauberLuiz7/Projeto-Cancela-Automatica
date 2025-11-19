// ===== DADOS MOCKADOS DO SISTEMA =====

const DATA = {
    // Usuários
    usuarios: [
        {
            id: '1',
            nome: 'João Silva',
            email: 'joao.silva@empresa.com',
            tipo: 'funcionario',
            status: 'ativo',
            cpf: '123.456.789-00',
            telefone: '(11) 98765-4321',
            dataCadastro: new Date('2024-01-15')
        },
        {
            id: '2',
            nome: 'Maria Santos',
            email: 'maria.santos@universidade.edu',
            tipo: 'aluno',
            status: 'ativo',
            cpf: '987.654.321-00',
            telefone: '(11) 91234-5678',
            dataCadastro: new Date('2024-02-20')
        },
        {
            id: '3',
            nome: 'Carlos Operador',
            email: 'carlos@estacionamento.com',
            tipo: 'operador',
            status: 'ativo',
            cpf: '456.789.123-00',
            telefone: '(11) 99999-8888',
            dataCadastro: new Date('2023-12-01')
        }
    ],

    // Veículos
    veiculos: [
        { id: '1', placa: 'ABC-1234', usuarioId: '1', modelo: 'Honda Civic', cor: 'Prata', ativo: 'ativo', rfid: 'RFID001' },
        { id: '2', placa: 'XYZ-5678', usuarioId: '1', modelo: 'Toyota Corolla', cor: 'Preto', ativo: 'ativo' },
        { id: '3', placa: 'DEF-9012', usuarioId: '2', modelo: 'Volkswagen Gol', cor: 'Branco', ativo: 'ativo', rfid: 'RFID002' }
    ],

    // Carteiras
    carteiras: [
        { id: '1', usuarioId: '1', saldo: 150.50, limiteNegativo: 50, ultimaRecarga: new Date('2025-11-15') },
        { id: '2', usuarioId: '2', saldo: 45.00, limiteNegativo: 20, ultimaRecarga: new Date('2025-11-10') }
    ],

    // Transações
    transacoes: [
        {
            id: '1',
            carteiraId: '1',
            tipo: 'recarga',
            valor: 100.00,
            data: new Date('2025-11-15T10:30:00'),
            metodoPagamento: 'pix',
            descricao: 'Recarga via PIX'
        },
        {
            id: '2',
            carteiraId: '1',
            tipo: 'cobranca',
            valor: -15.50,
            data: new Date('2025-11-16T14:45:00'),
            descricao: 'Estadia - 3h15min',
            referencia: 'EST-001'
        },
        {
            id: '3',
            carteiraId: '2',
            tipo: 'recarga',
            valor: 50.00,
            data: new Date('2025-11-10T09:00:00'),
            metodoPagamento: 'cartao',
            descricao: 'Recarga via Cartão'
        },
        {
            id: '4',
            carteiraId: '2',
            tipo: 'cobranca',
            valor: -5.00,
            data: new Date('2025-11-18T11:20:00'),
            descricao: 'Estadia - 1h',
            referencia: 'EST-002'
        }
    ],

    // Estadias
    estadias: [
        {
            id: '1',
            veiculoId: '1',
            placa: 'ABC-1234',
            entrada: new Date('2025-11-19T08:00:00'),
            status: 'em_andamento',
            valorTotal: 0,
            desconto: 0,
            valorFinal: 0,
            metodoIdentificacao: 'rfid',
            usuarioId: '1'
        },
        {
            id: '2',
            veiculoId: '3',
            placa: 'DEF-9012',
            entrada: new Date('2025-11-19T09:30:00'),
            status: 'em_andamento',
            valorTotal: 0,
            desconto: 0,
            valorFinal: 0,
            metodoIdentificacao: 'rfid',
            usuarioId: '2'
        },
        {
            id: '3',
            ticketId: 'TICKET-001',
            placa: 'GHI-3456',
            entrada: new Date('2025-11-19T07:00:00'),
            saida: new Date('2025-11-19T11:30:00'),
            status: 'finalizada',
            valorTotal: 22.50,
            desconto: 0,
            valorFinal: 22.50,
            metodoIdentificacao: 'ticket'
        }
    ],

    // Tarifas
    tarifas: [
        {
            id: '1',
            nome: 'Tarifa Padrão',
            valorFracao: 5.00,
            tempoFracao: 60, // 1 hora
            tolerancia: 15, // 15 minutos
            tetoDiario: 50.00,
            valorPernoite: 30.00,
            ativo: true
        }
    ],

    // Descontos
    descontos: [
        {
            id: '1',
            nome: 'Desconto Funcionário',
            tipo: 'percentual',
            valor: 20,
            publicoAlvo: ['funcionario'],
            vigenciaInicio: new Date('2025-01-01'),
            ativo: true
        },
        {
            id: '2',
            nome: 'Desconto Estudante',
            tipo: 'percentual',
            valor: 30,
            publicoAlvo: ['aluno'],
            vigenciaInicio: new Date('2025-01-01'),
            ativo: true
        }
    ],

    // Cancelas
    cancelas: [
        {
            id: '1',
            nome: 'Cancela Entrada Principal',
            tipo: 'entrada',
            zona: 'A',
            status: 'fechada',
            ultimaAtualizacao: new Date('2025-11-19T10:00:00')
        },
        {
            id: '2',
            nome: 'Cancela Saída Principal',
            tipo: 'saida',
            zona: 'A',
            status: 'fechada',
            ultimaAtualizacao: new Date('2025-11-19T10:05:00')
        },
        {
            id: '3',
            nome: 'Cancela Entrada Secundária',
            tipo: 'entrada',
            zona: 'B',
            status: 'fechada',
            ultimaAtualizacao: new Date('2025-11-19T09:50:00')
        }
    ],

    // Eventos de Cancelas
    eventosCancelas: [
        {
            id: '1',
            cancelaId: '1',
            tipo: 'abertura_automatica',
            timestamp: new Date('2025-11-19T08:00:00'),
            veiculoPlaca: 'ABC-1234',
            stadiaId: '1'
        },
        {
            id: '2',
            cancelaId: '1',
            tipo: 'abertura_automatica',
            timestamp: new Date('2025-11-19T09:30:00'),
            veiculoPlaca: 'DEF-9012',
            stadiaId: '2'
        },
        {
            id: '3',
            cancelaId: '1',
            tipo: 'abertura_manual',
            timestamp: new Date('2025-11-19T07:00:00'),
            operadorId: '3',
            motivo: 'Visitante - Emissão de ticket',
            veiculoPlaca: 'GHI-3456',
            stadiaId: '3'
        }
    ],

    // Logs de Auditoria
    logsAuditoria: [
        {
            id: '1',
            ator: 'Carlos Operador',
            acao: 'ABERTURA_MANUAL_CANCELA',
            alvo: 'Cancela Entrada Principal',
            timestamp: new Date('2025-11-19T07:00:00'),
            detalhes: 'Motivo: Visitante - Emissão de ticket | Placa: GHI-3456',
            ip: '192.168.1.100'
        },
        {
            id: '2',
            ator: 'Sistema',
            acao: 'COBRANCA_AUTOMATICA',
            alvo: 'Usuário: João Silva',
            timestamp: new Date('2025-11-16T14:45:00'),
            detalhes: 'Valor: R$ 15,50 | Estadia: 3h15min',
            ip: 'SYSTEM'
        }
    ],

    // Estatísticas do Dashboard
    dashboardStats: {
        veiculosNoEstacionamento: 2,
        receitaDia: 67.50,
        ocupacaoPercentual: 15.5,
        estadiasHoje: 8,
        cancelasOperacionais: 3,
        cancelasTotal: 3,
        saldoMedioUsuarios: 97.75,
        alertasAtivos: 0
    },

    // Dados para gráfico de receita semanal
    receitaSemanal: [45.50, 67.80, 52.30, 78.90, 65.20, 82.40, 67.50]
};

// Função auxiliar para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função auxiliar para formatar data e hora
function formatDateTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Função auxiliar para formatar data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Função auxiliar para formatar hora
function formatTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Função para calcular tempo decorrido
function getTimeSince(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

// Função para obter nome do usuário por ID
function getNomeUsuario(userId) {
    const usuario = DATA.usuarios.find(u => u.id === userId);
    return usuario ? usuario.nome : 'Usuário não encontrado';
}

// Função para obter carteira por ID do usuário
function getCarteiraByUsuario(usuarioId) {
    return DATA.carteiras.find(c => c.usuarioId === usuarioId);
}

// Função para obter transações por carteira
function getTransacoesByCarteira(carteiraId) {
    return DATA.transacoes
        .filter(t => t.carteiraId === carteiraId)
        .sort((a, b) => b.data.getTime() - a.data.getTime());
}
