function showScreen(screen) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("register").classList.add("hidden");
    document.getElementById("recover").classList.add("hidden");
    document.getElementById(screen).classList.remove("hidden");
}

function doLogin() {
    window.location.href = "../home-admin/index.html";
    showScreen("login");
}

function doCreate() {
    alert("Cadastro efetuado (simulado)");
    showScreen("login");
}

function doRecover() {
    alert("Email de recuperação enviado (simulado)");
    showScreen("login");
}
