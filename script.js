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

    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "SEU_AUTH_DOMAIN",
        projectId: "SEU_PROJECT_ID",
        storageBucket: "SEU_STORAGE_BUCKET",
        messagingSenderId: "SEU_MESSAGING_SENDER_ID",
        appId: "SEU_APP_ID"
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
                reader.onload = function (event) {
                    fotosBase64.push(event.target.result);
                };
            }
        }

        setTimeout(async () => {
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
        }, 1000);
    });

    async function carregarPendencias() {
        const listaParques = document.getElementById("lista-parques");
        listaParques.innerHTML = "";

        try {
            const snapshot = await db.collection("relatorios").get();
            snapshot.forEach(doc => {
                const data = doc.data();
                const pendenciaDiv = document.createElement("div");
                pendenciaDiv.classList.add("pendencia-box");

                let fotosHtml = "";
                if (data.fotos && data.fotos.length > 0) {
                    fotosHtml = `<div class='fotos-container'>` + 
                        data.fotos.map(foto => `<img src='${foto}' class='pendencia-foto' />`).join('') + 
                        `</div>`;
                }

                pendenciaDiv.innerHTML = `
                    <h3>${data.pendencia} - ${data.maquina}</h3>
                    <p><strong>Usuário:</strong> ${data.usuario}</p>
                    <p><strong>Data:</strong> ${data.data}</p>
                    ${fotosHtml}
                `;
                listaParques.appendChild(pendenciaDiv);
            });
        } catch (error) {
            console.error("❌ Erro ao carregar pendências:", error);
        }
    }
    document.addEventListener("DOMContentLoaded", carregarPendencias);
});
