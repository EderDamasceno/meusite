console.log("🚀 Script.js carregado e pronto!");

// Captura o formulário de contato
document.addEventListener("DOMContentLoaded", function () {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCe_AbmxlZYUDAaatxQ3FH5h6ZeiAK1Qq4",
        authDomain: "meusite-132ec.firebaseapp.com",
        projectId: "meusite-132ec",
        storageBucket: "meusite-132ec.appspot.com",
        messagingSenderId: "558888153171",
        appId: "1:558888153171:web:5845f24da583581aa556a6",
        measurementId: "G-4WW93D6ZD6"
    };

    // Inicializa Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

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

                // Redireciona para a página "Obrigado" após 2 segundos
                setTimeout(() => {
                    window.location.href = "obrigado.html";
                }, 2000);
            } catch (error) {
                console.error("❌ Erro ao conectar com Firestore:", error);
            }
        });
    } else {
        console.error("❌ ERRO: Formulário não encontrado!");
    }

    // Teste automático de Firestore ao carregar a página
    async function testarFirestore() {
        console.log("🔍 Testando conexão com Firestore...");

        try {
            await db.collection("mensagens").add({
                nome: "Teste Firestore",
                email: "teste@email.com",
                mensagem: "Se essa mensagem aparecer no Firestore, está funcionando!",
                timestamp: new Date()
            });

            console.log("✅ Dados enviados para o Firestore com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao conectar com Firestore:", error);
        }
    }

    // Teste automático ao carregar o site
    testarFirestore();
});
