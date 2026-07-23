document.addEventListener("DOMContentLoaded", () => {
    // Get the ID from the URL (e.g., ?id=taittiriya/shikshavalli-01)
    const urlParams = new URLSearchParams(window.location.search);
    const suktaId = urlParams.get('id');

    if (suktaId) {
        // Fetch the corresponding JSON file
        fetch(`data/${suktaId}.json`)
            .then(response => response.json())
            .then(data => populateData(data))
            .catch(error => {
                console.error("Error loading JSON data:", error);
                document.getElementById("sukta-title").innerText = "ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ!";
            });
    }
});

function populateData(data) {
    // 1. Header Info
    document.title = data.sukta_title + " - ಸೂಕ್ತಿ ಸೌರಭ";
    document.getElementById("sukta-title").innerHTML = data.sukta_title;
    document.getElementById("sukta-subtitle").innerHTML = data.anuvaka;
    document.getElementById("sukta-desc").innerHTML = data.description;

    // 2. Sanskrit Mantra
    document.getElementById("sanskrit-mantra").innerHTML = data.sanskrit_mantra;

    // 3. Shabdartha Table
    const table = document.getElementById("shabdartha-table");
    data.shabdartha.forEach(item => {
        let row = `<tr><td>${item.word}</td><td>${item.meaning}</td></tr>`;
        table.innerHTML += row;
    });

    // 4. Bhavanuvada
    document.getElementById("bhavanuvada-text").innerHTML = data.bhavanuvada;

    // 5. Vyakarana
    const vyakaranaList = document.getElementById("vyakarana-list");
    data.vyakarana.forEach(rule => {
        vyakaranaList.innerHTML += `<li style="margin-bottom:10px; font-size:1.1em;">${rule}</li>`;
    });

    // 6. Bhashya
    document.getElementById("advaita").innerHTML = `<strong>ಅದ್ವೈತ ದೃಷ್ಟಿಕೋನ:</strong><br><br>${data.bhashya.advaita}`;
    document.getElementById("dvaita").innerHTML = `<strong>ದ್ವೈತ ದೃಷ್ಟಿಕೋನ:</strong><br><br>${data.bhashya.dvaita}`;
    document.getElementById("vishishtadvaita").innerHTML = `<strong>ವಿಶಿಷ್ಟಾದ್ವೈತ ದೃಷ್ಟಿಕೋನ:</strong><br><br>${data.bhashya.vishishtadvaita}`;
}

// Tab Switching Logic
function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    let tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Bhashya Dropdown Logic
function showBhashya(val) {
    let details = document.getElementsByClassName("bhashya-detail");
    for(let i = 0; i < details.length; i++) {
        details[i].style.display = "none";
    }
    document.getElementById(val).style.display = "block";
}