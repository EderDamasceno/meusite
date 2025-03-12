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
});
