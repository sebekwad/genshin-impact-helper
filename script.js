document.addEventListener('DOMContentLoaded', () => {
    const characterButtons = document.querySelectorAll('.tab-button');
    const characterContents = document.querySelectorAll('.character-content');
    const searchInput = document.getElementById('character-search');
    

    // Sprawdź, czy istnieją elementy w characterButtons
    if (characterButtons.length > 0) {
        // Obsługa przełączania zakładek postaci
        characterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const characterId = button.getAttribute('data-character');

                // Zapisz aktywną postać do localStorage
                localStorage.setItem('activeCharacter', characterId);

                // Usuń klasę "active" ze wszystkich przycisków
                characterButtons.forEach(btn => btn.classList.remove('active'));

                // Dodaj klasę "active" do klikniętego przycisku
                button.classList.add('active');

                // Ukryj wszystkie sekcje postaci
                characterContents.forEach(content => content.classList.remove('active'));

                // Pokaż wybraną sekcję postaci
                document.getElementById(characterId).classList.add('active');

                // Resetuj podzakładki
                const subtabs = document.querySelectorAll(`#${characterId} .subtab-content`);
                subtabs.forEach(subtab => subtab.classList.remove('active'));

                // Pokaż domyślną pierwszą podzakładkę
                const firstSubtab = document.querySelector(`#${characterId} .subtab-button`).getAttribute('data-subtab');
                document.getElementById(firstSubtab).classList.add('active');
            });

            // Tooltip functionality
            button.addEventListener('mouseover', () => {
                const tooltipText = button.getAttribute('data-tooltip');
                showTooltip(button, tooltipText);
            });

            button.addEventListener('mouseout', hideTooltip);
        });

        // Przywróć aktywną postać z localStorage
        const savedCharacterId = localStorage.getItem('activeCharacter');
        if (savedCharacterId) {
            document.querySelector(`.tab-button[data-character="${savedCharacterId}"]`).click();
        } else {
            // Opcjonalnie aktywuj pierwszą postać i jej pierwszą podzakładkę przy ładowaniu strony
            characterButtons[0].click();
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("toggle-sidebar").addEventListener("click", function() {
        const sidebar = document.getElementById("character-sidebar");
        sidebar.classList.toggle("hidden");
    });
});


    
    // Wyszukiwanie postaci
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        characterButtons.forEach(button => {
            const characterName = button.textContent.toLowerCase();
            const tooltipText = button.getAttribute('data-tooltip'); // Pobierz tekst z tooltipa

            // Sprawdź, czy tooltipText nie jest null
            const tooltipTextLower = tooltipText ? tooltipText.toLowerCase() : '';

            // Sprawdź, czy postać lub tooltip zawiera tekst wyszukiwania
            button.style.display = characterName.includes(searchValue) || tooltipTextLower.includes(searchValue) ? '' : 'none';
        });
    });

    // Leniwe ładowanie obrazów
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.onload = () => img.classList.add('loaded');
        img.src = img.dataset.src; // Użyj data-src do leniwego ładowania
    });

    // Tooltip helper functions
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

    // Obsługa przełączania podzakładek wewnątrz postaci
    const subtabButtons = document.querySelectorAll('.subtab-button');
    const subtabContents = document.querySelectorAll('.subtab-content');

    subtabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subtabId = button.getAttribute('data-subtab');

            // Ukryj wszystkie podzakładki dla aktualnej postaci
            const parentSection = button.closest('.character-content');
            const parentSubtabs = parentSection.querySelectorAll('.subtab-content');
            parentSubtabs.forEach(subtab => subtab.classList.remove('active'));

            // Pokaż wybraną podzakładkę
            document.getElementById(subtabId).classList.add('active');
        });
    });
});
