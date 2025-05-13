document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const dateDescription = document.getElementById('date-description');
    const addDateBtn = document.getElementById('add-date-btn');
    const datesList = document.getElementById('dates-list');

    // Cargar fechas guardadas
    loadDates();

    // Evento para agregar nueva fecha
    addDateBtn.addEventListener('click', () => {
        const date = dateInput.value;
        const description = dateDescription.value.trim();

        if (date && description) {
            addDate(date, description);
            dateInput.value = '';
            dateDescription.value = '';
        }
    });

    function addDate(date, description) {
        const dates = getDates();
        dates.push({ date, description });
        localStorage.setItem('importantDates', JSON.stringify(dates));
        renderDates();
    }

    function getDates() {
        const dates = localStorage.getItem('importantDates');
        return dates ? JSON.parse(dates) : [];
    }

    function loadDates() {
        renderDates();
    }

    function renderDates() {
        const dates = getDates();
        datesList.innerHTML = '';

        dates.forEach((item, index) => {
            const dateCard = document.createElement('div');
            dateCard.className = 'date-card';
            
            const formattedDate = new Date(item.date + 'T00:00:00').toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'America/Mexico_City'
            });

            dateCard.innerHTML = `
                <div class="date-info">
                    <h3>${formattedDate}</h3>
                    <p>${item.description}</p>
                </div>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;

            datesList.appendChild(dateCard);
        });

        // Agregar eventos de eliminación
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deleteDate(index);
            });
        });
    }

    function deleteDate(index) {
        const dates = getDates();
        dates.splice(index, 1);
        localStorage.setItem('importantDates', JSON.stringify(dates));
        renderDates();
    }
}); 