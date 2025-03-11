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
    const criticidadeSelect = document.getElementById("criticidade");
    const fotosInput = document.getElementById("fotos");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");
    const listaParques = document.getElementById("lista-parques");

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

    function gerarCodigoPendencia() {
        return "P" + Math.floor(100 + Math.random() * 900); // Gera PXXX
    }

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            mensagemSucesso.style.display = "none";
            mensagemErro.style.display = "none";
    
            const usuario = usuarioInput.value;
            const parque = parqueSelect.value;
            const maquina = maquinaSelect.value;
            const pendencia = pendenciaSelect.value || novaPendenciaInput.value;
            const criticidade = criticidadeSelect.value;
            const data = dataInput.value;
            const codigoPendencia = gerarCodigoPendencia();
    
            if (!usuario || !parque || !maquina || !pendencia || !criticidade || !data) {
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
                        codigoPendencia,
                        usuario,
                        parque,
                        maquina,
                        pendencia,
                        criticidade,
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
    }

    if (listaParques) {
        console.log("📌 Carregando pendências...");
        async function carregarPendencias() {
            listaParques.innerHTML = "";
    
            try {
                const snapshot = await db.collection("relatorios").orderBy("timestamp", "desc").get();
                if (snapshot.empty) {
                    console.log("⚠️ Nenhuma pendência encontrada.");
                    listaParques.innerHTML = "<p>Nenhuma pendência encontrada.</p>";
                    return;
                }
    
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
                        <h3>Código: ${data.codigoPendencia}</h3>
                        <p><strong>Pendência:</strong> ${data.pendencia}</p>
                        <p><strong>Máquina:</strong> ${data.maquina}</p>
                        <p><strong>Usuário:</strong> ${data.usuario}</p>
                        <p><strong>Data:</strong> ${data.data}</p>
                        <p><strong>Criticidade:</strong> <span class='criticidade ${data.criticidade.toLowerCase()}'>${data.criticidade}</span></p>
                        ${fotosHtml}
                    `;
                    listaParques.appendChild(pendenciaDiv);
                });
            } catch (error) {
                console.error("❌ Erro ao carregar pendências:", error);
            }
        }
        carregarPendencias();
    }
});
