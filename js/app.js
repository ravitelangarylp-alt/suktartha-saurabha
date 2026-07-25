document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const suktaId = urlParams.get('id');

    if (suktaId) {
        fetch(`data/${suktaId}.json`)
            .then(response => {
                if (!response.ok) throw new Error("ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ");
                return response.json();
            })
            .then(data => {
                document.getElementById("sukta-title").textContent = data.sukta_title || "";
                document.getElementById("anuvaka-title").textContent = data.anuvaka || "";
                document.getElementById("mantra-desc").textContent = data.description || "";
                
                // ಮಂತ್ರ
                const mantraDiv = document.getElementById("sanskrit-mantra");
                if(mantraDiv) mantraDiv.innerHTML = data.sanskrit_mantra || "";

                // ಭಾವಾನುವಾದ
                const bhavDiv = document.getElementById("bhavanuvada-text");
                if(bhavDiv) bhavDiv.innerHTML = data.bhavanuvada || "";

                // ಶಬ್ದಶಃ ಅರ್ಥ
                const shabdarthaBody = document.getElementById("shabdartha-body");
                if(shabdarthaBody && data.shabdartha) {
                    shabdarthaBody.innerHTML = "";
                    data.shabdartha.forEach(item => {
                        let row = `<tr><td>${item.word}</td><td>${item.meaning}</td></tr>`;
                        shabdarthaBody.innerHTML += row;
                    });
                }

                // ವ್ಯಾಕರಣ
                const vyakaranaList = document.getElementById("vyakarana-list");
                if(vyakaranaList && data.vyakarana) {
                    vyakaranaList.innerHTML = "";
                    data.vyakarana.forEach(item => {
                        vyakaranaList.innerHTML += `<li>${item}</li>`;
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById("sukta-title").textContent = "ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ!";
            });
    }

    // ಅಕಾರ್ಡಿಯನ್ ಲಾಜಿಕ್ (ಕ್ಲಿಕ್ ಮಾಡಿದಾಗ ತೆರೆಯುವುದು)
    let acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    }
});