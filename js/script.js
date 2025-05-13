document.addEventListener('DOMContentLoaded', function() {
    // Configuración
    const MAX_PHOTOS = 200;
    const MAX_IMAGE_SIZE_MB = 3; // Comprimir imágenes mayores a 3MB
    
    // Variables para almacenar los datos
    let photos = JSON.parse(localStorage.getItem('tuyyo-photos')) || [];
    let texts = JSON.parse(localStorage.getItem('tuyyo-texts')) || [];
    let dates = JSON.parse(localStorage.getItem('tuyyo-dates')) || [];
    
    // Elementos del DOM
    const photoUpload = document.getElementById('photo-upload');
    const photoDescription = document.getElementById('photo-description');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const photoGallery = document.getElementById('photo-gallery');
    const loveText = document.getElementById('love-text');
    const publishTextBtn = document.getElementById('publish-text-btn');
    const textPosts = document.getElementById('text-posts');
    const eventName = document.getElementById('event-name');
    const eventDate = document.getElementById('event-date');
    const addDateBtn = document.getElementById('add-date-btn');
    const importantDates = document.getElementById('important-dates');
    
    // Crear elementos para el modal de imagen
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img class="modal-content" id="modal-image">
        <div class="modal-caption"></div>
    `;
    document.body.appendChild(modal);
    // Cargar datos existentes
    renderPhotos();
    renderTexts();
    renderDates();
    
    // Event Listeners
    addPhotoBtn.addEventListener('click', addPhoto);
    publishTextBtn.addEventListener('click', publishText);
    addDateBtn.addEventListener('click', addDate);
    photoUpload.addEventListener('click', function() { this.value = ''; });

     // Event listeners para el modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // MODALES
    const modalLinks = document.querySelectorAll('nav ul li a[data-modal]');
    const modals = document.querySelectorAll('.modal-section');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const body = document.body;

    // NO renderizar nada al cargar la página
    // NO llamar a renderPhotos(), renderTexts(), renderDates() aquí

    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeAllModals();
        });
    });

    function openModal(modalId) {
        closeAllModals();
        const modal = document.getElementById('modal-' + modalId);
        if (modal) {
            modal.classList.add('active');
            body.classList.add('modal-open');
            // Cargar contenido dinámico si es necesario
            if (modalId === 'recuerdos') renderRecuerdos();
            if (modalId === 'palabras') renderPalabras();
            if (modalId === 'fechas') renderFechas();
            if (modalId === 'palabras-ti') cargarPalabrasTi();
            if (modalId === 'juego') cargarJuego();
        }
    }
    function closeAllModals() {
        modals.forEach(m => m.classList.remove('active'));
        body.classList.remove('modal-open');
    }

    // ==================== FUNCIONES PARA FOTOS EN MODAL ====================
    function renderRecuerdos() {
        document.getElementById('modal-recuerdos-content').innerHTML = `
            <h2>Nuestros Recuerdos</h2>
            <div class="upload-area">
                <input type="file" id="photo-upload" accept="image/*" multiple>
                <label for="photo-upload" class="upload-button">Subir Fotos</label>
                <input type="text" id="photo-description" placeholder="Añade una descripción...">
                <button id="add-photo-btn" type="button">Agregar Foto</button>
            </div>
            <div id="photo-gallery" class="gallery"></div>
        `;
        // Reasignar eventos y renderizar galería
        document.getElementById('add-photo-btn').addEventListener('click', addPhoto);
        document.getElementById('photo-upload').addEventListener('click', function() { this.value = ''; });
        renderPhotos();
    }
    // ==================== FUNCIONES PARA TEXTOS EN MODAL ====================
    function renderPalabras() {
        document.getElementById('modal-palabras-content').innerHTML = `
            <h2>Palabras de Amor</h2>
            <div class="text-input-area">
                <textarea id="love-text" placeholder="Escribe aquí lo que no debemos olvidar, lo que sentimos, o lo que quieras decirme..."></textarea>
                <button id="publish-text-btn" type="button">Publicar</button>
            </div>
            <div id="text-posts" class="posts-container"></div>
        `;
        document.getElementById('publish-text-btn').addEventListener('click', publishText);
        renderTexts();
    }
    // ==================== FUNCIONES PARA FECHAS EN MODAL ====================
    function renderFechas() {
        document.getElementById('modal-fechas-content').innerHTML = `
            <h2>Fechas Importantes</h2>
            <div class="date-input-area">
                <input type="text" id="event-name" placeholder="Nombre del evento">
                <input type="date" id="event-date">
                <button id="add-date-btn" type="button">Añadir Fecha</button>
            </div>
            <div id="important-dates" class="dates-container"></div>
        `;
        document.getElementById('add-date-btn').addEventListener('click', addDate);
        renderDates();
    }
    // ==================== RESTO DE MODALES ====================
    function cargarPalabrasTi() {
        document.getElementById('modal-palabras-ti-content').innerHTML = `
            <h2>Palabras para ti</h2>
            <p>Un espacio solo para ti, Ingrid.</p>
            <!-- Aquí puedes insertar mensajes personalizados -->
        `;
    }
    function cargarJuego() {
        document.getElementById('modal-juego-content').innerHTML = `
            <h2>Juego</h2>
            <p>¡Diviértete con nuestro juego especial!</p>
            <!-- Aquí puedes insertar el juego o enlace -->
        `;
    }
    
    // ==================== FUNCIONES PARA FOTOS ====================
    async function addPhoto() {
        if (window.isProcessingPhotos) {
            showAlert('El sistema está procesando fotos, por favor espera', 'warning');
            return;
        }
        
        const files = photoUpload.files;
        const description = photoDescription.value.trim();
        
        // Validaciones
        if (!files || files.length === 0) {
            showAlert('Por favor selecciona al menos una foto', 'error');
            return;
        }
        
        if (photos.length >= MAX_PHOTOS) {
            showAlert(`Has alcanzado el límite de ${MAX_PHOTOS} fotos. Elimina algunas antes de agregar más.`, 'error');
            return;
        }
        
        // Calcular espacio disponible
        const availableSlots = MAX_PHOTOS - photos.length;
        const filesToProcess = Array.from(files).slice(0, availableSlots);
        
        if (files.length > availableSlots) {
            showAlert(`Solo se subirán ${availableSlots} de ${files.length} fotos (límite: ${MAX_PHOTOS})`, 'warning');
        }
        
        // Iniciar procesamiento
        window.isProcessingPhotos = true;
        toggleLoadingState(true);
        
        let processedCount = 0;
        let successfulUploads = 0;
        
        for (const file of filesToProcess) {
            try {
                const processedFile = await processImageFile(file);
                const photoData = {
                    id: Date.now() + processedCount,
                    src: processedFile.dataUrl,
                    description: description || "Nuestro momento especial",
                    date: new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    size: processedFile.size
                };
                
                photos.push(photoData);
                successfulUploads++;
            } catch (error) {
                console.error('Error procesando imagen:', error);
                showAlert(`Error al procesar ${file.name}`, 'error');
            } finally {
                processedCount++;
            }
        }
        
        // Finalizar proceso
        localStorage.setItem('tuyyo-photos', JSON.stringify(photos));
        renderPhotos();
        resetUploadForm();
        
        if (successfulUploads > 0) {
            const remainingSlots = MAX_PHOTOS - photos.length;
            const message = remainingSlots > 0 
                ? `¡${successfulUploads} foto(s) subidas! (Puedes agregar ${remainingSlots} más)`
                : `¡${successfulUploads} foto(s) subidas! (Límite alcanzado)`;
            
            showAlert(message, 'success');
        }
        
        window.isProcessingPhotos = false;
        toggleLoadingState(false);
    }
    
    async function processImageFile(file) {
        return new Promise((resolve, reject) => {
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                compressImage(file, {
                    quality: 0.6,
                    maxWidth: 1200,
                    maxHeight: 1200,
                    success: (compressedFile) => readFile(compressedFile, resolve, reject),
                    error: () => readFile(file, resolve, reject)
                });
            } else {
                readFile(file, resolve, reject);
            }
        });
    }
    
    function readFile(file, resolve, reject) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
            dataUrl: e.target.result,
            size: file.size
        });
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsDataURL(file);
    }
    
    function compressImage(file, options) {
        const { quality, maxWidth, maxHeight, success, error } = options;
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calcular nuevas dimensiones manteniendo aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(function(blob) {
                    success(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', quality);
            };
            
            img.onerror = error;
        };
        
        reader.onerror = error;
        reader.readAsDataURL(file);
    }
    
    function renderPhotos() {
        const fragment = document.createDocumentFragment();
        // Mostrar imágenes del 1 al 42 de la carpeta /img
        for (let i = 1; i <= 42; i++) {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.innerHTML = `
                <img src="/img/${i}.jpeg" alt="Recuerdo ${i}" loading="lazy">
                <div class="photo-info">
                    <p>Recuerdo especial #${i}</p>
                </div>
            `;
            fragment.appendChild(photoCard);
        }
        // Mostrar imágenes subidas por el usuario (como antes)
        photos.forEach(photo => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            photoCard.dataset.id = photo.id;
            photoCard.innerHTML = `
                <img src="${photo.src}" alt="${photo.description}" loading="lazy">
                <div class="photo-info">
                    <p>${photo.description}</p>
                    <small>Subido el ${photo.date}</small>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;
            // Evento para modal de imagen grande (opcional)
            const imgElement = photoCard.querySelector('img');
            imgElement.addEventListener('click', () => {
                const modalImg = modal.querySelector('#modal-image');
                const captionText = modal.querySelector('.modal-caption');
                modal.style.display = 'block';
                modalImg.src = photo.src;
                captionText.innerHTML = `
                    <p>${photo.description}</p>
                    <small>Subido el ${photo.date}</small>
                `;
            });
            photoCard.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deletePhoto(photo.id);
            });
            fragment.appendChild(photoCard);
        });
        const gallery = document.getElementById('photo-gallery');
        if (gallery) {
            gallery.innerHTML = '';
            gallery.appendChild(fragment);
        }
    }
    
    function deletePhoto(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
            photos = photos.filter(photo => photo.id !== id);
            localStorage.setItem('tuyyo-photos', JSON.stringify(photos));
            
            const photoElement = document.querySelector(`.photo-card[data-id="${id}"]`);
            if (photoElement) photoElement.remove();
            
            showAlert('Foto eliminada correctamente', 'success');
        }
    }
    
    function resetUploadForm() {
        photoUpload.value = '';
        photoDescription.value = '';
    }
    
    function toggleLoadingState(isLoading) {
        addPhotoBtn.disabled = isLoading;
        addPhotoBtn.innerHTML = isLoading 
            ? '<span class="spinner"></span> Procesando...' 
            : 'Agregar Foto';
    }
    
    // ==================== FUNCIONES PARA TEXTOS ====================
    function publishText() {
        const text = loveText.value.trim();
        
        if (text === '') {
            showAlert('Por favor escribe algo bonito', 'error');
            return;
        }
        
        const textData = {
            id: Date.now(),
            content: text,
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        texts.push(textData);
        localStorage.setItem('tuyyo-texts', JSON.stringify(texts));
        renderText(textData);
        
        loveText.value = '';
        showAlert('¡Texto publicado con amor!', 'success');
    }
    
    function renderTexts() {
        textPosts.innerHTML = '';
        texts.forEach(text => renderText(text));
    }
    
    function renderText(text) {
        const textPost = document.createElement('div');
        textPost.className = 'text-post';
        textPost.dataset.id = text.id;
        textPost.innerHTML = `
            <p>${text.content}</p>
            <small>Publicado el ${text.date}</small>
            <button class="delete-btn">Eliminar</button>
        `;
        
        textPost.querySelector('.delete-btn').addEventListener('click', () => {
            deleteText(text.id);
        });
        
        textPosts.appendChild(textPost);
    }
    
    function deleteText(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este texto?')) {
            texts = texts.filter(text => text.id !== id);
            localStorage.setItem('tuyyo-texts', JSON.stringify(texts));
            
            const textElement = document.querySelector(`.text-post[data-id="${id}"]`);
            if (textElement) textElement.remove();
            
            showAlert('Texto eliminado correctamente', 'success');
        }
    }
    
    // ==================== FUNCIONES PARA FECHAS ====================
    function addDate() {
        const name = eventName.value.trim();
        const date = eventDate.value;
        
        if (name === '' || date === '') {
            showAlert('Por favor completa ambos campos', 'error');
            return;
        }
        
        const dateParts = date.split('-');
        const correctedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const timeDiff = correctedDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const dateData = {
            id: Date.now(),
            name: name,
            date: formatDate(correctedDate),
            originalDate: date,
            daysText: getDaysText(daysDiff)
        };
        
        dates.push(dateData);
        localStorage.setItem('tuyyo-dates', JSON.stringify(dates));
        renderDate(dateData);
        
        eventName.value = '';
        eventDate.value = '';
        showAlert('¡Fecha importante añadida!', 'success');
    }
    
    function renderDates() {
        importantDates.innerHTML = '';
        dates.sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));
        dates.forEach(date => renderDate(date));
    }
    
    function renderDate(date) {
        const dateParts = date.originalDate.split('-');
        const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const timeDiff = eventDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        const dateItem = document.createElement('div');
        dateItem.className = 'date-item';
        dateItem.dataset.id = date.id;
        dateItem.innerHTML = `
            <div>
                <h3>${date.name}</h3>
                <p>${date.date}</p>
                <small>${getDaysText(daysDiff)}</small>
            </div>
            <button class="delete-btn">Eliminar</button>
        `;
        
        dateItem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteDate(date.id);
        });
        
        importantDates.appendChild(dateItem);
    }
    
    function deleteDate(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta fecha importante?')) {
            dates = dates.filter(date => date.id !== id);
            localStorage.setItem('tuyyo-dates', JSON.stringify(dates));
            
            const dateElement = document.querySelector(`.date-item[data-id="${id}"]`);
            if (dateElement) dateElement.remove();
            
            showAlert('Fecha eliminada correctamente', 'success');
        }
    }
    
    function updateDates() {
        dates.forEach(date => {
            const dateParts = date.originalDate.split('-');
            const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const timeDiff = eventDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            date.daysText = getDaysText(daysDiff);
        });
        
        localStorage.setItem('tuyyo-dates', JSON.stringify(dates));
        renderDates();
    }
    
    function getDaysText(daysDiff) {
        if (daysDiff === 0) return '¡Es hoy!';
        if (daysDiff === 1) return 'Mañana';
        if (daysDiff > 1) return `En ${daysDiff} días`;
        if (daysDiff === -1) return 'Ayer';
        return `Hace ${Math.abs(daysDiff)} días`;
    }
    
    // ==================== FUNCIONES AUXILIARES ====================
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    function showAlert(message, type) {
        // Eliminar alertas anteriores
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }
    
    // Inicialización de fecha
    function initDateInput() {
        const today = new Date().toISOString().split('T')[0];
        eventDate.value = today;
    }
    
    initDateInput();
    
    // Actualizar fechas cada 24 horas
    setInterval(updateDates, 24 * 60 * 60 * 1000);
    
    // También actualiza al cargar la página
    updateDates();
    
    // Mensaje especial en consola
    const messages = [
        "Nuestro amor es único y especial",
        "Cada día contigo es un regalo",
        "Eres lo mejor que me ha pasado",
        "Tú y yo, juntos para siempre",
        "El amor verdadero nunca termina"
    ];
    console.log(`%c${messages[Math.floor(Math.random() * messages.length)]}`, 
        'color: #50C878; font-size: 16px; font-weight: bold;');

    // NAVBAR HAMBURGUESA RESPONSIVE
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('open');
        });
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 800) navUl.classList.remove('open');
            });
        });
    }
});
// Agregar estilos para el modal directamente en el JavaScript
const style = document.createElement('style');
style.textContent = `
    .image-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.9);
    }
    
    .modal-content {
        margin: auto;
        display: block;
        max-width: 90%;
        max-height: 80vh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .modal-caption {
        margin: auto;
        display: block;
        width: 80%;
        max-width: 700px;
        text-align: center;
        color: #fff;
        padding: 10px 0;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 35px;
        color: #f1f1f1;
        font-size: 40px;
        font-weight: bold;
        transition: 0.3s;
        cursor: pointer;
    }
    
    .close-modal:hover {
        color: #bbb;
    }
`;
document.head.appendChild(style);