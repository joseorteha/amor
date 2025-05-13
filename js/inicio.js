document.addEventListener('DOMContentLoaded', function() {
    // CONFIGURACIÓN PRINCIPAL
    const DEV_MODE = true; // Cambiado a true para forzar la visualización

    // Elementos del DOM
    const welcomeMessage = document.getElementById('welcome-message');
    const continueBtn = document.getElementById('continue-btn');
    const loginForm = document.getElementById('login-form');

    // Lógica de visualización INFALIBLE
    if (DEV_MODE) {
        // Modo desarrollo
        showWelcomeMessage();
        createResetButton();
    } else {
        // Modo producción - Sistema mejorado
        if (!sessionStorage.getItem('welcomeShown') && !localStorage.getItem('welcomeShown')) {
            showWelcomeMessage();
            sessionStorage.setItem('welcomeShown', 'true');
            localStorage.setItem('welcomeShown', 'true');
        }
    }

    // Función para mostrar animación
    function showWelcomeMessage() {
        welcomeMessage.style.display = 'flex';
        welcomeMessage.style.opacity = '1';
        createCelebrationEffects(); // Corazones suaves subiendo

        continueBtn.addEventListener('click', function() {
            welcomeMessage.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => {
                welcomeMessage.style.display = 'none';
            }, 1000);
        });
    }

    // Botón de reset (solo en desarrollo)
    function createResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-button';
        resetBtn.textContent = 'Resetear Animación';
        resetBtn.addEventListener('click', function() {
            sessionStorage.removeItem('welcomeShown');
            localStorage.removeItem('welcomeShown');
            location.reload();
        });
        document.body.appendChild(resetBtn);
    }

    // Validación de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username === 'Ingrid' && password === '11012023') {
            window.location.href = '/html/inicio.html';
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Ups, parece que algo no es correcto. Intenta de nuevo mi amor ❤️';
            setTimeout(() => {
                errorMessage.style.display = 'none';
                document.getElementById('password').value = '';
            }, 3000);
        }
    });

    // NAVBAR HAMBURGUESA RESPONSIVE
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('open');
    });
    // Cerrar menú al hacer clic en un enlace (en móvil)
    navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 800) navUl.classList.remove('open');
        });
    });
});

// Función de efectos de celebración (corazones suaves subiendo)
function createCelebrationEffects() {
    const welcomeMessage = document.getElementById('welcome-message');
    // Eliminar corazones anteriores si existen
    const oldParticles = document.querySelectorAll('.heart-particle');
    oldParticles.forEach(p => p.remove());
    // Colores suaves para los corazones
    const heartColors = ['#e75480', '#ffb6c1', '#ffd700', '#b85c9e', '#c1eaff', '#ff69b4'];
    // Crear partículas de corazones flotando
    for (let i = 0; i < 24; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-40px';
        heart.style.fontSize = (Math.random() * 24 + 24) + 'px';
        heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        heart.style.animationDelay = (Math.random() * 4) + 's';
        heart.style.opacity = (Math.random() * 0.3 + 0.5).toFixed(2);
        welcomeMessage.appendChild(heart);
    }
}