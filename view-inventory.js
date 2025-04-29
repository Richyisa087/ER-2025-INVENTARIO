// Carica l'inventario dal localStorage
let inventario = JSON.parse(localStorage.getItem("inventario")) || {};

// Funzione per aggiornare la visualizzazione dell'inventario
function aggiornaInventario() {
    const contenitore = document.getElementById("inventarioContent");

    if (Object.keys(inventario).length === 0) {
        contenitore.innerHTML = '<p>Nessun oggetto nell\'inventario.</p>';
    } else {
        contenitore.innerHTML = ''; // Pulisce l’elenco
        for (let nome in inventario) {
            const item = document.createElement("p");
            item.textContent = `${nome}: ${inventario[nome]} pezzo/i`;
            contenitore.appendChild(item);
        }
    }
}

// Carica l'inventario quando la pagina viene caricata
window.onload = aggiornaInventario;
