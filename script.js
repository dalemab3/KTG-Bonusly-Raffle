document.addEventListener('DOMContentLoaded', () => {
    const names = [
        "Ben B", "Benji J", "Bryan C", "Chris R", "Edward C",
        "Jan B", "Jose G", "Joseph L", "Justin W", "Sarah B",
        "Steven K", "Willem P", "Krystal S"
    ];

    const raffleButton = document.getElementById('raffleButton');
    const resultLabel = document.getElementById('resultLabel');
    const namesList = document.getElementById('namesList');
    const winnersList = document.getElementById('winnersList');
    const clearWinnersButton = document.getElementById('clearWinnersButton');

    // Audio elements
    const spinSound = new Audio('path/to/spin-sound.mp3');
    const winnerSound = new Audio('path/to/winner-sound.mp3');

    // Display names on page load
    function displayNames() {
        namesList.innerHTML = names.map((name, index) => 
            `<p id="name-${index}" class="name-item">${name}</p>`
        ).join('');
    }

    // Save winner to localStorage
    function saveWinner(name, month) {
        const winners = JSON.parse(localStorage.getItem('winners')) || [];
        winners.push({ name, month });
        localStorage.setItem('winners', JSON.stringify(winners));
    }

    // Generate a random duration between min and max in seconds
    function getRandomDuration(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000; // Convert to milliseconds
    }

    // Start the raffle animation
    function startRaffleAnimation() {
        if (names.length === 0) {
            alert("No names to raffle. Please add names first.");
            return;
        }

        const animationDuration = getRandomDuration(8, 16); // Random duration between 8 and 16 seconds
        const baseDelay = 70; // Constant delay in milliseconds
        const maxDelay = 300; // Maximum delay in milliseconds at the end

        let startTime = Date.now();
        let animationIndex = 0;
        let lastNameShown = '';

        // Play the spinning sound
        spinSound.loop = true;
        spinSound.play();

        function animateRaffle() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1); // Normalize progress (0 to 1)

            // Increase delay towards the end
            const delay = baseDelay + (maxDelay - baseDelay) * progress;

            if (elapsedTime < animationDuration) {
                // Update the result label and highlight the name in the list
                lastNameShown = names[animationIndex];
                resultLabel.textContent = lastNameShown;

                // Update the names list background color
                highlightName(lastNameShown);

                animationIndex = (animationIndex + 1) % names.length;
                setTimeout(animateRaffle, delay);
            } else {
                spinSound.pause();
                spinSound.currentTime = 0;
                showFinalWinner(lastNameShown);
            }
        }

        function highlightName(nameToHighlight) {
            // Remove previous highlights
            namesList.querySelectorAll('.name-item').forEach(p => p.classList.remove('highlight'));

            // Highlight the current name
            const nameElement = Array.from(namesList.querySelectorAll('.name-item')).find(p => p.textContent.trim() === nameToHighlight.trim());
            if (nameElement) {
                nameElement.classList.add('highlight');
            }
        }

        function showFinalWinner(finalName) {
            // The final name is taken from the last shown name
            const winner = finalName || names[Math.floor(Math.random() * names.length)];
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            resultLabel.textContent = `Winner: ${winner}`;
            saveWinner(winner, currentMonth);
            triggerConfetti(); // Trigger confetti animation

            // Play the winner sound
            winnerSound.play();

            // Update winners display
            displayWinners();
        }

        animateRaffle();
    }

    // Function to display stored winners
    function displayWinners() {
        const winners = JSON.parse(localStorage.getItem('winners')) || [];
        if (winners.length === 0) {
            winnersList.innerHTML = "<p>No winners recorded.</p>";
        } else {
            winnersList.innerHTML = winners.map(winner => `<p>${winner.name} won in ${winner.month}</p>`).join('');
        }
    }

    // Function to clear winners from localStorage
    function clearWinners() {
        localStorage.removeItem('winners');
        displayWinners();
    }

    // Function to trigger confetti animation
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    raffleButton.addEventListener('click', startRaffleAnimation);
    clearWinnersButton.addEventListener('click', clearWinners);
    displayNames();
    displayWinners();
});
