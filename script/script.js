// Function to load game data from JSON file (API-style call)
async function loadGameData() {
    const apiUrl = './json/games.json';
    
    try {
        console.log('Fetching game data from API...');
        
        // Make API call with proper headers
        const response = await fetch(apiUrl);
        const gamesData = await response.json();
        
        // Update Gunnar's Game
        if (gamesData.gunnarGame) {
            updateGameCard('gunnar', gamesData.gunnarGame);
        }
        
        // Update Jace's Game
        if (gamesData.jaceGame) {
            updateGameCard('jace', gamesData.jaceGame);
        }
        
    } catch (error) {
        console.error('Error loading game data:', error);
        // Fallback to default data (simulating cached data)
        console.log('Loading fallback data...');
        const fallbackData = {
            gunnarGame: {
                title: "Gunnar's Game",
                description: "An exciting adventure awaits! (Offline Mode)",
                thumbnail: "assets/game-thumb.jpg",
                gameUrl: "https://gunnar-schmidtt.github.io/project-bravo/"
            },
            jaceGame: {
                title: "Jace's Game", 
                description: "Challenge yourself with this amazing game! (Offline Mode)",
                thumbnail: "assets/game-thumb.png",
                gameUrl: "https://jcalvert22.github.io/project-bravo/"
            }
        };
        
        // Update Gunnar's Game
        if (fallbackData.gunnarGame) {
            updateGameCard('gunnar', fallbackData.gunnarGame);
        }
        
        // Update Jace's Game
        if (fallbackData.jaceGame) {
            updateGameCard('jace', fallbackData.jaceGame);
        }
    }
}

// Function to update individual game cards
function updateGameCard(gamePrefix, gameData) {
    const titleElement = document.getElementById(`${gamePrefix}GameTitle`);
    const descriptionElement = document.getElementById(`${gamePrefix}GameDescription`);
    const imageElement = document.getElementById(`${gamePrefix}GameImg`);
    const buttonElement = document.getElementById(`${gamePrefix}GameBtn`);
    
    if (titleElement) titleElement.textContent = gameData.title;
    if (descriptionElement) descriptionElement.textContent = gameData.description;
    if (imageElement && gameData.thumbnail) {
        imageElement.src = gameData.thumbnail;
        imageElement.alt = `${gameData.title} Thumbnail`;
    }
    if (buttonElement && gameData.gameUrl) {
        buttonElement.onclick = () => window.open(gameData.gameUrl, '_blank');
    }
}

// Cookie management functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Favorite functionality
function toggleFavorite(gameId) {
    const favoriteBtn = document.getElementById(`${gameId}FavoriteBtn`);
    const heartIcon = favoriteBtn.querySelector('.heart-icon');
    const isFavorited = favoriteBtn.classList.contains('favorited');
    const cardElement = favoriteBtn.closest('.col-md-6');
    
    if (isFavorited) {
        // Remove from favorites
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.title = 'Add to favorites';
        heartIcon.textContent = '♡';
        cardElement.classList.remove('favorited-card');
        setCookie(`${gameId}_favorite`, 'false', 365);
    } else {
        // Add to favorites
        favoriteBtn.classList.add('favorited');
        favoriteBtn.title = 'Remove from favorites';
        heartIcon.textContent = '♥';
        cardElement.classList.add('favorited-card');
        setCookie(`${gameId}_favorite`, 'true', 365);
    }
    
    // Reorder cards
    reorderCards();
}

// Function to reorder cards based on favorite status
function reorderCards() {
    const container = document.getElementById('gameContainer');
    const cards = Array.from(container.children);
    
    // Sort cards: favorited first, then by original order
    cards.sort((a, b) => {
        const aFavorited = a.classList.contains('favorited-card');
        const bFavorited = b.classList.contains('favorited-card');
        
        if (aFavorited && !bFavorited) return -1;
        if (!aFavorited && bFavorited) return 1;
        return 0;
    });
    
    // Reappend cards in new order
    cards.forEach(card => container.appendChild(card));
}

// Load favorite status from cookies
function loadFavoriteStatus() {
    const games = ['gunnar', 'jace'];
    
    games.forEach(gameId => {
        const favoriteStatus = getCookie(`${gameId}_favorite`);
        const favoriteBtn = document.getElementById(`${gameId}FavoriteBtn`);
        const heartIcon = favoriteBtn.querySelector('.heart-icon');
        const cardElement = favoriteBtn.closest('.col-md-6');
        
        if (favoriteStatus === 'true') {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.title = 'Remove from favorites';
            heartIcon.textContent = '♥';
            cardElement.classList.add('favorited-card');
        } else {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.title = 'Add to favorites';
            heartIcon.textContent = '♡';
            cardElement.classList.remove('favorited-card');
        }
        
        // Add click event listener
        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(gameId);
        });
    });
    
    // Initial reorder based on loaded favorites
    reorderCards();
}

// Load game data and favorites when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    loadFavoriteStatus();
});
