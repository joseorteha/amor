// Variables globales
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const notesContainer = document.getElementById('notes-container');
const specialMessage = document.getElementById('special-message');
const gameMusic = document.getElementById('game-music');
const eatSound = document.getElementById('eat-sound');

// Configuración del juego
let config = {
    theme: 'dark',
    difficulty: 'easy'
};

// Estado del juego
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameInterval;
let gameSpeed;

// Tamaños y constantes
let cellSize = 20; // Tamaño base, se ajustará dinámicamente
let gridWidth, gridHeight;

// Músicas predefinidas
const musicTracks = {
    easy: '/music/facil.mp3',
    medium: '/music/Married Life.mp3',
    hard: '/music/Eloin.mp3'
};

// Mensajes especiales
const specialMessages = [
    "Hola mi amor 💕",
    "¿Ya me extrañabas? 😚",
    "Cada vez lo haces mejor 😍",
    "Me tienes pensando en ti ✨",
    "Te ves tan linda jugando 😳",
    "No dejes de avanzar 💪",
    "Estoy orgullosa de ti ❤️",
    "Eres increíble 😍",
    "Quiero abrazarte ",
    "Algunso dias sueño contigo 🌙",
    "Son sueños... bonitos 😏",
    "No dejo de pensarte 💭",
    "Eres mi jugadora favorita 🎮",
    "Uy, me encantas 😳",
    "Solo tú me haces sentir así 💓",
    "Estás brillando ✨",
    "No te vayas muy lejos 🥺",
    "Tus logros me enamoran 💘",
    "Me das maripositas 🦋",
    "Contigo todo es lindo 💫",
    "Quiero darte un besito 😚",
    "Estás desbloqueando mi corazón 🔐",
    "¿Podemos quedarnos aquí? 💌",
    "Cada avance es más amor 💞",
    "Te pienso más de lo que crees 🙈",
    "No pares, me gusta verte así 😍",
    "Eres mi momento favorito 🕒❤️",
    "Tú me haces bien 🥰",
    "¿Jugamos a enamorarnos? 😉",
    "Game over... si no estás 💔",
    "Veamos si puedes completar el juego?😚"
];

// Inicialización del juego
function init() {
    setupEventListeners();
    setupThemeButtons();
    setupDifficultyButtons();
    setupMusicControls();
    setupMobileControls();
    
    // Configurar música
    gameMusic.loop = true;
    setDifficulty('easy');
    
    // Ajustar canvas para responsive
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    // Precargar sonido de comer
    if(eatSound) {
        eatSound.volume = 0.3;
        eatSound.load();
    }
}

function setupCanvas() {
    // Tamaño base para desktop
    let canvasWidth = 600;
    let canvasHeight = 400;
    
    // Ajustar para móviles en orientación vertical
    if (window.innerWidth <= 768 || window.innerHeight > window.innerWidth) {
        const maxWidth = window.innerWidth - 40; // Margen de 20px a cada lado
        const maxHeight = window.innerHeight * 0.6; // Máximo 60% de la altura
        
        // Mantener relación de aspecto 3:2 (600:400)
        const aspectRatio = 3/2;
        
        if (maxWidth / aspectRatio > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = canvasHeight * aspectRatio;
        } else {
            canvasWidth = maxWidth;
            canvasHeight = canvasWidth / aspectRatio;
        }
    }
    
    // Aplicar nuevos tamaños
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Calcular tamaño de celda dinámico (mínimo 15px)
    cellSize = Math.max(15, Math.floor(canvasWidth / 30));
    
    // Actualizar dimensiones de la cuadrícula
    gridWidth = Math.floor(canvas.width / cellSize);
    gridHeight = Math.floor(canvas.height / cellSize);
    
    // Redibujar si el juego está en curso
    if (!gameScreen.classList.contains('hidden')) {
        drawGame();
    }
}

// Dibujar todo el juego (para redimensionamiento)
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', resetGame);
    document.getElementById('exit-btn').addEventListener('click', exitGame);
    document.getElementById('play-again-btn').addEventListener('click', resetGame);
    document.getElementById('menu-btn').addEventListener('click', exitGame);
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = '/html/inicio.html';
    });
    document.addEventListener('keydown', handleKeyPress);
}

// Configurar botones de tema
function setupThemeButtons() {
    document.getElementById('theme-dark').addEventListener('click', () => setTheme('dark'));
    document.getElementById('theme-love').addEventListener('click', () => setTheme('love'));
    document.getElementById('theme-emerald').addEventListener('click', () => setTheme('emerald'));
}

// Configurar botones de dificultad
function setupDifficultyButtons() {
    document.getElementById('difficulty-easy').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('difficulty-medium').addEventListener('click', () => setDifficulty('medium'));
    document.getElementById('difficulty-hard').addEventListener('click', () => setDifficulty('hard'));
}

// Configurar controles de música
function setupMusicControls() {
    document.getElementById('play-music').addEventListener('click', () => {
        gameMusic.play().catch(e => console.log("Error al reproducir música:", e));
    });
    
    document.getElementById('stop-music').addEventListener('click', () => {
        gameMusic.pause();
    });
}

// Configurar controles móviles
function setupMobileControls() {
    document.getElementById('up-btn').addEventListener('click', () => { if (direction !== 'down') nextDirection = 'up'; });
    document.getElementById('left-btn').addEventListener('click', () => { if (direction !== 'right') nextDirection = 'left'; });
    document.getElementById('down-btn').addEventListener('click', () => { if (direction !== 'up') nextDirection = 'down'; });
    document.getElementById('right-btn').addEventListener('click', () => { if (direction !== 'left') nextDirection = 'right'; });
}

// Cambiar tema
function setTheme(theme) {
    config.theme = theme;
    document.body.className = `theme-${theme}`;
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`theme-${theme}`).classList.add('selected');
}

// Cambiar dificultad
function setDifficulty(difficulty) {
    config.difficulty = difficulty;
    switch(difficulty) {
        case 'easy': 
            gameSpeed = 150; 
            gameMusic.src = musicTracks.easy;
            break;
        case 'medium': 
            gameSpeed = 100; 
            gameMusic.src = musicTracks.medium;
            break;
        case 'hard': 
            gameSpeed = 70; 
            gameMusic.src = musicTracks.hard;
            break;
    }
    document.querySelectorAll('.option-btn[id^="difficulty"]').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`difficulty-${difficulty}`).classList.add('selected');
    
    // Reproducir música automáticamente al cambiar dificultad
    gameMusic.play().catch(e => console.log("Error al reproducir música:", e));
}

// Iniciar juego
function startGame() {
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Asegurar que el canvas tenga el tamaño correcto
    setupCanvas();
    
    // Mostrar controles móviles solo si es necesario
    if (window.innerWidth <= 768) {
        document.querySelector('.mobile-controls').style.display = 'grid';
    } else {
        document.querySelector('.mobile-controls').style.display = 'none';
    }
    
    gameMusic.play().catch(e => console.log("Error al reproducir música:", e));
    
    resetGame();
}

// Reiniciar juego
function resetGame() {
    clearInterval(gameInterval);
    
    // Asegurarse de que las dimensiones estén actualizadas
    setupCanvas();
    
    // Limpiar el array de la serpiente
    snake = [];
    
    // Iniciar la serpiente en el centro del grid
    // Nota: Asegurar que la serpiente esté dentro de los límites del grid
    const startX = Math.floor(gridWidth / 4);
    const startY = Math.floor(gridHeight / 2);
    
    // Verificar que los valores iniciales son válidos
    console.log(`Grid: ${gridWidth}x${gridHeight}, Snake start: ${startX},${startY}`);
    
    // Crear la serpiente inicial (4 segmentos)
    for (let i = 0; i < 4; i++) {
        // Asegurarse de que los segmentos iniciales estén dentro del grid
        if (startX - i >= 0) {
            snake.push({ x: startX - i, y: startY });
        } else {
            // Si está fuera de los límites, ajustar
            snake.push({ x: 0, y: startY });
        }
    }
    
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    
    // Limpiar mensajes y notas previas
    notesContainer.innerHTML = '';
    
    // Asegurarse de limpiar cualquier mensaje del game over anterior
    const existingMessages = gameOverScreen.querySelector('div[style*="margin-top: 20px"]');
    if (existingMessages) {
        existingMessages.remove();
    }
    
    // Generar comida antes de iniciar el bucle
    generateFood();
    
    // Dibujar el estado inicial una vez antes de iniciar el intervalo
    drawGame();
    
    // Iniciar el bucle del juego
    gameInterval = setInterval(gameLoop, gameSpeed);
    
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

// Salir del juego
function exitGame() {
    clearInterval(gameInterval);
    gameMusic.pause();
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
}

// Generar comida
function generateFood() {
    let foodX, foodY;
    let validPosition = false;
    
    // Máximo número de intentos para evitar bucles infinitos
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!validPosition && attempts < maxAttempts) {
        foodX = Math.floor(Math.random() * (gridWidth - 1));  // -1 para evitar el borde derecho
        foodY = Math.floor(Math.random() * (gridHeight - 1)); // -1 para evitar el borde inferior
        
        // Asegurarse de que no sea negativo
        foodX = Math.max(0, foodX);
        foodY = Math.max(0, foodY);
        
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === foodX && segment.y === foodY) {
                validPosition = false;
                break;
            }
        }
        attempts++;
    }
    
    // Si no se encontró una posición válida, usar una posición segura
    if (!validPosition) {
        // Encontrar una posición que sabemos que está libre
        const usedPositions = new Set(snake.map(seg => `${seg.x},${seg.y}`));
        
        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                if (!usedPositions.has(`${x},${y}`)) {
                    foodX = x;
                    foodY = y;
                    validPosition = true;
                    break;
                }
            }
            if (validPosition) break;
        }
    }
    
    food = { x: foodX, y: foodY };
    console.log(`Food generated at: ${foodX},${foodY}`);
}

// Manejar teclas
function handleKeyPress(e) {
    if (gameScreen.classList.contains('hidden')) return;
    
    switch(e.key) {
        case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
    }
}

// Dibujar serpiente
function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Cabeza
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
            
            // Ojos
            ctx.fillStyle = '#000';
            const eyeSize = cellSize / 5;
            
            let leftEye = { x: 0, y: 0 };
            let rightEye = { x: 0, y: 0 };
            
            switch(direction) {
                case 'up':
                    leftEye = { x: segment.x * cellSize + cellSize/4, y: segment.y * cellSize + cellSize/4 };
                    rightEye = { x: segment.x * cellSize + cellSize*3/4 - eyeSize, y: segment.y * cellSize + cellSize/4 };
                    break;
                case 'down':
                    leftEye = { x: segment.x * cellSize + cellSize/4, y: segment.y * cellSize + cellSize*3/4 - eyeSize };
                    rightEye = { x: segment.x * cellSize + cellSize*3/4 - eyeSize, y: segment.y * cellSize + cellSize*3/4 - eyeSize };
                    break;
                case 'left':
                    leftEye = { x: segment.x * cellSize + cellSize/4, y: segment.y * cellSize + cellSize/4 };
                    rightEye = { x: segment.x * cellSize + cellSize/4, y: segment.y * cellSize + cellSize*3/4 - eyeSize };
                    break;
                case 'right':
                    leftEye = { x: segment.x * cellSize + cellSize*3/4 - eyeSize, y: segment.y * cellSize + cellSize/4 };
                    rightEye = { x: segment.x * cellSize + cellSize*3/4 - eyeSize, y: segment.y * cellSize + cellSize*3/4 - eyeSize };
                    break;
            }
            
            ctx.fillRect(leftEye.x, leftEye.y, eyeSize, eyeSize);
            ctx.fillRect(rightEye.x, rightEye.y, eyeSize, eyeSize);
        } else {
            // Cuerpo
            ctx.fillStyle = '#fff';
            ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
        }
    });
}

// Dibujar comida
function drawFood() {
    if (!food || typeof food.x === 'undefined' || typeof food.y === 'undefined') {
        console.error("Error: Food object is invalid", food);
        generateFood(); // Regenerar si hay un problema
        return;
    }
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    
    ctx.fillStyle = '#ff69b4';
    const centerX = food.x * cellSize + cellSize/2;
    const centerY = food.y * cellSize + cellSize/2;
    const size = cellSize/2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + size/4);
    ctx.bezierCurveTo(centerX, centerY, centerX - size/2, centerY, centerX - size/2, centerY - size/4);
    ctx.bezierCurveTo(centerX - size/2, centerY - size/2, centerX, centerY - size/2, centerX, centerY - size/4);
    ctx.bezierCurveTo(centerX, centerY - size/2, centerX + size/2, centerY - size/2, centerX + size/2, centerY - size/4);
    ctx.bezierCurveTo(centerX + size/2, centerY, centerX, centerY, centerX, centerY + size/4);
    ctx.fill();
}

// Mover serpiente
function moveSnake() {
    direction = nextDirection;
    const head = { x: snake[0].x, y: snake[0].y };
    
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Detectar colisión con bordes
    if (head.x < 0 || head.y < 0 || head.x >= gridWidth || head.y >= gridHeight) {
        console.log(`Game over: Hit border at ${head.x},${head.y}, grid is ${gridWidth}x${gridHeight}`);
        gameOver();
        return;
    }
    
    // Detectar colisión consigo misma (solo después del cuarto segmento)
    // No revisar los primeros segmentos porque siempre habrá colisión con la nueva cabeza
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            console.log(`Game over: Self collision at ${head.x},${head.y}`);
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Detectar si comió
    if (head.x === food.x && head.y === food.y) {
        // Sonido al comer
        if(eatSound) {
            eatSound.currentTime = 0;
            eatSound.play().catch(e => console.log("Error al reproducir sonido:", e));
        }
        
        score++;
        scoreElement.textContent = score;
        
        createNote(head.x, head.y);
        
        if (score % 6 === 0) {
            showSpecialMessage(score);
        }
        
        generateFood();
    } else {
        snake.pop();
    }
}

// Crear nota flotante
function createNote(x, y) {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = '❤️';
    note.style.left = `${x * cellSize + cellSize/2}px`;
    note.style.top = `${y * cellSize}px`;
    notesContainer.appendChild(note);
    setTimeout(() => note.remove(), 2000);
}

// Mostrar mensaje especial
function showSpecialMessage(currentScore) {
    const messageIndex = Math.floor(currentScore / 6) - 1;
    if (messageIndex < specialMessages.length) {
        specialMessage.textContent = specialMessages[messageIndex];
        specialMessage.classList.remove('hidden');
        setTimeout(() => specialMessage.classList.add('hidden'), 3000);
    }
}

// Game over
function gameOver() {
    if (score === 186) { // Cambio de 596 a 186 para que sea más alcanzable
        specialMessage.textContent = "¡Increíble! Dominaste el juego por completo ❤️ Has llegado al final, y aún así, quiero seguir jugando a tu lado. Gracias por compartir cada paso, cada risa y cada momento conmigo. ¿Sabes una cosa...? Quieres casarte conmigo?";
        specialMessage.classList.remove('hidden');
    }
    
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    
    // Limpiar mensajes anteriores si existen
    const previousMessages = gameOverScreen.querySelector('div[style*="margin-top: 20px"]');
    if (previousMessages) {
        previousMessages.remove();
    }
    
    // Mostrar todos los mensajes recolectados
    const collectedMessages = specialMessages.slice(0, Math.floor(score / 6));
    if (collectedMessages.length > 0) {
        const messagesContainer = document.createElement('div');
        messagesContainer.style.marginTop = '20px';
        messagesContainer.style.fontSize = '1.2rem';
        messagesContainer.style.color = '#fff';
        messagesContainer.style.textAlign = 'center';
        messagesContainer.style.padding = '15px';
        messagesContainer.style.borderRadius = '10px';
        messagesContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        messagesContainer.innerHTML = '<h3 style="margin-bottom:10px;">Mensajes recolectados:</h3>' + 
            collectedMessages.map(msg => `<p style="margin:8px 0;">• ${msg}</p>`).join('');
        
        const buttons = gameOverScreen.querySelector('.buttons');
        gameOverScreen.insertBefore(messagesContainer, buttons);
    }
    
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Bucle principal del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
}

// Iniciar juego al cargar
window.addEventListener('load', init);