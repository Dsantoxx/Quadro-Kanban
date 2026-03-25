// ============================================================
// VARIÁVEIS DE ESTADO GLOBAL
// ============================================================
let cardAtual = null;       // card sendo arrastado no momento
let cardParaExcluir = null; // card aguardando confirmação de exclusão

// ============================================================
// FUNÇÃO: criarCard(colunaId)
// Cria um novo card e insere na coluna informada
// ============================================================
function criarCard(colunaId) {

  // Cria o elemento do card
  const card = document.createElement("div");
  card.classList.add("card");
  card.draggable = true;

  // Cria o botão de excluir
  const botaoExcluir = document.createElement("button");
  botaoExcluir.innerText = "✕";
  botaoExcluir.classList.add("delete");
  botaoExcluir.title = "Excluir card";
  botaoExcluir.onclick = function (e) {
    e.stopPropagation();
    cardParaExcluir = card;
    abrirModal();
  };

  // Cria o campo de texto — começa bloqueado, edita com duplo clique
  const texto = document.createElement("div");
  texto.classList.add("texto");
  texto.contentEditable = "false";
  texto.innerText = "Nova tarefa...";

  // Duplo clique: ativa modo de edição (requisito do enunciado)
  card.addEventListener("dblclick", function (e) {
    e.stopPropagation();
    ativarEdicao(card, texto);
  });

  // Perde foco: desativa modo de edição
  texto.addEventListener("blur", function () {
    desativarEdicao(card, texto);
  });

  // Monta o card
  card.appendChild(botaoExcluir);
  card.appendChild(texto);

  // Registra eventos de drag-and-drop
  registrarDragEventos(card);

  // Insere na coluna correta
  document.getElementById(colunaId).appendChild(card);

  // Atualiza contadores
  atualizarContadores();

  // Abre já em modo de edição
  ativarEdicao(card, texto);
}

// ============================================================
// FUNÇÃO: ativarEdicao
// Habilita contentEditable e foca no campo de texto
// ============================================================
function ativarEdicao(card, texto) {
  texto.contentEditable = "true";
  card.draggable = false;
  card.classList.add("editando");
  texto.focus();

  // Seleciona todo o texto para facilitar substituição
  const range = document.createRange();
  range.selectNodeContents(texto);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// ============================================================
// FUNÇÃO: desativarEdicao
// Desabilita edição e restaura drag-and-drop
// ============================================================
function desativarEdicao(card, texto) {
  texto.contentEditable = "false";
  card.draggable = true;
  card.classList.remove("editando");

  // Se ficou vazio, coloca texto padrão
  if (texto.innerText.trim() === "") {
    texto.innerText = "Nova tarefa...";
  }
}

// ============================================================
// FUNÇÃO: registrarDragEventos
// Adiciona dragstart e dragend ao card
// ============================================================
function registrarDragEventos(card) {
  card.addEventListener("dragstart", function () {
    cardAtual = card;
    setTimeout(() => card.classList.add("arrastando"), 0);
  });
  card.addEventListener("dragend", function () {
    card.classList.remove("arrastando");
    cardAtual = null;
  });
}

// ============================================================
// EVENTOS DAS COLUNAS — drag over e drop
// Usa DOMContentLoaded para garantir que o HTML já carregou
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".cards").forEach(function (coluna) {

    // Permite soltar o card na coluna
    coluna.addEventListener("dragover", function (e) {
      e.preventDefault();
      coluna.parentElement.classList.add("drag-over");
    });

    // Remove destaque ao sair
    coluna.addEventListener("dragleave", function () {
      coluna.parentElement.classList.remove("drag-over");
    });

    // Solta o card na nova coluna
    coluna.addEventListener("drop", function () {
      coluna.parentElement.classList.remove("drag-over");
      if (cardAtual) {
        coluna.appendChild(cardAtual);
        atualizarContadores();
      }
    });
  });

  // Fecha modal ao clicar fora
  document.getElementById("modalExcluir").addEventListener("click", function (e) {
    if (e.target === this) fecharModal();
  });

});

// ============================================================
// FUNÇÃO: atualizarContadores
// Atualiza o badge numérico de cada coluna
// ============================================================
function atualizarContadores() {
  ["todo", "doing", "done"].forEach(function (id) {
    const total = document.getElementById(id).querySelectorAll(".card").length;
    document.getElementById("cnt-" + id).innerText = total;
  });
}

// ============================================================
// MODAL DE EXCLUSÃO
// ============================================================
function abrirModal() {
  document.getElementById("modalExcluir").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("modalExcluir").classList.remove("ativo");
  cardParaExcluir = null;
}

// Confirmar exclusão
document.getElementById("confirmarExcluir").onclick = function () {
  if (cardParaExcluir) {
    cardParaExcluir.remove();
    cardParaExcluir = null;
    atualizarContadores();
  }
  fecharModal();
};

// Cancelar exclusão
document.getElementById("cancelarExcluir").onclick = function () {
  fecharModal();
};