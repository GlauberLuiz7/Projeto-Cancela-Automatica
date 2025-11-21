const API_URL = "http://localhost:5000";

function showScreen(screen) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("register").classList.add("hidden");
    document.getElementById("recover").classList.add("hidden");
    document.getElementById(screen).classList.remove("hidden");
}

// --------------------------------------
// LOGIN
// --------------------------------------
async function doLogin() {
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!data.sucesso) {
        alert("❌ " + data.mensagem);
        return;
    }

    alert("✔ Login realizado!");

    // Redireciona conforme o tipo de conta
    if (data.tipo === "admin") {
        window.location.href = "../home-admin/index.html";
    } else {
        window.location.href = "../home-cliente/index.html"; // crie esta pasta depois
    }
}

// --------------------------------------
// CADASTRO
// --------------------------------------
async function doCreate() {
    const nome = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const senha = document.getElementById("regPassword").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            email,
            senha,
            tipo: "cliente" // padrão
        })
    });

    const data = await response.json();

    if (!data.sucesso) {
        alert("❌ " + data.mensagem);
        return;
    }

    alert("✔ Cadastro realizado!");
    showScreen("login");
}

// --------------------------------------
// RECUPERAR SENHA (simples)
// --------------------------------------
async function doRecover() {
    const email = document.getElementById("recEmail").value;

    // opcional: criar endpoint no backend
    alert("📧 Um email seria enviado para: " + email);
    showScreen("login");
}