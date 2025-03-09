console.log("🚀 Script.js carregado e pronto!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM totalmente carregado!");

    const form = document.getElementById("form-relatorio");
    const parqueSelect = document.getElementById("parque");
    const maquinaSelect = document.getElementById("maquina");
    const pendenciaSelect = document.getElementById("pendencia");
    const usuarioInput = document.getElementById("usuario");
    const dataInput = document.getElementById("data");
    const fotosInput = document.getElementById("fotos");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    const mensagemErro = document.getElementById("mensagem-erro");

    // Estrutura de máquinas por parque
    const maquinasPorParque = {
        "VPB III": ["VPB III-01", "VPB III-02", "VPB III-03", "VPB III-04", "VPB III-05", "VPB III-06", "VPB III-07", "VPB III-08", "VPB III-09"],
        "VPB IV": ["VPB IV-01", "VPB IV-02", "VPB IV-03", "VPB IV-04", "VPB IV-05", "VPB IV-06", "VPB IV-07", "VPB IV-08", "VPB IV-09"],
        "VMA I": ["VMA I-01", "VMA I-02", "VMA I-03", "VMA I-04", "VMA I-05", "VMA I-06", "VMA I-07", "VMA I-08", "VMA I-09"],
        "VMA II": ["VMA II-01", "VMA II-02", "VMA II-03", "VMA II-04", "VMA II-05", "VMA II-06", "VMA II-07", "VMA II-08", "VMA II-09"]
    };

    // Atualizar a lista de máquinas ao selecionar um parque
    parqueSelect.addEventListener("change", function () {
        console.log("🌍 Parque selecionado:", parqueSelect.value);
        maquinaSelect.innerHTML = '<option value="">Escolha uma máquina...</option>';

        if (parqueSelect.value in maquinasPorParque) {
            maquinasPorParque[parqueSelect.value].forEach(maquina => {
                const option = document.createElement("option");
                option.value = maquina;
                option.textContent = maquina;
                maquinaSelect.appendChild(option);
            });
        }
    });

    // Evento de envio do formulário
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const parque = parqueSelect.value;
        const maquina = maquinaSelect.value;
        const usuario = usuarioInput.value;
        const data = dataInput.value;

        if (!parque || !maquina || !usuario || !data) {
            mensagemErro.innerText = "❌ Preencha todos os campos obrigatórios!";
            mensagemErro.style.display = "block";
            return;
        }

        try {
            await db.collection("relatorios").add({
                usuario, parque, maquina, data, timestamp: new Date()
            });

            mensagemSucesso.innerText = "✅ Relatório salvo!";
            mensagemSucesso.style.display = "block";
            form.reset();
        } catch (error) {
            console.error("❌ Erro ao salvar relatório:", error);
            mensagemErro.innerText = "Erro ao salvar relatório. Tente novamente!";
            mensagemErro.style.display = "block";
        }
    });
});