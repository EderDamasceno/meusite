console.log("🚀 Script.js carregado e pronto!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM carregado com sucesso!");

    const form = document.getElementById("form-relatorio");
    const parqueSelect = document.getElementById("parque");
    const maquinaSelect = document.getElementById("maquina");
    const pendenciasContainer = document.getElementById("pendencias-container");
    const pendenciaDatalist = document.getElementById("pendencias-existentes");
    const adicionarPendenciaBtn = document.getElementById("adicionar-pendencia");
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

    function adicionarPendencia() {
        const pendenciaItem = document.createElement("div");
        pendenciaItem.classList.add("pendencia-item");
        pendenciaItem.innerHTML = `
            <input list="pendencias-existentes" placeholder="Escolha ou crie uma pendência" required>
            <button type="button" class="remover-pendencia">Remover</button>
        `;
        pendenciasContainer.appendChild(pendenciaItem);

        pendenciaItem.querySelector(".remover-pendencia").addEventListener("click", function () {
            pendenciaItem.remove();
        });
    }

    adicionarPendenciaBtn.addEventListener("click", adicionarPendencia);

    async function carregarPendenciasExistentes() {
        try {
            const snapshot = await db.collection("relatorios").get();
            snapshot.forEach(doc => {
                const pendencia = doc.data().pendencia;
                const option = document.createElement("option");
                option.value = pendencia;
                pendenciaDatalist.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar pendências existentes:", error);
        }
    }

    if (pendenciaDatalist) {
        carregarPendenciasExistentes();
    }

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            mensagemSucesso.style.display = "none";
            mensagemErro.style.display = "none";
    
            const usuario = usuarioInput.value;
            const parque = parqueSelect.value;
            const maquina = maquinaSelect.value;
            const criticidade = criticidadeSelect.value;
            const data = dataInput.value;
            const codigoPendencia = gerarCodigoPendencia();
    
            if (!usuario || !parque || !maquina || !criticidade || !data) {
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

            let pendenciasSelecionadas = [];
            document.querySelectorAll("#pendencias-container input").forEach(input => {
                pendenciasSelecionadas.push(input.value);
            });
    
            setTimeout(async () => {
                try {
                    await db.collection("relatorios").add({
                        codigoPendencia,
                        usuario,
                        parque,
                        maquina,
                        pendencias: pendenciasSelecionadas,
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
});
