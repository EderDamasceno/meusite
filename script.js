console.log("🚀 Script.js carregado e pronto!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM carregado com sucesso!");

    const form = document.getElementById("form-relatorio");
    const parqueSelect = document.getElementById("parque");
    const maquinaSelect = document.getElementById("maquina");
    const pendenciaSelect = document.getElementById("pendencia");
    const novaPendenciaInput = document.getElementById("nova-pendencia");
    const usuarioInput = document.getElementById("usuario");
    const dataInput = document.getElementById("data");
    const fotosInput = document.getElementById("fotos");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");

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
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        mensagemSucesso.style.display = "none";
        mensagemErro.style.display = "none";

        const usuario = usuarioInput.value;
        const parque = parqueSelect.value;
        const maquina = maquinaSelect.value;
        const pendencia = pendenciaSelect.value || novaPendenciaInput.value;
        const data = dataInput.value;

        if (!usuario || !parque || !maquina || !pendencia || !data) {
            mensagemErro.innerText = "❌ Preencha todos os campos obrigatórios!";
            mensagemErro.style.display = "block";
            return;
        }

        let fotosBase64 = [];
        if (fotosInput.files.length > 0) {
            for (let file of fotosInput.files) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    fotosBase64.push(reader.result);
                };
            }
        }

        try {
            await db.collection("relatorios").add({
                usuario,
                parque,
                maquina,
                pendencia,
                data,
                fotos: fotosBase64,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            mensagemSucesso.innerText = "✅ Relatório salvo com sucesso!";
            mensagemSucesso.style.display = "block";
            form.reset();
        } catch (error) {
            console.error("❌ Erro ao salvar relatório:", error);
            mensagemErro.innerText = "❌ Erro ao salvar relatório! Tente novamente.";
            mensagemErro.style.display = "block";
        }
    });
});
