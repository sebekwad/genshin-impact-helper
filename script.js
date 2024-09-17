document.addEventListener('DOMContentLoaded', () => {
    // Handle character tab switching
    const characterButtons = document.querySelectorAll('.tab-button');
    const characterContents = document.querySelectorAll('.character-content');

    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-character');

            // Remove 'active' class from all buttons
            characterButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Hide all character contents
            characterContents.forEach(content => {
                content.classList.remove('active');
            });

            // Show the selected character content
            document.getElementById(characterId).classList.add('active');

            // Reset subtabs
            const subtabs = document.querySelectorAll(`#${characterId} .subtab-content`);
            subtabs.forEach(subtab => subtab.classList.remove('active'));

            // Show the first subtab by default
            const firstSubtab = document.querySelector(`#${characterId} .subtab-button`).getAttribute('data-subtab');
            document.getElementById(firstSubtab).classList.add('active');
        });
    });

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

    // Optionally, activate the first character and its first subtab on load
    characterButtons[0].click();
});
