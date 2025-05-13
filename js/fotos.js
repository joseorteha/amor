document.addEventListener('DOMContentLoaded', () => {
    const photoUpload = document.getElementById('photo-upload');
    const photoDescription = document.getElementById('photo-description');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const photoGallery = document.getElementById('photo-gallery');
    const galeriaFija = document.getElementById('galeria-fija');

    // Cargar fotos guardadas
    loadPhotos();

    // Evento para agregar nueva foto
    addPhotoBtn.addEventListener('click', () => {
        const files = photoUpload.files;
        const description = photoDescription.value.trim();

        if (files.length > 0 && description) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addPhoto(e.target.result, description);
                };
                reader.readAsDataURL(file);
            });
            photoUpload.value = '';
            photoDescription.value = '';
        }
    });

    function addPhoto(imageData, description) {
        const photos = getPhotos();
        photos.push({ imageData, description, date: new Date().toISOString() });
        localStorage.setItem('lovePhotos', JSON.stringify(photos));
        renderPhotos();
    }

    function getPhotos() {
        const photos = localStorage.getItem('lovePhotos');
        return photos ? JSON.parse(photos) : [];
    }

    function loadPhotos() {
        renderPhotos();
    }

    function renderPhotos() {
        const photos = getPhotos();
        photoGallery.innerHTML = '';

        photos.forEach((item, index) => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            
            const date = new Date(item.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            photoCard.innerHTML = `
                <img src="${item.imageData}" alt="Foto de amor">
                <div class="photo-info">
                    <p>${item.description}</p>
                    <p class="photo-date">${date}</p>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                </div>
            `;

            photoGallery.appendChild(photoCard);
        });

        // Agregar eventos de eliminación
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                deletePhoto(index);
            });
        });
    }

    function deletePhoto(index) {
        const photos = getPhotos();
        photos.splice(index, 1);
        localStorage.setItem('lovePhotos', JSON.stringify(photos));
        renderPhotos();
    }

    // Descripciones románticas para las fotos fijas
    const descripcionesFijas = [
        "Fotito en el espejo.",
        "Loa avatares que hiciste para mi🥺.",
        "Nuestro beso en el espejo jaja.",
        "Mi guapetonaaa.",
        "Cada momento contigo es un tesoro.",
        "Así se ve la felicidad: tú y yo.",
        "Un Guapoooo jaja.",
        "Juntos, todo es posible.",
        "Date perfecta",
        "Recuerditooo 🥺.",
        "Un recuerdo que guardo en el corazón.",
        "Contigo, cada día es especial.",
        "Nuestro rincón favorito.",
        "La magia de estar juntos.",
        "Eres mi mejor historia.",
        "Nada se compara a tu risa.",
        "Los inicioss.",
        "Gracias por existir en mi vida.",
        "Nuestro amor, nuestra aventura.",
        "Siempre tú, siempre yo.",
        "Una foto que lo dice todo.",
        "Eres mi sueño hecho realidad.",
        "Contigo aprendí a amar de verdad.",
        "Nuestro secreto: amarnos sin medida.",
        "Eres mi sol en días nublados.",
        "Un instante, mil emociones.",
        "Te elijo hoy y siempre.",
        "Mi niña que hermosa te veias ese dia.",
        "Gracias por cada momento.",
        "Eres mi destino.",
        "Juntos, somos invencibles.",
        "Con esa foto lloroo, un hermoso recuerdo.",
        "Ese dia estaba trizte🥺.",
        "Me gusto estar contigo ese dia.",
        "Eres mi hogar.",
        "Un amor que crece cada día.",
        "Eres mi alegría diaria.",
        "Corazoncito hecho con las manos de mi mujer.",
        "Ultimas fotos y estoy llorando de los recuerdos.",
        "Eres mi razón de sonreír."
    ];

    // Cambiar vista de galería
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    function setGalleryView(view) {
        galeriaFija.classList.remove('grid-view', 'list-view');
        galeriaFija.classList.add(view + '-view');
        gridBtn.classList.toggle('active', view === 'grid');
        listBtn.classList.toggle('active', view === 'list');
    }
    gridBtn.addEventListener('click', () => setGalleryView('grid'));
    listBtn.addEventListener('click', () => setGalleryView('list'));
    setGalleryView('grid');

    // Modal de imagen
    const modal = document.getElementById('modal-foto');
    const modalImg = document.querySelector('.modal-img');
    const modalDesc = document.querySelector('.modal-desc');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    let currentIndex = 0;

    function openModal(index) {
        currentIndex = index;
        modalImg.src = `/img/${index + 1}.jpeg`;
        modalDesc.textContent = descripcionesFijas[index] || '';
        modal.classList.add('active');
    }
    function closeModalFn() {
        modal.classList.remove('active');
    }
    function showPrev() {
        currentIndex = (currentIndex - 1 + descripcionesFijas.length) % descripcionesFijas.length;
        openModal(currentIndex);
    }
    function showNext() {
        currentIndex = (currentIndex + 1) % descripcionesFijas.length;
        openModal(currentIndex);
    }
    closeModal.addEventListener('click', closeModalFn);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModalFn(); });
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'Escape') closeModalFn();
    });

    // Mostrar galería fija de imágenes con descripciones y modal
    function renderGaleriaFija() {
        if (!galeriaFija) return;
        galeriaFija.innerHTML = '';
        for (let i = 1; i <= 41; i++) {
            const img = document.createElement('img');
            img.src = `/img/${i}.jpeg`;
            img.alt = descripcionesFijas[i - 1] || `Recuerdo ${i}`;
            img.className = 'foto-fija';
            img.setAttribute('data-index', i - 1);
            img.title = descripcionesFijas[i - 1] || '';
            img.addEventListener('click', (e) => {
                openModal(i - 1);
            });
            galeriaFija.appendChild(img);
        }
    }

    renderGaleriaFija();
}); 