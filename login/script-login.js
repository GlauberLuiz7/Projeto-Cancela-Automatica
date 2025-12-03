// Alternar telas
function showScreen(screenId) {
    document.querySelectorAll('.container-box').forEach(box => box.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

/* --------------------------
   CADASTRO
---------------------------*/
function doCreate() {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!name || !email || !password) {
        alert("Preencha todos os campos!");
        return;
    }

    // Pega lista existente
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    // Verifica se email já existe
    if (users.some(u => u.email === email)) {
        alert("Este email já está cadastrado!");
        return;
    }

    // Adiciona novo usuário
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Cadastro realizado com sucesso!");

    showScreen("login");
}

/* --------------------------
   LOGIN
---------------------------*/
function doLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Email ou senha incorretos!");
        return;
    }

    // Salva usuário logado
    localStorage.setItem("loggedUser", JSON.stringify(user));

    // Redireciona para página inicial
    window.location.href = "/home-admin/index.html";
}

/* --------------------------
   RECUPERAR SENHA (BÁSICO)
---------------------------*/
function doRecover() {
    const email = document.getElementById("recEmail").value.trim();
    let users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(u => u.email === email);

    if (!user) {
        alert("Email não encontrado!");
        return;
    }

    alert("Opa! Como isso é só front-end, exibirei a senha aqui:\n\nSua senha é: " + user.password);
}
