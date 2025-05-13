document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const addTextBtn = document.getElementById('add-text-btn');
    const textsList = document.getElementById('texts-list');

    // Cargar textos guardados
    loadTexts();

    // Evento para agregar nuevo texto
    addTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();

        if (text) {
            addText(text);
            textInput.value = '';
        }
    });

    function addText(text) {
        const texts = getTexts();
        texts.push({ text, date: new Date().toISOString() });
        localStorage.setItem('loveTexts', JSON.stringify(texts));
        renderTexts();
    }

    function getTexts() {
        const texts = localStorage.getItem('loveTexts');
        return texts ? JSON.parse(texts) : [];
    }

    function loadTexts() {
        renderTexts();
    }

    function renderTexts() {
        const texts = getTexts();
        textsList.innerHTML = '';

        texts.forEach((item, index) => {
            const textCard = document.createElement('div');
            textCard.className = 'text-card';
            
            const date = new Date(item.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            textCard.innerHTML = `
                <div class="text-content">${item.text}</div>
                <div class="text-date">${date}</div>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;

            textsList.appendChild(textCard);
        });

        // Agregar eventos de eliminación
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deleteText(index);
            });
        });
    }

    function deleteText(index) {
        const texts = getTexts();
        texts.splice(index, 1);
        localStorage.setItem('loveTexts', JSON.stringify(texts));
        renderTexts();
    }
}); 