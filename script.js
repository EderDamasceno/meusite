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

    const maquinasPorParque = {
        "VPB III": ["VPB III-01", "VPB III-02", "VPB III-03", "VPB III-04", "VPB III-05", "VPB III-06", "VPB III-07", "VPB III-08", "VPB III-09"],
        "VPB IV": ["VPB IV-01", "VPB IV-02", "VPB IV-03", "VPB IV-04", "VPB IV-05", "VPB IV-06", "VPB IV-07", "VPB IV-08", "VPB IV-09"],
        "VMA I": ["VMA I-01", "VMA I-02", "VMA I-03", "VMA I-04", "VMA I-05", "VMA I-06", "VMA I-07", "VMA I-08", "VMA I-09"],
        "VMA II": ["VMA II-01", "VMA II-02", "VMA II-03", "VMA II-04", "VMA II-05", "VMA II-06", "VMA II-07", "VMA II-08", "VMA II-09"]
    };

    if (parqueSelect) {
        parqueSelect.addEventListener("change", function () {
            console.log("🌍 Parque selecionado:", parqueSelect.value);
            maquinaSelect.innerHTML = '<option value="">Escolha uma máquina...</option>';

            if (maquinasPorParque[parqueSelect.value]) {
                maquinasPorParque[parqueSelect.value].forEach(maquina => {
                    const option = document.createElement("option");
                    option.value = maquina;
                    option.textContent = maquina;
                    maquinaSelect.appendChild(option);
                });
                console.log("⚙️ Máquinas carregadas para", parqueSelect.value);
            }
        });
    }

    function obterFotosBase64(arquivos) {
        return new Promise(resolve => {
            let fotosBase64 = [];
            let contador = 0;
            if (arquivos.length === 0) resolve([]);

            for (let file of arquivos) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (event) {
                    fotosBase64.push(event.target.result);
                    contador++;
                    if (contador === arquivos.length) resolve(fotosBase64);
                };
            }
        });
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
            let pendenciasSelecionadas = [];
            document.querySelectorAll("#pendencias-container input").forEach(input => {
                pendenciasSelecionadas.push(input.value);
            });

            if (!usuario || !parque || !maquina || !criticidade || !data || pendenciasSelecionadas.length === 0) {
                mensagemErro.innerText = "❌ Preencha todos os campos obrigatórios!";
                mensagemErro.style.display = "block";
                return;
            }

            const fotosBase64 = await obterFotosBase64(fotosInput.files);

            try {
                await db.collection("relatorios").add({
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
        });
    }
});
