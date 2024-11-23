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

    // Funkcja do automatycznego otwierania pierwszej podzakładki
    function openFirstSubtab(characterId) {
        const characterSection = document.getElementById(characterId);
        if (characterSection) {
            const firstSubtabButton = characterSection.querySelector('.subtab-button');
            const firstSubtabContent = characterSection.querySelector('.subtab-content');

            if (firstSubtabButton && firstSubtabContent) {
                // Usuń aktywne klasy z innych zakładek i podzakładek
                subtabButtons.forEach(btn => btn.classList.remove('active'));
                characterSection.querySelectorAll('.subtab-content').forEach(content => content.classList.remove('active'));

                // Aktywuj pierwszą podzakładkę
                firstSubtabButton.classList.add('active');
                firstSubtabContent.classList.add('active');
            }
        }
    }

    // Obsługa kliknięcia zakładek postaci
    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-character');
            characterButtons.forEach(btn => btn.classList.remove('active'));
            characterContents.forEach(content => content.classList.remove('active'));

            // Aktywacja zakładki
            button.classList.add('active');
            const characterSection = document.getElementById(characterId);
            if (characterSection) {
                characterSection.classList.add('active');

                // Automatycznie otwórz pierwszą podzakładkę
                openFirstSubtab(characterId);
            }

            // Dostosuj wysokość sidebaru
            adjustSidebarHeight();
        });
    });

    // Funkcja do dostosowania wysokości sidebaru
    function adjustSidebarHeight() {
        const activeCharacter = document.querySelector('.character-content.active');
        if (activeCharacter) {
            const activeHeight = activeCharacter.offsetHeight;
            sidebar.style.height = `${activeHeight}px`;
        } else {
            sidebar.style.height = 'auto';
        }
    }

    // Wywołaj dostosowanie wysokości przy ładowaniu strony
    adjustSidebarHeight();
    
    // Funkcja do zapisywania aktualnego stanu zakładek i podzakładek
    function saveCurrentTabAndSubtab() {
        const activeCharacter = document.querySelector('.character-content.active');
        const activeSubtab = document.querySelector('.subtab-content.active');

        if (activeCharacter) {
            localStorage.setItem('activeCharacter', activeCharacter.id);
        }
        if (activeSubtab) {
            localStorage.setItem('activeSubtab', activeSubtab.id);
        }
    }

    // Funkcja do przywracania stanu zakładek i podzakładek
    function restoreTabsState() {
        const activeCharacterId = localStorage.getItem('activeCharacter');
        const activeSubtabId = localStorage.getItem('activeSubtab');

        if (activeCharacterId) {
            document.getElementById(activeCharacterId)?.classList.add('active');
            document.querySelector(`[data-character="${activeCharacterId}"]`)?.classList.add('active');
        }

        if (activeSubtabId) {
            document.getElementById(activeSubtabId)?.classList.add('active');
            document.querySelector(`[data-subtab="${activeSubtabId}"]`)?.classList.add('active');
        }
    }

    // Obsługa przycisku zwijania sidebaru
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        toggleButton.textContent = sidebar.classList.contains('collapsed') ? '⮞' : '⮜';
    });

    // Obsługa trybu ciemnego
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Obsługa wyszukiwania postaci
    characterSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        characterButtons.forEach(button => {
            const characterName = button.textContent.toLowerCase();
            const listItem = button.closest('li');

            if (listItem) {
                listItem.style.display = characterName.includes(query) ? '' : 'none';
            }
        });
    });

    // Obsługa kliknięcia zakładek postaci
    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-character');
            characterButtons.forEach(btn => btn.classList.remove('active'));
            characterContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(characterId).classList.add('active');

            saveCurrentTabAndSubtab(); // Zapisz stan
        });
    });

    // Obsługa kliknięcia podzakładek
    subtabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subtabId = button.getAttribute('data-subtab');
            subtabButtons.forEach(btn => btn.classList.remove('active'));
            subtabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(subtabId).classList.add('active');

            saveCurrentTabAndSubtab(); // Zapisz stan
        });
    });

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

    // Przywrócenie stanu zakładek i podzakładek po odświeżeniu
    restoreTabsState();

    // Obsługa ownedCheckboxes
    if (ownedCheckboxes.length > 0) {
        ownedCheckboxes.forEach(checkbox => {
            const characterId = checkbox.getAttribute('data-character');
            const isOwned = localStorage.getItem(`owned_${characterId}`) === 'true';
            checkbox.checked = isOwned;

            checkbox.addEventListener('change', () => {
                const characterId = checkbox.getAttribute('data-character');
                localStorage.setItem(`owned_${characterId}`, checkbox.checked);
                updateTeamsDisplay();
            });
        });
    }

    // Aktualizacja wyświetlania drużyn
    function updateTeamsDisplay() {
        const teams = document.querySelectorAll('.team');
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

            const teamTitle = team.querySelector('h3');
            if (teamTitle) {
                teamTitle.style.color = ownedCharacterCount === 4 ? 'green' : '';
            }
        });
    }

    updateTeamsDisplay();
});
