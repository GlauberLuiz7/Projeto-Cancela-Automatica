from flask import Flask, request, jsonify
from db import get_connection
import hashlib
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Função para criptografar senha
def hash_senha(senha):
    return hashlib.sha256(senha.encode()).hexdigest()


# ------------------------------
# LOGIN
# ------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    senha = hash_senha(data.get("senha"))

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM usuarios WHERE email=%s AND senha=%s", (email, senha))
    user = cursor.fetchone()

    conn.close()

    if not user:
        return jsonify({"sucesso": False, "mensagem": "Credenciais inválidas"})

    return jsonify({
        "sucesso": True,
        "mensagem": "Login realizado",
        "tipo": user["tipo"]
    })


# ------------------------------
# CADASTRO
# ------------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    nome = data.get("nome")
    email = data.get("email")
    senha = hash_senha(data.get("senha"))
    tipo = data.get("tipo")

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (%s, %s, %s, %s)",
            (nome, email, senha, tipo)
        )
        conn.commit()
    except mysql.connector.Error as error:
        return jsonify({"sucesso": False, "mensagem": "Email já cadastrado"})

    conn.close()

    return jsonify({"sucesso": True, "mensagem": "Usuário cadastrado"})


# ------------------------------
# INICIAR SERVIDOR
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True)
