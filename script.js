document.addEventListener('DOMContentLoaded', () => {
    const loadingState = document.getElementById('loading-state'); // Renamed from loadingMessage
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text'); // New element to update error message
    const lastCheckedDisplay = document.getElementById('last-checked');
    const selectGamePrompt = document.getElementById('select-game-prompt');
    const codesDisplayArea = document.getElementById('codes-display-area');
    const updatesBar = document.getElementById('updates-bar');
    const updatesText = document.getElementById('updates-text');

    const backgroundMusic = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const gameFilterButtons = document.querySelectorAll('.game-filter-btn');

    const API_URL = 'https://db.hashblen.com/codes';

    let lastFetchedData = null;
    let currentSelectedGame = null;
    let allFetchedCodes = {};
    let lastKnownCodes = {}; // To compare for new additions for updates bar

    // Function to hide all main content display areas
    function hideAllContentSections() {
        loadingState.classList.add('hidden');
        errorMessage.classList.add('hidden');
        selectGamePrompt.classList.add('hidden');
        codesDisplayArea.innerHTML = ''; // Clear content
        codesDisplayArea.classList.add('hidden'); // Hide the display area itself
        lastCheckedDisplay.classList.add('hidden');
        updatesBar.classList.remove('show'); // Hide updates bar
    }

    // Function to show loading state
    function showLoadingState() {
        hideAllContentSections();
        loadingState.classList.remove('hidden');
        // AdSense might need to be re-pushed if visibility changes, but generally,
        // it handles itself if the ins tag remains in DOM.
        // For good measure, we'll try pushing ads again after content loads.
    }

    // Function to show error message
    function showErrorMessage(message) {
        hideAllContentSections();
        errorMessage.classList.remove('hidden');
        errorText.textContent = message;
    }

    function showSelectGamePrompt() {
        hideAllContentSections();
        selectGamePrompt.classList.remove('hidden');
    }

    function getRedemptionUrl(game, code) {
        switch (game.toLowerCase()) {
            case 'genshin':
                return `https://genshin.hoyoverse.com/m/en/gift?code=${code}`;
            case 'hsr':
                return `https://hsr.hoyoverse.com/gift?code=${code}`;
            case 'zzz':
                return `https://zenless.hoyoverse.com/redemption?code=${code}`;
            default:
                return '#';
        }
    }

    function formatTimestampForDisplay(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    function updateLastCheckedTime() {
        const now = new Date();
        lastCheckedDisplay.textContent = `Last API check: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
        lastCheckedDisplay.classList.remove('hidden');
    }

    function displayCodesForGame(gameKey) {
        codesDisplayArea.innerHTML = '';
        codesDisplayArea.classList.remove('hidden'); // Ensure codes display area is visible

        const gameNameMap = {
            'genshin': 'Genshin Impact',
            'hsr': 'Honkai: Star Rail',
            'zzz': 'Zenless Zone Zero'
        };
        const displayGameName = gameNameMap[gameKey] || gameKey.toUpperCase();

        if (!allFetchedCodes[gameKey] || allFetchedCodes[gameKey].length === 0) {
            codesDisplayArea.innerHTML = `<div class="info-card animate-in" style="text-align: center; padding: 30px;">
                                              <h3>No codes available for ${displayGameName} at the moment.</h3>
                                              <p>Check back later or try another game!</p>
                                          </div>`;
            return;
        }

        const section = document.createElement('section');
        section.id = gameKey;
        section.classList.add('game-section');

        const h2 = document.createElement('h2');
        h2.textContent = `${displayGameName} Codes`;
        section.appendChild(h2);

        const codeListDiv = document.createElement('div');
        codeListDiv.classList.add('code-list');

        const sortedCodes = [...allFetchedCodes[gameKey]].sort((a, b) => b.added_at - a.added_at); // Sort by added_at descending
        sortedCodes.forEach(codeData => {
            const codeItem = document.createElement('div');
            codeItem.classList.add('code-item');

            const codeTitle = document.createElement('h3');
            codeTitle.textContent = codeData.code;
            codeItem.appendChild(codeTitle);

            const description = document.createElement('p');
            description.textContent = codeData.description || 'No description provided.';
            codeItem.appendChild(description);

            const addedAt = document.createElement('p');
            addedAt.innerHTML = `<strong>Added:</strong> ${formatTimestampForDisplay(codeData.added_at)}`;
            codeItem.appendChild(addedAt);

            const redeemLink = document.createElement('a');
            redeemLink.href = getRedemptionUrl(gameKey, codeData.code);
            redeemLink.target = '_blank';
            redeemLink.rel = 'noopener noreferrer'; // Added for security
            redeemLink.textContent = 'Redeem Code';
            codeItem.appendChild(redeemLink);

            codeListDiv.appendChild(codeItem);
        });
        section.appendChild(codeListDiv);
        codesDisplayArea.appendChild(section);

        // Push AdSense ads again if they are in the visible area
        if (typeof window.adsbygoogle !== 'undefined') {
            window.adsbygoogle.push({});
        }
    }

    function checkForNewCodes(newData) {
        let newCodesFound = false;
        let affectedGames = [];

        for (const gameKey in newData) {
            if (lastKnownCodes[gameKey]) {
                const oldCodes = new Set(lastKnownCodes[gameKey].map(code => JSON.stringify(code)));
                const currentCodes = newData[gameKey];

                const newlyAdded = currentCodes.filter(code => !oldCodes.has(JSON.stringify(code)));

                if (newlyAdded.length > 0) {
                    newCodesFound = true;
                    const gameNameMap = {
                        'genshin': 'Genshin Impact',
                        'hsr': 'Honkai: Star Rail',
                        'zzz': 'Zenless Zone Zero'
                    };
                    affectedGames.push(gameNameMap[gameKey] || gameKey.toUpperCase());
                }
            }
        }

        if (newCodesFound) {
            updatesText.textContent = `New code(s) added to: ${affectedGames.join(', ')}!`;
            updatesBar.classList.add('show'); // Use 'show' class
            setTimeout(() => {
                updatesBar.classList.remove('show'); // Hide after a few seconds
            }, 8000); // Display for 8 seconds
        }
        lastKnownCodes = JSON.parse(JSON.stringify(newData)); // Deep copy for comparison
    }

    async function fetchAndProcessCodes() {
        showLoadingState();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            updateLastCheckedTime(); // Update time regardless of data change

            if (data.retcode !== 0) {
                showErrorMessage(data.message || 'API returned an error. Please try again later.');
                return;
            }

            // Check for new codes BEFORE updating allFetchedCodes
            if (lastFetchedData) { // Only check if this isn't the first load
                checkForNewCodes(data);
            }

            const currentDataString = JSON.stringify(data);
            if (currentDataString === lastFetchedData) {
                console.log('No new codes. Skipping DOM update.');
                if (currentSelectedGame) {
                    displayCodesForGame(currentSelectedGame);
                } else {
                    showSelectGamePrompt();
                }
                return; // Exit if no data change
            }

            lastFetchedData = currentDataString;
            allFetchedCodes = data;
            console.log('New codes detected or first load. Updating DOM.');

            if (currentSelectedGame) {
                displayCodesForGame(currentSelectedGame);
            } else {
                showSelectGamePrompt(); // Show prompt if no game selected
            }

        } catch (error) {
            console.error('Error fetching codes:', error);
            showErrorMessage('Could not load codes. Please check your internet connection or try again later.');
        } finally {
            loadingState.classList.add('hidden'); // Ensure skeleton is hidden after fetch attempt
        }
    }

    let isMusicPlaying = false;
    musicToggleBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> Play Music';
        } else {
            backgroundMusic.muted = false; // Unmute before playing
            backgroundMusic.play().then(() => {
                console.log('Music started playing');
                musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Pause Music';
            }).catch(error => {
                console.error('Failed to play music:', error);
                alert('Your browser may be preventing automatic music playback. Please allow media autoplay for this site, or interact with the page more, then try again.');
                musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> Play Music (Blocked)';
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });

    let isDarkMode;
    const savedTheme = localStorage.getItem('theme');

    function setTheme(theme) {
        if (theme === 'light-mode') {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            isDarkMode = false;
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            isDarkMode = true;
        }
        localStorage.setItem('theme', theme);
    }

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('dark-mode'); // Default to dark mode
    }

    themeToggleBtn.addEventListener('click', () => {
        if (isDarkMode) {
            setTheme('light-mode');
        } else {
            setTheme('dark-mode');
        }
    });

    gameFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            gameFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const game = button.dataset.game;
            currentSelectedGame = game;
            hideAllContentSections(); // Hide all other sections
            displayCodesForGame(game); // Show codes for selected game
        });
    });

    // Initial fetch when the page loads
    fetchAndProcessCodes();

    // Set interval for refreshing codes (every 10 minutes)
    setInterval(fetchAndProcessCodes, 10 * 60 * 1000);
});
