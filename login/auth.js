// Verifica se está logado
const user = JSON.parse(localStorage.getItem("loggedUser"));

if (!user) {
    window.location.href = "/login/login.html"; // redireciona caso não esteja logado
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "/login/login.html";
}