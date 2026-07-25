// ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ JSON ಫೈಲ್‌ಗಳ ಪಟ್ಟಿ
const allSuktaIds = [
    "taittiriya/shikshavalli-01",
    "taittiriya/shikshavalli-02"
];

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const suktaId = urlParams.get('id');
    const highlightWord = urlParams.get('highlight'); // ಹುಡುಕಿದ ಶಬ್ದವನ್ನು ಪಡೆಯುವುದು

    // ==========================================
    // ೧. ಮಂತ್ರ ವಿವರಣೆಯ ಪುಟದ ಲಾಜಿಕ್ (sukta.html)
    // ==========================================
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
                
                // ಮಂತ್ರ ಮತ್ತು ಹೈಲೈಟ್ ಲಾಜಿಕ್
                let mantraHtml = data.sanskrit_mantra || "";
                if (highlightWord) {
                    // ಹುಡುಕಿದ ಶಬ್ದವನ್ನು ಹಳದಿ ಬಣ್ಣದಲ್ಲಿ ಹೈಲೈಟ್ ಮಾಡುವುದು
                    const regex = new RegExp(`(${highlightWord})`, "gi");
                    mantraHtml = mantraHtml.replace(regex, `<span class="highlight-word">$1</span>`);
                }
                
                const mantraDiv = document.getElementById("sanskrit-mantra");
                if(mantraDiv) mantraDiv.innerHTML = mantraHtml;

                const bhavDiv = document.getElementById("bhavanuvada-text");
                if(bhavDiv) bhavDiv.innerHTML = data.bhavanuvada || "";

                const shabdarthaBody = document.getElementById("shabdartha-body");
                if(shabdarthaBody && data.shabdartha) {
                    shabdarthaBody.innerHTML = "";
                    data.shabdartha.forEach(item => {
                        let row = `<tr><td>${item.word}</td><td>${item.meaning}</td></tr>`;
                        shabdarthaBody.innerHTML += row;
                    });
                }

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

    // ಅಕಾರ್ಡಿಯನ್ ಲಾಜಿಕ್
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

    // ==========================================
    // ೨. ಸರ್ಚ್ ಇಂಜಿನ್ ಲಾಜಿಕ್ (index.html ಗಾಗಿ)
    // ==========================================
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results-container");

    if(searchForm && searchInput && resultsContainer) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if(!query) return;

            resultsContainer.innerHTML = "<p style='padding:15px; text-align:center;'>ಹುಡುಕಲಾಗುತ್ತಿದೆ...</p>";

            let matches = [];
            
            // ಪ್ರತಿಯೊಂದು JSON ಫೈಲ್ ಅನ್ನು ಹುಡುಕುವುದು
            for (let id of allSuktaIds) {
                try {
                    let res = await fetch(`data/${id}.json`);
                    if(res.ok) {
                        let data = await res.json();
                        // ಮಂತ್ರದಲ್ಲಿ ಆ ಶಬ್ದ ಇದೆಯೇ ಎಂದು ಪರೀಕ್ಷಿಸುವುದು
                        if (data.sanskrit_mantra && data.sanskrit_mantra.includes(query)) {
                            matches.push({
                                id: id,
                                title: data.anuvaka || data.sukta_title,
                                snippet: data.sanskrit_mantra.substring(0, 40) + "..."
                            });
                        }
                    }
                } catch (err) {
                    console.error("Search error on", id, err);
                }
            }

            // ಫಲಿತಾಂಶಗಳನ್ನು ತೋರಿಸುವುದು
            resultsContainer.innerHTML = "";
            if(matches.length === 0) {
                resultsContainer.innerHTML = "<p style='padding:15px; text-align:center; color:red;'>ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ. ಸರಿಯಾದ ಶಬ್ದವನ್ನು ಟೈಪ್ ಮಾಡಿದ್ದೀರಾ ಎಂದು ಪರೀಕ್ಷಿಸಿ.</p>";
            } else {
                matches.forEach(match => {
                    let link = document.createElement("a");
                    // URL ನಲ್ಲಿ highlight ಪ್ಯಾರಾಮೀಟರ್ ಕಳುಹಿಸುವುದು
                    link.href = `sukta.html?id=${match.id}&highlight=${query}`;
                    link.className = "search-item";
                    link.innerHTML = `<h4>${match.title}</h4><p>${match.snippet}</p>`;
                    resultsContainer.appendChild(link);
                });
            }
        });
    }
});