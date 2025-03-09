console.log("🚀 Script.js carregado e pronto!");

// Captura o formulário de contato
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-contato");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Evita o recarregamento da página

            // Captura os valores do formulário
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const mensagem = document.getElementById("mensagem").value;

            try {
                // Salva os dados no Firestore
                await db.collection("mensagens").add({
                    nome: nome,
                    email: email,
                    mensagem: mensagem,
                    timestamp: new Date()
                });

                console.log("✅ Dados enviados para o Firestore com sucesso!");

                // Exibe mensagem de sucesso
                mensagemSucesso.style.display = "block";
                form.reset();
            } catch (error) {
                console.error("❌ Erro ao conectar com Firestore:", error);
            }
        });
    } else {
        console.error("❌ ERRO: Formulário não encontrado!");
    }
});