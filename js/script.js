let cardAtual = null;


/* FUNÇÃO PARA CRIAR CARD */
function criarCard(coluna){

    let texto = prompt("Digite o texto do card");

    if(!texto) return;

    let card = document.createElement("div");
    card.classList.add("card");
    card.draggable = true;
    card.innerText = texto;

    adicionarEventos(card);

    document.getElementById(coluna).appendChild(card);
}



/* EVENTOS DO CARD */
function adicionarEventos(card){

    // quando começa a arrastar
    card.addEventListener("dragstart", function(){
        cardAtual = card;
    });


    // editar com duplo clique
    card.addEventListener("dblclick", function(){

        let novoTexto = prompt("Editar card", card.innerText);

        if(novoTexto){
            card.innerText = novoTexto;
        }

    });

}



/* CONFIGURAR ÁREA DE DROP */
document.querySelectorAll(".cards").forEach(coluna => {

    coluna.addEventListener("dragover", function(e){
        e.preventDefault();
    });

    coluna.addEventListener("drop", function(){

        if(cardAtual){
            coluna.appendChild(cardAtual);
            cardAtual = null;
        }

    });

});