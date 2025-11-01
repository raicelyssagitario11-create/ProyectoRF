// --- SIMULACIÓN DEL BACKEND SUPABASE (BASE DE DATOS Y EDGE FUNCTIONS) ---

// Configuración inicial y variables globales (Simulación de variables de entorno)
const ADMIN_EMAIL = 'admin@reportes.com';
const ADMIN_PASS = 'superadmin123';
const APP_ID = 'financial-report-platform'; // Usado para prefijos de DB simulada
let loggedInUserId = null;

/**
 * Simulación de la base de datos Firestore/Postgres.
 * Todos los datos son almacenados en memoria.
 */
const __DB = {
    clients: [
        { id: 'cli-001', name: 'Innovacion Global S.A.', email: 'contacto@innovacion.com', created_at: Date.now() },
        { id: 'cli-002', name: 'Desarrollos Alfa Ltda.', email: 'alfa@desarrollos.com', created_at: Date.now() },
    ],
    projects: [
        { id: 'proj-001', client_id: 'cli-001', name: 'Implementación ERP Fase 1', budget: 15000.00, status: 'Active', created_at: Date.now() },
        { id: 'proj-002', client_id: 'cli-001', name: 'Optimización Cloud', budget: 5000.00, status: 'Closed', created_at: Date.now() },
        { id: 'proj-003', client_id: 'cli-002', name: 'Diseño Web Corporativo', budget: 8000.00, status: 'Active', created_at: Date.now() },
    ],
    payments: [
        { id: 'pay-001', project_id: 'proj-001', amount: 5000.00, date: '2025-10-01', created_at: Date.now() },
        { id: 'pay-002', project_id: 'proj-001', amount: 5000.00, date: '2025-11-15', created_at: Date.now() },
        { id: 'pay-003', project_id: 'proj-002', amount: 5000.00, date: '2025-09-01', created_at: Date.now() },
        { id: 'pay-004', project_id: 'proj-003', amount: 3000.00, date: '2025-12-01', created_at: Date.now() },
    ],
    access_tokens: [], // { token: UUID, client_id: string, expires_at: timestamp }
    logs: [
        { timestamp: Date.now(), action: 'INIT', details: 'Simulación de base de datos cargada.' }
    ]
};

// --- UTILIDADES ---

/** Genera un UUID para IDs y tokens. */
const generateUUID = () => crypto.randomUUID();

/** Formatea una fecha a DD/MM/YYYY */
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
};

/** Formatea un número a moneda (Euro, sin buscar tipo de cambio real) */
const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(number);
};

/** Muestra mensajes de estado (Simulación de notificación Toast) */
const showMessage = (message, type = 'success') => {
    const box = document.getElementById('message-box');
    box.textContent = message;
    box.classList.remove('bg-green-500', 'bg-red-500');
    box.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500', 'opacity-100');
    box.classList.remove('hidden');

    setTimeout(() => {
        box.classList.add('opacity-0');
        box.addEventListener('transitionend', function handler() {
            box.classList.add('hidden');
            box.removeEventListener('transitionend', handler);
        }, { once: true });
    }, 3000);
};

/** Registra una acción de administrador en los logs (Simulación de Logs de Actividad) */
const logAction = (action, details) => {
    __DB.logs.unshift({
        timestamp: Date.now(),
        action: action,
        details: details,
        user_id: loggedInUserId || 'N/A'
    });
    renderAdminLogs();
};


// --- LÓGICA DE VISTAS Y RUTAS ---

/** Cambia la vista principal del usuario */
const switchView = (viewId) => {
    const views = ['login-view', 'admin-dashboard-view', 'client-dashboard-view', 'error-view'];
    views.forEach(id => {
        const view = document.getElementById(id);
        if (view) view.classList.add('hidden');
    });
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.remove('hidden');

    // Asegurar que el contenido del reporte se renderice si es la vista del cliente
    if (viewId === 'client-dashboard-view') {
        renderClientDashboard();
    }
};

/** Maneja la autenticación del administrador (Simulación de Supabase Auth) */
const handleLogin = () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        // Simulación de inicio de sesión exitoso
        loggedInUserId = 'admin-user-001';
        logAction('LOGIN', 'Administrador inició sesión.');
        renderAdminDashboard();
        switchView('admin-dashboard-view');
    } else {
        showMessage('Credenciales inválidas.', 'error');
        logAction('LOGIN_FAIL', 'Intento fallido de inicio de sesión.');
    }
};

/** Cierra la sesión del administrador */
const logoutAdmin = () => {
    loggedInUserId = null;
    logAction('LOGOUT', 'Administrador cerró sesión.');
    // Limpiar URL si contiene token (aunque es improbable en vista admin)
    history.pushState({}, '', '.');
    switchView('login-view');
};

// --- SIMULACIÓN DE EDGE FUNCTION: generate-client-link ---

/** Genera un token temporal y un link de acceso para el cliente */
const generateClientLink = (clientId, clientName) => {
    // El token es válido por 24 horas (24 * 60 * 60 * 1000 ms)
    const EXPIRATION_DURATION_MS = 24 * 60 * 60 * 1000;
    const token = generateUUID();
    const expiresAt = Date.now() + EXPIRATION_DURATION_MS;
    const expirationDate = new Date(expiresAt);

    const tokenRecord = {
        token: token,
        client_id: clientId,
        expires_at: expiresAt
    };

    __DB.access_tokens.push(tokenRecord);
    logAction('LINK_GEN', `Link temporal generado para cliente ${clientName}. Expira en ${expirationDate.toLocaleTimeString('es-ES')}.`);

    // Generar el link (usa la URL actual)
    const currentUrl = window.location.href.split('?')[0];
    return `${currentUrl}?token=${token}`;
};

// --- SIMULACIÓN DE EDGE FUNCTION: get-client-data ---

/**
 * Función pública que valida el token y recupera todos los datos del cliente.
 * @param {string} token - El token de acceso temporal de la URL.
 * @returns {Object|null} - Los datos del cliente, o null si es inválido/expirado.
 */
const getClientDataByToken = (token) => {
    const tokenRecord = __DB.access_tokens.find(t => t.token === token);

    if (!tokenRecord) {
        console.error('Token no encontrado.');
        return null; // Token no existe
    }

    if (tokenRecord.expires_at < Date.now()) {
        console.error('Token expirado.');
        return null; // Token expirado
    }

    const client = __DB.clients.find(c => c.id === tokenRecord.client_id);
    if (!client) return null; // Cliente no encontrado

    const clientProjects = __DB.projects.filter(p => p.client_id === client.id);

    const projectsWithData = clientProjects.map(project => {
        const projectPayments = __DB.payments.filter(pay => pay.project_id === project.id);
        const totalPaid = projectPayments.reduce((sum, pay) => sum + pay.amount, 0);
        const pending = project.budget - totalPaid;

        return {
            ...project,
            payments: projectPayments,
            totalPaid: totalPaid,
            pending: pending,
            status: pending > 0.01 ? 'Activo' : 'Cerrado'
        };
    });

    return {
        client: client,
        projects: projectsWithData,
    };
};

// --- LÓGICA CRUD PARA ADMIN (SIMULACIÓN DE RLS Y ADMIN CRUD FUNCTIONS) ---

/** Maneja la creación de Clientes (Supabase o local) */
const handleClientCRUD = async (action) => {
    if (action === 'create') {
        const name = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        if (window.AppSupabase && AppSupabase.initialized && typeof AppSupabase.createClient === 'function') {
            try {
                await AppSupabase.createClient(name, email);
                logAction('CREATE', `Cliente creado en Supabase: ${name}`);
                document.getElementById('client-form').reset();
                renderAdminDashboard();
                showMessage('Cliente creado exitosamente (Supabase).');
                return;
            } catch (e) {
                showMessage('Error al crear cliente en Supabase.', 'error');
                return;
            }
        }
        // Fallback local
        const newId = `cli-${(__DB.clients.length + 1).toString().padStart(3, '0')}`;
        __DB.clients.push({ id: newId, name, email, created_at: Date.now() });
        logAction('CREATE', `Cliente creado: ${name} (${newId})`);
        document.getElementById('client-form').reset();
        renderAdminDashboard();
        showMessage('Cliente creado exitosamente (local).');
    }
};

/** Maneja la creación de Proyectos (Supabase o local) */
const handleProjectCRUD = async (action) => {
    if (action === 'create') {
        const clientId = document.getElementById('project-client-id').value;
        const name = document.getElementById('project-name').value;
        const budget = parseFloat(document.getElementById('project-budget').value);
        if (!clientId || !name || isNaN(budget) || budget <= 0) {
            return showMessage('Datos de proyecto incompletos.', 'error');
        }
        if (window.AppSupabase && AppSupabase.initialized && typeof AppSupabase.createProject === 'function') {
            try {
                await AppSupabase.createProject(clientId, name, budget);
                logAction('CREATE', `Proyecto creado en Supabase: ${name}`);
                document.getElementById('project-form').reset();
                renderAdminDashboard();
                showMessage('Proyecto creado y asignado (Supabase).');
                return;
            } catch (e) {
                showMessage('Error al crear proyecto en Supabase.', 'error');
                return;
            }
        }
        // Fallback local
        const newId = `proj-${(__DB.projects.length + 1).toString().padStart(3, '0')}`;
        __DB.projects.push({
            id: newId,
            client_id: clientId,
            name: name,
            budget: budget,
            status: 'Active',
            created_at: Date.now()
        });
        logAction('CREATE', `Proyecto "${name}" creado para ${__DB.clients.find(c => c.id === clientId)?.name}.`);
        document.getElementById('project-form').reset();
        renderAdminDashboard();
        showMessage('Proyecto creado y asignado (local).');
    }
};

/** Maneja el registro de Pagos (Supabase o local) */
const handlePaymentCRUD = async (action) => {
    if (action === 'create') {
        const projectId = document.getElementById('payment-project-id').value;
        const amount = parseFloat(document.getElementById('payment-amount').value);
        const date = document.getElementById('payment-date').value;
        if (!projectId || isNaN(amount) || amount <= 0 || !date) {
            return showMessage('Datos de pago incompletos.', 'error');
        }
        if (window.AppSupabase && AppSupabase.initialized && typeof AppSupabase.createPayment === 'function') {
            try {
                await AppSupabase.createPayment(projectId, amount, date);
                logAction('CREATE', `Pago registrado en Supabase para proyecto ${projectId}`);
                document.getElementById('payment-form').reset();
                renderAdminDashboard();
                showMessage('Pago registrado exitosamente (Supabase).');
                return;
            } catch (e) {
                showMessage('Error al registrar pago en Supabase.', 'error');
                return;
            }
        }
        // Fallback local
        const newId = `pay-${(__DB.payments.length + 1).toString().padStart(3, '0')}`;
        __DB.payments.push({
            id: newId,
            project_id: projectId,
            amount: amount,
            date: date,
            created_at: Date.now()
        });
        logAction('CREATE', `Pago de ${formatCurrency(amount)} registrado para proyecto ${projectId}.`);
        document.getElementById('payment-form').reset();
        renderAdminDashboard();
        showMessage('Pago registrado exitosamente (local).');
    }
};

// --- RENDERIZADO DE VISTAS ---

/** Renderiza la lista de Clientes y los controles de Link en Admin Panel */
const renderAdminClients = () => {
    const listContainer = document.getElementById('clients-list');
    listContainer.innerHTML = '';
    __DB.clients.forEach(client => {
        const totalBudget = __DB.projects.filter(p => p.client_id === client.id).reduce((sum, p) => sum + p.budget, 0);

        const clientDiv = document.createElement('div');
        clientDiv.className = 'flex flex-col sm:flex-row justify-between items-center p-3 border-b last:border-b-0 bg-white rounded-lg shadow-sm';
        clientDiv.innerHTML = `
            <div class="mb-2 sm:mb-0">
                <p class="font-semibold text-gray-800">${client.name}</p>
                <p class="text-sm text-gray-500">${client.email} | Presupuesto Total: ${formatCurrency(totalBudget)}</p>
            </div>
            <button onclick="copyClientLink('${client.id}', '${client.name}')" class="px-3 py-1 bg-sky-500 text-white text-sm rounded-md hover:bg-sky-600 transition min-w-[120px]">
                Generar Link
            </button>
        `;
        listContainer.appendChild(clientDiv);
    });
};

/** Copia el link generado al portapapeles */
const copyClientLink = (clientId, clientName) => {
    const link = generateClientLink(clientId, clientName);
    // Uso de execCommand para mayor compatibilidad en entornos iframe
    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showMessage('Link copiado al portapapeles. ¡Válido por 24h!', 'success');
};

/** Renderiza los selects de Proyectos y Clientes en Admin Panel */
const renderAdminSelects = () => {
    const clientSelect = document.getElementById('project-client-id');
    const projectSelect = document.getElementById('payment-project-id');

    // Limpiar y resetear
    clientSelect.innerHTML = '<option value="" disabled selected>Seleccione Cliente</option>';
    projectSelect.innerHTML = '<option value="" disabled selected>Seleccione Proyecto Activo</option>';

    __DB.clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });

    // Solo proyectos que tienen presupuesto pendiente (Simulación de estado 'Activo')
    const projectsStatus = __DB.projects.map(p => {
        const totalPaid = __DB.payments.filter(pay => pay.project_id === p.id).reduce((sum, pay) => sum + pay.amount, 0);
        return { ...p, pending: p.budget - totalPaid };
    }).filter(p => p.pending > 0.01);

    projectsStatus.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = `${project.name} (${__DB.clients.find(c => c.id === project.client_id)?.name})`;
        projectSelect.appendChild(option);
    });

    // Establecer fecha actual por defecto para pagos
    document.getElementById('payment-date').valueAsDate = new Date();
};

/** Renderiza los Logs de Actividad */
const renderAdminLogs = () => {
    const logsContainer = document.getElementById('logs-list');
    logsContainer.innerHTML = '';

    __DB.logs.slice(0, 15).forEach(log => {
        const date = new Date(log.timestamp).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        const color = log.action.includes('FAIL') ? 'text-red-600' : 'text-gray-700';
        logsContainer.innerHTML += `<p class="truncate py-1 ${color}"><span class="font-mono text-xs text-gray-500 mr-2">[${date}]</span> ${log.action}: ${log.details}</p>`;
    });
};

/** Función principal para renderizar el Admin Dashboard */
const renderAdminDashboard = () => {
    renderAdminClients();
    renderAdminSelects();
    renderAdminLogs();
};

/** Función principal para renderizar el Dashboard de Cliente */
const renderClientDashboard = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const clientData = getClientDataByToken(token);
    const contentDiv = document.getElementById('client-report-content');
    contentDiv.innerHTML = ''; // Limpiar contenido previo

    if (!clientData) {
        // Si el token es inválido o expirado, la ruta inicial ya lo detectó
        return;
    }

    const client = clientData.client;
    const projects = clientData.projects;

    // Totales
    const grandTotalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const grandTotalPaid = projects.reduce((sum, p) => sum + p.totalPaid, 0);
    const grandTotalPending = projects.reduce((sum, p) => sum + p.pending, 0);

    // Estructura principal del reporte
    let html = `
        <header class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-blue-800">Reporte Financiero del Cliente</h1>
            <p class="text-xl font-semibold text-gray-700 mt-2">${client.name}</p>
            <p class="text-sm text-gray-500">Generado el ${formatDate(new Date())} (Link Válido)</p>
        </header>

        <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4 border-b pb-2 text-gray-700">Resumen Financiero</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div class="p-4 rounded-lg bg-blue-50 text-blue-800 shadow-md">
                    <p class="text-sm font-medium">Presupuesto Total</p>
                    <p class="text-2xl font-bold">${formatCurrency(grandTotalBudget)}</p>
                </div>
                <div class="p-4 rounded-lg bg-green-50 text-green-800 shadow-md">
                    <p class="text-sm font-medium">Total Pagado</p>
                    <p class="text-2xl font-bold">${formatCurrency(grandTotalPaid)}</p>
                </div>
                <div class="p-4 rounded-lg ${grandTotalPending > 0.01 ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-600'} shadow-md">
                    <p class="text-sm font-medium">Pendiente</p>
                    <p class="text-2xl font-bold">${formatCurrency(grandTotalPending)}</p>
                </div>
            </div>
        </section>

        <section class="mb-8 page-break-after">
            <h2 class="text-2xl font-bold mb-4 border-b pb-2 text-gray-700">Proyectos Asignados</h2>
            ${projects.length > 0 ? `
                <div class="space-y-6">
                    ${projects.map(p => `
                        <div class="p-4 border border-gray-200 rounded-lg shadow-sm">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-xl font-semibold text-gray-800">${p.name}</h3>
                                <span class="px-3 py-1 text-xs font-medium rounded-full ${p.status === 'Activo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                                    ${p.status}
                                </span>
                            </div>
                            <div class="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                                <p>Presupuesto: <span class="font-medium">${formatCurrency(p.budget)}</span></p>
                                <p>Pagado: <span class="font-medium text-green-700">${formatCurrency(p.totalPaid)}</span></p>
                                <p>Pendiente: <span class="font-medium text-red-700">${formatCurrency(p.pending)}</span></p>
                                <p>Creado: <span class="font-medium">${formatDate(p.created_at)}</span></p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="text-gray-500">No hay proyectos activos registrados.</p>'}
        </section>

        <section>
            <h2 class="text-2xl font-bold mb-4 border-b pb-2 text-gray-700">Historial de Pagos Detallado</h2>
            ${projects.filter(p => p.payments.length > 0).length > 0 ? `
                <table class="min-w-full divide-y divide-gray-200 mt-4">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Proyecto</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Pagado</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${projects.map(p => p.payments.map(pay => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${p.name}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">${formatCurrency(pay.amount)}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(pay.date)}</td>
                            </tr>
                        `).join('')).join('')}
                    </tbody>
                </table>
            ` : '<p class="text-gray-500">No hay pagos registrados para ningún proyecto.</p>'}
        </section>

        <footer class="mt-10 pt-4 border-t text-sm text-gray-500 text-center">
            Este reporte es solo para fines de visualización del cliente. No se permiten ediciones.
        </footer>
    `;

    contentDiv.innerHTML = html;
};

// --- INICIALIZACIÓN DE LA APLICACIÓN ---

/** Determina la vista a cargar al iniciar */
const initializeApp = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Lógica de acceso de cliente (Simulación de Edge Function)
        const clientData = getClientDataByToken(token);
        if (clientData) {
            // Token válido: Mostrar Dashboard de Cliente
            switchView('client-dashboard-view');
            document.title = `Reporte de ${clientData.client.name}`;
        } else {
            // Token inválido o expirado: Mostrar Error
            switchView('error-view');
        }
    } else {
        // Sin token: Mostrar vista de Login (Admin)
        switchView('login-view');
    }
};

// Iniciar la aplicación al cargar el script
initializeApp();
