console.log("🚀 Script.js carregado e pronto!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM totalmente carregado!");

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

    // Configuração do Cloudinary
    const cloudName = "dd56l8go8";
    const uploadPreset = "pendencias_upload";

    // Estrutura de máquinas por parque
    const maquinasPorParque = {
        "VPB III": ["VPB III-01", "VPB III-02", "VPB III-03", "VPB III-04", "VPB III-05", "VPB III-06", "VPB III-07", "VPB III-08", "VPB III-09"],
        "VPB IV": ["VPB IV-01", "VPB IV-02", "VPB IV-03", "VPB IV-04", "VPB IV-05", "VPB IV-06", "VPB IV-07", "VPB IV-08", "VPB IV-09"],
        "VMA I": ["VMA I-01", "VMA I-02", "VMA I-03", "VMA I-04", "VMA I-05", "VMA I-06", "VMA I-07", "VMA I-08", "VMA I-09"],
        "VMA II": ["VMA II-01", "VMA II-02", "VMA II-03", "VMA II-04", "VMA II-05", "VMA II-06", "VMA II-07", "VMA II-08", "VMA II-09"]
    };

    // Atualizar máquinas ao selecionar um parque
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

    // Carregar pendências existentes do Firestore
    async function carregarPendencias() {
        console.log("📥 Carregando pendências...");
        pendenciaSelect.innerHTML = '<option value="">Escolha uma pendência...</option>';

        try {
            const snapshot = await db.collection("pendencias").get();
            if (snapshot.empty) {
                console.warn("⚠️ Nenhuma pendência encontrada no Firestore.");
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                console.log("📌 Pendência encontrada:", data);

                const option = document.createElement("option");
                option.value = data.codigo;
                option.textContent = ${data.codigo} - ${data.descricao};
                pendenciaSelect.appendChild(option);
            });

            console.log("✅ Pendências carregadas com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao carregar pendências:", error);
        }
    }
    carregarPendencias();

    // Função para fazer upload das imagens para o Cloudinary
    async function uploadImagem(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(https://api.cloudinary.com/v1_1/${cloudName}/image/upload, {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.secure_url) {
                console.log("📸 Imagem enviada:", result.secure_url);
                return result.secure_url;
            } else {
                console.warn("⚠️ Erro ao obter URL da imagem");
                return null;
            }
        } catch (error) {
            console.error("❌ Erro ao enviar imagem para Cloudinary:", error);
            return null;
        }
    }

    // Evento de envio do formulário
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const parque = parqueSelect.value;
        const maquina = maquinaSelect.value;
        const usuario = usuarioInput.value;
        const data = dataInput.value;
        const pendenciaSelecionada = pendenciaSelect.value;
        const novaPendencia = novaPendenciaInput.value.trim();

        if (!parque || !maquina || !usuario || !data) {
            mensagemErro.innerText = "❌ Preencha todos os campos obrigatórios!";
            mensagemErro.style.display = "block";
            return;
        }

        let codigoPendencia = pendenciaSelecionada || null;
        if (!pendenciaSelecionada && novaPendencia) {
            codigoPendencia = "P" + Math.floor(100 + Math.random() * 900);
            await db.collection("pendencias").add({
                codigo: codigoPendencia,
                descricao: novaPendencia,
                timestamp: new Date()
            });
        }

        // Upload de fotos
        let fotosUrls = [];
        if (fotosInput.files.length > 0) {
            for (let file of fotosInput.files) {
                const url = await uploadImagem(file);
                if (url) fotosUrls.push(url);
            }
        }

        // Salvar os dados no Firestore (incluindo o campo "fotos")
        try {
            await db.collection("relatorios").add({
                usuario,
                parque,
                maquina,
                pendencia: codigoPendencia,
                data,
                fotos: fotosUrls,  // 🔥 Agora salvando as fotos no Firestore
                timestamp: new Date()
            });

            mensagemSucesso.innerText = "✅ Relatório salvo com sucesso!";
            mensagemSucesso.style.display = "block";
            form.reset();
            carregarPendencias();
        } catch (error) {
            console.error("❌ Erro ao salvar relatório no Firestore:", error);
            mensagemErro.innerText = "Erro ao salvar relatório. Tente novamente!";
            mensagemErro.style.display = "block";
        }
    });
});