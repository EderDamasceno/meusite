document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const mensagemSucesso = document.getElementById("mensagem-sucesso");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita o recarregamento imediato da página

        // Simula o envio do formulário
        setTimeout(() => {
            mensagemSucesso.style.display = "block"; // Mostra a mensagem de sucesso
            form.reset(); // Limpa os campos do formulário

            // Redireciona para a página "Obrigado" após 2 segundos
            setTimeout(() => {
                window.location.href = "obrigado.html";
            }, 2000);
        }, 500);
    });
});
const elementos = document.querySelectorAll(".animacao");

function mostrarElementos() {
    elementos.forEach((elemento) => {
        if (elemento.getBoundingClientRect().top < window.innerHeight - 50) {
            elemento.classList.add("mostrar");
        }
    });
}

window.addEventListener("scroll", mostrarElementos);
mostrarElementos();
const botaoTopo = document.getElementById("btn-topo");

// Mostrar o botão quando o usuário rolar para baixo
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        botaoTopo.style.display = "block";
    } else {
        botaoTopo.style.display = "none";
    }
});

// Rolar suavemente para o topo ao clicar
botaoTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});