document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const characterSearch = document.getElementById('character-search');
    const characterButtons = document.querySelectorAll('.tab-button');
    const characterContents = document.querySelectorAll('.character-content');
    const subtabButtons = document.querySelectorAll('.subtab-button');
    const subtabContents = document.querySelectorAll('.subtab-content');
	const ownedCheckboxes = document.querySelectorAll('.owned-checkbox');
	const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggleSidebar');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        // Zmień ikonę przycisku na podstawie stanu sidebaru
        toggleButton.textContent = sidebar.classList.contains('collapsed') ? '⮞' : '⮜';
    });

    // Przełącznik trybu ciemnego
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Wyszukiwanie postaci
    characterSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    characterButtons.forEach(button => {
        const characterName = button.textContent.toLowerCase();
        const listItem = button.closest('li'); // Pobieramy całe <li>, w którym znajduje się button i checkbox

        if (listItem) {
            listItem.style.display = characterName.includes(query) ? '' : 'none';
        }
    });
});


    // Obsługa przełączania zakładek
    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-character');
			characterButtons.forEach(btn => btn.classList.remove('active'));
            characterContents.forEach(content => content.classList.remove('active'));
			button.classList.add('active');
            document.getElementById(characterId).classList.add('active');
        });
    });

    // Obsługa przełączania podzakładek
    subtabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subtabId = button.getAttribute('data-subtab');
            subtabButtons.forEach(btn => btn.classList.remove('active'));
            subtabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(subtabId).classList.add('active');
			
			updateSidebarHeight();  // Aktualizuj wysokość sidebaru
        });
    });

    function updateSidebarHeight() {
    const activeSubtabContent = document.querySelector('.subtab-content.active');
    const sidebar = document.querySelector('.sidebar');

    if (activeSubtabContent && sidebar) {
        const contentHeight = activeSubtabContent.scrollHeight;
        sidebar.style.height = `${contentHeight}px`;
    }
}


    // Tooltipy
    characterButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            const tooltipText = button.getAttribute('data-tooltip');
            showTooltip(button, tooltipText);
        });

        button.addEventListener('mouseout', hideTooltip);
    });

    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Definicja ownedCheckboxes
    const ownedCheckboxes = document.querySelectorAll('.owned-checkbox');

    // Sprawdzenie, czy istnieją checkboxy
    if (ownedCheckboxes.length > 0) {
        // Wczytanie zaznaczenia z localStorage
        ownedCheckboxes.forEach(checkbox => {
            const characterId = checkbox.getAttribute('data-character');
            const isOwned = localStorage.getItem(`owned_${characterId}`) === 'true';
            checkbox.checked = isOwned;
        });

        // Obsługa zmiany zaznaczenia postaci
        ownedCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const characterId = checkbox.getAttribute('data-character');
                localStorage.setItem(`owned_${characterId}`, checkbox.checked);
                updateTeamsDisplay();
            });
        });
    } else {
        console.warn("Nie znaleziono elementów .owned-checkbox");
    }

    // Funkcja do aktualizacji koloru i pogrubienia posiadanych postaci w sekcji "Teams"
function updateTeamsDisplay() {
    const teams = document.querySelectorAll('.team'); // Znajduje wszystkie drużyny

    teams.forEach(team => {
        const characterNameElements = team.querySelectorAll('p[data-character]');
        let ownedCharacterCount = 0;

        characterNameElements.forEach(element => {
            const characterId = element.getAttribute('data-character');
            const isOwned = localStorage.getItem(`owned_${characterId}`) === 'true';

            if (isOwned) {
                element.style.color = 'green';
                element.style.fontWeight = 'bold';
                ownedCharacterCount++;
            } else {
                element.style.color = '';
                element.style.fontWeight = '';
            }
        });

        // Znajduje <h3> wewnątrz bieżącego kontenera .team
        const teamTitle = team.querySelector('h3');

        if (teamTitle) {
            teamTitle.style.color = ownedCharacterCount === 4 ? 'green' : '';
        }
    });
}


    updateTeamsDisplay(); // Aktualizacja koloru postaci przy ładowaniu strony
});


// Zdefiniowanie zmiennej subtabContents
const subtabContents = document.querySelectorAll('.subtab-content');

// Sprawdzenie, czy subtabContents istnieje
if (subtabContents.length > 0) {
    // Twoja logika w updateTeamsDisplay
    updateTeamsDisplay();
} else {
    console.warn("Nie znaleziono elementów .subtab-content");
}

function updateTeamsDisplay() {
    subtabContents.forEach(content => {
        const characterNameElements = content.querySelectorAll('p[data-character]');
        if (characterNameElements.length === 0) {
            console.warn("Nie znaleziono elementów p[data-character] w sekcji Teams.");
        }
        characterNameElements.forEach(element => {
            const characterId = element.getAttribute('data-character');
            const isOwned = localStorage.getItem(`owned_${characterId}`) === 'true';
            element.style.color = isOwned ? 'green' : '';
        });
    });
}

    updateSidebarHeight();
