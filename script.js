document.addEventListener('DOMContentLoaded', () => {
    const characterButtons = document.querySelectorAll('.tab-button');
    const characterContents = document.querySelectorAll('.character-content');
    const searchInput = document.getElementById('character-search');

    // Sprawdź, czy istnieją elementy w characterButtons
    if (characterButtons.length > 0) {
        // Handle character tab switching
        characterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const characterId = button.getAttribute('data-character');

                // Save active character to localStorage
                localStorage.setItem('activeCharacter', characterId);

                // Remove 'active' class from all buttons
                characterButtons.forEach(btn => btn.classList.remove('active'));

                // Add 'active' class to the clicked button
                button.classList.add('active');

                // Hide all character contents
                characterContents.forEach(content => content.classList.remove('active'));

                // Show the selected character content
                document.getElementById(characterId).classList.add('active');

                // Reset subtabs
                const subtabs = document.querySelectorAll(`#${characterId} .subtab-content`);
                subtabs.forEach(subtab => subtab.classList.remove('active'));

                // Show the first subtab by default
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

        // Restore the active character from localStorage
        const savedCharacterId = localStorage.getItem('activeCharacter');
        if (savedCharacterId) {
            document.querySelector(`.tab-button[data-character="${savedCharacterId}"]`).click();
        } else {
            // Optionally, activate the first character and its first subtab on load
            characterButtons[0].click();
        }
    }

    // Character search functionality
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        characterButtons.forEach(button => {
            const characterName = button.textContent.toLowerCase();
            button.style.display = characterName.includes(searchValue) ? '' : 'none';
        });
    });

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

    // Handle subtab switching within a character
    const subtabButtons = document.querySelectorAll('.subtab-button');
    const subtabContents = document.querySelectorAll('.subtab-content');

    subtabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subtabId = button.getAttribute('data-subtab');

            // Hide all subtab contents for the current character
            const parentSection = button.closest('.character-content');
            const parentSubtabs = parentSection.querySelectorAll('.subtab-content');
            parentSubtabs.forEach(subtab => subtab.classList.remove('active'));

            // Show the selected subtab content
            document.getElementById(subtabId).classList.add('active');
        });
    });
});
