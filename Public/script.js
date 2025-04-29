// Oggetto per memorizzare gli oggetti e le quantità
let inventario = JSON.parse(localStorage.getItem("inventario")) || {};

// Funzione per aggiornare l'inventario sullo schermo
const contenitore = document.getElementById("cancelleria");

function aggiornaInventario() {
    contenitore.innerHTML = ''; // Pulisce l’elenco
    for (let nome in inventario) {
        const item = document.createElement("p");
        item.textContent = `${nome}: ${inventario[nome]} pezzo/i`;
        contenitore.appendChild(item);
    }
}

// Salva l'inventario nel localStorage
function salvaInventario() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
}

// Aggiungi un oggetto all'inventario
document.getElementById("addBtn").addEventListener("click", () => {
    const nome = document.getElementById("nomeOggetto").value.trim();
    const quantita = parseInt(document.getElementById("quantita").value);

    if (!nome || isNaN(quantita) || quantita <= 0) {
        alert("Inserisci un nome valido e una quantità maggiore di zero.");
        return;
    }

    if (inventario[nome]) {
        inventario[nome] += quantita;
    } else {
        inventario[nome] = quantita;
    }

    aggiornaInventario();
    salvaInventario();  // Salva l'inventario ogni volta che viene modificato
});

// Rimuovi un oggetto dall'inventario
document.getElementById("removeBtn").addEventListener("click", () => {
    const nome = document.getElementById("nomeOggetto").value.trim();
    const quantita = parseInt(document.getElementById("quantita").value);

    if (!nome || isNaN(quantita) || quantita <= 0) {
        alert("Inserisci un nome valido e una quantità maggiore di zero.");
        return;
    }

    if (inventario[nome]) {
        inventario[nome] -= quantita;
        if (inventario[nome] <= 0) {
            delete inventario[nome];
        }
        aggiornaInventario();
        salvaInventario();  // Salva l'inventario ogni volta che viene modificato
    } else {
        alert("Questo oggetto non esiste nell’inventario.");
    }
});

// Funzione per generare il testo dell'inventario
function generateInventoryText() {
    let txtContent = "Inventario:\n\n";
    for (let nome in inventario) {
        txtContent += `${nome}: ${inventario[nome]} pezzo/i\n`;
    }
    return txtContent;
}

// Salva il file giornaliero
document.getElementById("saveDailyBtn").addEventListener("click", () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Domenica, 1: Lunedì, ..., 6: Sabato
    const selectedDay = document.getElementById("daySelect").value;

    if (dayOfWeek == selectedDay) {
        const txtContent = generateInventoryText();
        const blob = new Blob([txtContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `inventario_giornaliero_${today.toLocaleDateString()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert("Oggi non è il giorno selezionato per il salvataggio.");
    }
});

// Salva il file settimanale
document.getElementById("saveWeeklyBtn").addEventListener("click", () => {
    const weekSelected = document.getElementById("weekSelect").value;
    const today = new Date();
    const txtContent = generateInventoryText();

    const filename = `inventario_settimanale_settimana_${weekSelected}_${today.toLocaleDateString()}.txt`;

    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
});

// Funzione per scaricare l'inventario come file JSON
document.getElementById("downloadBtn").addEventListener("click", () => {
    const dataStr = JSON.stringify(inventario, null, 4); // Prettify JSON
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario.json";
    a.click();
    URL.revokeObjectURL(url); // Rilascia l'oggetto URL
});

// Carica l'inventario quando la pagina viene caricata
window.onload = aggiornaInventario;

document.addEventListener('DOMContentLoaded', function() {
    fetchInventory();

    function fetchInventory() {
        fetch('/api/inventario')
            .then(response => response.json())
            .then(data => {
                const inventarioDiv = document.getElementById('inventario');
                inventarioDiv.innerHTML = ''; // Pulisce l'inventario esistente

                data.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.textContent = `${item.nome}: ${item.quantita} pezzo/i`;
                    inventarioDiv.appendChild(itemDiv);
                });
            })
            .catch(err => console.log('Errore nel recupero dell’inventario:', err));
    }
});

