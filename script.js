console.log("🚀 Script.js carregado e pronto!");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-contato");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const botaoEnviar = document.querySelector("#form-contato button");

    if (!form) {
        console.error("❌ ERRO: Formulário não encontrado!");
        return;
    }

    if (!botaoEnviar) {
        console.error("❌ ERRO: Botão de envio não encontrado!");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        // Captura os valores do formulário
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const mensagem = document.getElementById("mensagem").value;

        console.log("🔄 Enviando dados...");

        // Desativa o botão e muda o texto para indicar carregamento
        botaoEnviar.disabled = true;
        botaoEnviar.innerHTML = "Enviando... ⏳";

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
            mensagemSucesso.innerText = "✅ Mensagem enviada com sucesso!";
            mensagemSucesso.style.color = "green";

            // Reseta o formulário
            form.reset();

            // Aguarda 2 segundos e redireciona para a página "Obrigado"
            setTimeout(() => {
                mensagemSucesso.style.display = "none";
                botaoEnviar.disabled = false;
                botaoEnviar.innerHTML = "Enviar";
                window.location.href = "obrigado.html";
            }, 2000);
        } catch (error) {
            console.error("❌ Erro ao conectar com Firestore:", error);

            // Exibe mensagem de erro
            mensagemSucesso.style.display = "block";
            mensagemSucesso.innerText = "❌ Erro ao enviar a mensagem. Tente novamente.";
            mensagemSucesso.style.color = "red";

            // Reativa o botão de envio
            botaoEnviar.disabled = false;
            botaoEnviar.innerHTML = "Enviar";
        }
    });
});