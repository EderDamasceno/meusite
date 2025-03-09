
console.log("🚀 Script.js carregado e pronto!");

document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("form-relatorio");
    const parqueSelect = document.getElementById("parque");
    const maquinaSelect = document.getElementById("maquina");
    const pendenciaSelect = document.getElementById("pendencia");
    const novaPendenciaInput = document.getElementById("nova-pendencia");
    const usuarioInput = document.getElementById("usuario");
    const dataInput = document.getElementById("data");
    const fotosInput = 

document.getElementById("fotos");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");

    // Estrutura de máquinas por parque
    const maquinasPorParque = {
        "VPB III": ["VPB III-01", "VPB III-02", "VPB III-03", "VPB III-04", "VPB III-05", "VPB III-06", "VPB III-07", "VPB III-08", "VPB III-09"],
        "VPB IV": ["VPB IV-01", "VPB IV-02", "VPB IV-03", "VPB IV-04", "VPB IV-05", "VPB IV-06", "VPB IV-07", "VPB IV-08", "VPB IV-09"],
        "VMA I": ["VMA I-01", "VMA I-02", "VMA I-03", "VMA I-04", "VMA I-05", "VMA I-06", "VMA I-07", "VMA I-08", "VMA I-09"],
        "VMA II": ["VMA II-01", "VMA II-02", 

"VMA II-03", "VMA II-04", "VMA II-05", "VMA II-06", "VMA II-07", "VMA II-08", "VMA II-09"]
    };

    // Atualizar as máquinas ao selecionar um parque
    parqueSelect.addEventListener("change", function () {
        const parqueSelecionado = parqueSelect.value;
        maquinaSelect.innerHTML = '<option value="">Escolha uma máquina...</option>';
        if (parqueSelecionado && maquinasPorParque[parqueSelecionado]) {
            maquinasPorParque[parqueSelecionado].forEach(maquina => {
                const option = document.createElement("option");
                option.value = maquina;

                option.textContent = maquina;
                maquinaSelect.appendChild(option);
            });
        }
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const parque = parqueSelect.value;
        const maquina = maquinaSelect.value;
        const usuario = usuarioInput.value;
        const data = dataInput.value;
        let fotosUrls = [];

        if (!parque || !maquina || !usuario || !data) {
            mensagemErro.innerText = "❌ Preencha todos os campos obrigatórios!";
            mensagemErro.style.display = 

"block";
            return;
        }

        // Upload das fotos para Firebase Storage
        if (fotosInput.files.length > 0) {
            const storageRef = firebase.storage().ref();
            for (let file of fotosInput.files) {
                const fileRef = storageRef.child(`pendencias/${maquina}/${file.name}`);
                await fileRef.put(file);
                fotosUrls.push(await fileRef.getDownloadURL());
            }
        }

        await db.collection("relatorios").add({
            usuario, parque, maquina, data, fotos: fotosUrls, timestamp: new Date()

        });

        mensagemSucesso.innerText = "✅ Relatório salvo com sucesso!";
        mensagemSucesso.style.display = "block";
    });
});
