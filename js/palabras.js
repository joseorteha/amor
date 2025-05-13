document.addEventListener('DOMContentLoaded', function() {
    // 1. ===== CONFIGURACIÓN INICIAL =====
    const emocionContainer = document.getElementById('emocion-container');
    const tituloEmocion = document.getElementById('emocion-actual');
    const prevBtn = document.getElementById('prev-nota');
    const nextBtn = document.getElementById('next-nota');
    const emocionBtns = document.querySelectorAll('.emocion-btn');
    const secciones = document.querySelectorAll('.section-container');
    const menuLinks = document.querySelectorAll('.menu > li > a');
    const emocionContenido = document.querySelector('.emocion-contenido');

    // Variables de estado
    let emocionActual = null;
    let notaActual = 0;

    // 2. ===== DATOS DE NOTAS =====
    const notasPorEmocion = {
        triste: [
            {
                titulo: "Esos Ojitos ... ",
                contenido: "Tus ojitos no merecen llorar. Eres la mejor, mi amor, te amo por todo lo que eres.",
                verso: "Salmo 34:18 - 'El Señor está cerca de los quebrantados de corazón.'"
            },
            {
                titulo: "Esa tormenta pasará",
                contenido: "Tu tristeza no durará para siempre, como el sol después de la lluvia, brillarás de nuevo.",
                verso: "Salmo 30:5 - 'El llanto puede durar toda la noche, pero al amanecer vuelve la alegría.'"
            },
            {
                titulo: "Estoy aquí, aunque no me veas",
                contenido: "Mi amor, incluso cuando no estoy físicamente a tu lado, mi corazón y mis oraciones te abrazan cada noche.",
                verso: "Isaías 43:2 - 'Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán.'"
            },
            {
                titulo: "Tu luz no se apaga",
                contenido: "Aunque hoy te sientas apagada, recuerda que tu luz es más fuerte de lo que crees. Yo la veo cada día.",
                verso: "Mateo 5:14 - 'Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder.'"
            },
            {
                titulo: "No estás sola, nunca",
                contenido: "Cada vez que dudes de ti o sientas que no puedes más, cierra los ojos y recuerda: estoy contigo. Siempre.",
                verso: "Deuteronomio 31:6 - 'Sé fuerte y valiente. No tengas miedo ni te aterrorices, porque el Señor tu Dios va contigo.'"
            },
            {
                titulo: "Te abrazo en la distancia",
                contenido: "Cuando estés triste, imagina mis brazos rodeándote. Siempre estaré para ti, mi amor.",
                verso: "Salmo 94:19 - Cuando la angustia aumentaba en mi interior, tu consuelo llenaba mi alma de alegría."
            }
            // ... añadir 38 notas más para triste
        ],
        sentimental: [
            {
                titulo: "Todo va a estar bien mi amor :)",
                contenido: "Sé que es un momento muy difícil lo que estás pasando, pero todo terminará mi amor, nada es para siempre, te amo muchísimo, te mando besitos y muchos abrazos. Muaaa",
                verso: "Isaías 41:10 - 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.'"
            },
            {
                titulo: "Mírame mi amor, te estoy observando.!!",
                contenido: "Jeje no es verdad mi amor, pero no pongas esa carita, sabes que no me gusta verte así :(",
                verso: "Salmos 34:18 - 'Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.'"
            },
            {
                titulo: "Sonrisita mi amor :)",
                contenido: "Mi amor, tal vez a veces no pueda estar contigo en tus momentos difíciles, pero hice esto para ti, no quiero que pienses que estás sola, aquí también estoy contigo",
                verso: "Josué 1:9 - 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.'"
            },
            {
                titulo: "Aquí estoy, cerquita de tu corazón",
                contenido: "Aunque no pueda abrazarte físicamente, quiero que sientas mi amor desde donde estoy. Estoy contigo en cada pensamiento, en cada oración.",
                verso: "Romanos 8:38-39 - 'Nada podrá separarnos del amor de Dios que es en Cristo Jesús Señor nuestro.'"
            },
            {
                titulo: "Hoy es un buen día para seguir luchando",
                contenido: "Sé que a veces todo pesa, pero también sé cuán fuerte eres. Cada día que pasas esta tormenta, me haces admirarte más.",
                verso: "Salmos 46:1 - 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'"
            },
            {
                titulo: "Un día a la vez, mi amor",
                contenido: "No tienes que tener todas las respuestas hoy. Solo quiero que sepas que caminaré a tu lado, paso a paso.",
                verso: "Mateo 6:34 - 'Así que, no se preocupen por el día de mañana, porque el día de mañana traerá su propio afán.'"
            },
            {
                titulo: "Nuestro amor es único",
                contenido: "Cada día contigo es un regalo, Ingrid. Gracias por enseñarme lo que es el amor verdadero. Eres mi mayor bendición.",
                verso: "1 Corintios 13:7 - El amor todo lo soporta, todo lo cree, todo lo espera, todo lo soporta."
            },
            {
                titulo: "Siempre juntos",
                contenido: "No importa lo que pase, siempre estaré a tu lado. Nuestro amor es más fuerte que cualquier obstáculo.",
                verso: "Cantares 8:7 - Las muchas aguas no podrán apagar el amor, ni lo ahogarán los ríos."
            }
        ],
        alegre: [
            {
            titulo: "Me gusta esa sonrisita",
            contenido: "Tu risa es mi sonido favorito, esa melodía que ilumina hasta el día más gris.",
            verso: "Filipenses 4:4 - Regocijaos en el Señor siempre."
            },
            {
            titulo: "Contigo, todo es fiesta",
            contenido: "Tú haces que la vida sea más brillante, más dulce y más divertida. ¡Te amo, mi alegría!",
            verso: "Salmo 118:24 - Este es el día que hizo el Señor; nos gozaremos y alegraremos en él."
            },
            {
            titulo: "Tu risa es mi vitamina",
            contenido: "Cada vez que sonríes, siento que todo vale la pena. No dejes de brillar.",
            verso: "Proverbios 17:22 - El corazón alegre constituye buen remedio."
            },
            {
            titulo: "Eres mi sol favorito",
            contenido: "Hay días nublados, pero tú apareces con tu alegría y me devuelves el color.",
            verso: "Nehemías 8:10 - El gozo del Señor es vuestra fuerza."
            },
            {
            titulo: "Alegría compartida",
            contenido: "Cuando tú te ríes, yo también. Cuando estás feliz, yo vuelo. Gracias por esa magia.",
            verso: "Salmo 16:11 - En tu presencia hay plenitud de gozo."
            },
            {
                titulo: "Eres mi alegría diaria",
                contenido: "Tu sonrisa ilumina mi vida, Ingrid. Gracias por hacer de cada día una aventura hermosa.",
                verso: "Proverbios 15:13 - El corazón alegre hermosea el rostro."
            }
        ],
        enojada: [
            {
            titulo: "Hasta enojada eres tierna mi amor",
            contenido: "Amo cuando estás enojada, aunque sé que a veces yo lo provoco. Pero no, mi amor, no exageras, te amo tal cual.",
            verso: "Efesios 4:26 - Airaos, pero no pequéis."
            },
            {
            titulo: "Te enojas bonito",
            contenido: "Incluso cuando estás molesta, sigues siendo tú, mi personita hermosa. Solo quiero abrazarte hasta que se te pase.",
            verso: "Proverbios 15:1 - La blanda respuesta quita la ira."
            },
            {
            titulo: "Respira, mi amor",
            contenido: "Sé que a veces todo molesta, y aunque me toque el regaño, aquí estoy para ti, en las buenas y en las rabietas.",
            verso: "Salmo 37:8 - Deja la ira, y desecha el enojo."
            },
            {
            titulo: "Una pausa y un beso",
            contenido: "Antes de seguir enojadita, tómate un minuto para recordar cuánto te amo. (Y acepta este besito robado 😘)",
            verso: "Proverbios 14:29 - El que tarda en airarse es grande de entendimiento."
            },
            {
            titulo: "Después del enojo, un abrazo",
            contenido: "Nada arregla más rápido una pelea que uno de tus abrazos. No tardes, te estoy esperando.",
            verso: "Colosenses 3:13 - Soportándoos unos a otros, y perdonándoos unos a otros."
            },
            {
                titulo: "Incluso enojada, te amo",
                contenido: "A veces discutimos, pero mi amor por ti nunca cambia. Eres mi todo, Ingrid.",
                verso: "Efesios 4:2 - Sean siempre humildes y amables. Sean pacientes unos con otros y tolérense las faltas por amor."
            }
        ],
        sola: [
            {
            titulo: "Nunca sola",
            contenido: "Recuerda que aunque te sientas sola, mi amor te acompaña en cada momento.",
            verso: "Josué 1:5 - No te dejaré ni te desampararé."
            },
            {
            titulo: "Mi corazón está contigo",
            contenido: "Cuando no puedas verme, busca dentro de ti: ahí estoy, amándote silenciosamente.",
            verso: "Salmo 139:7 - ¿A dónde me iré de tu Espíritu? ¿Y a dónde huiré de tu presencia?"
            },
            {
            titulo: "La distancia no es olvido",
            contenido: "Aunque haya kilómetros entre nosotros, mi amor rompe cualquier barrera.",
            verso: "Romanos 8:39 - Nada podrá separarnos del amor de Dios."
            },
            {
            titulo: "Estoy a una oración de distancia",
            contenido: "Cuando te sientas sola, habla conmigo o habla con Dios. Ambos te escuchamos.",
            verso: "Mateo 28:20 - He aquí, yo estoy con vosotros todos los días, hasta el fin del mundo."
            },
            {
            titulo: "Eres vista, eres amada",
            contenido: "No dejes que la soledad te engañe. Eres profundamente amada y acompañada, siempre.",
            verso: "Isaías 41:10 - No temas, porque yo estoy contigo."
            },
            {
                titulo: "Nunca te dejaré sola",
                contenido: "Aunque la vida sea difícil, siempre estaré contigo, Ingrid. Nuestro amor es eterno.",
                verso: "Isaías 43:4 - Porque eres de gran estima y yo te amo."
            }
        ]
        
    };

    // 3. ===== FUNCIONALIDAD DE NOTAS EMOCIONALES =====
    function mostrarNota() {
        const notas = notasPorEmocion[emocionActual];
        const nota = notas[notaActual];
        
        emocionContainer.innerHTML = `
            <div class="nota-emocion">
                <h3>${nota.titulo}</h3>
                <p>${nota.contenido}</p>
                <span class="verso-emocion">${nota.verso}</span>
            </div>
        `;
    }

    // 4. ===== SISTEMA DE NAVEGACIÓN =====
    function mostrarSeccion(id) {
        // Ocultar todas las secciones
        secciones.forEach(section => {
            section.classList.remove('active-section');
        });

        // Mostrar sección seleccionada
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.classList.add('active-section');
        }

        // Ocultar contenido emocional si no es la sección de emociones
        if (id !== 'emociones') {
            emocionContenido.classList.remove('mostrar');
        }

        // Actualizar menú activo
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // 5. ===== MANEJADORES DE EVENTOS =====
    // Para botones de emociones
    emocionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            emocionActual = this.dataset.emocion;
            notaActual = 0;
            tituloEmocion.textContent = this.textContent.toLowerCase();
            
            // Mostrar contenido emocional
            emocionContenido.classList.add('mostrar');
            mostrarNota();
            
            // Cambiar a sección de emociones
            window.location.hash = 'emociones';
        });
    });

    // Para navegación entre notas
    prevBtn.addEventListener('click', function() {
        if (emocionActual) {
            notaActual = (notaActual - 1 + notasPorEmocion[emocionActual].length) % 
                        notasPorEmocion[emocionActual].length;
            mostrarNota();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (emocionActual) {
            notaActual = (notaActual + 1) % notasPorEmocion[emocionActual].length;
            mostrarNota();
        }
    });

    // Para menú principal
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                mostrarSeccion(target);
                window.location.hash = target;
            }
        });
    });

    // 6. ===== INICIALIZACIÓN =====
    // Mostrar sección según hash o 'poemas' por defecto
    const hash = window.location.hash.substring(1) || 'poemas';
    mostrarSeccion(hash);

    // Manejar cambios en el hash
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.substring(1);
        mostrarSeccion(newHash);
    });

    // === KARAOKE ===
    function inicializarKaraoke() {
        document.querySelectorAll('.cancion-con-imagen').forEach((cancion, idx) => {
            const letraDiv = cancion.querySelector('.letra-cancion');
            const karaokeBtn = document.createElement('button');
            karaokeBtn.textContent = '🎤 Karaoke';
            karaokeBtn.className = 'karaoke-btn';
            karaokeBtn.style.marginBottom = '0.7rem';
            karaokeBtn.style.alignSelf = 'flex-start';
            let karaokeActivo = false;
            let versos = Array.from(letraDiv.querySelectorAll('p, span, br'));
            let versosText = letraDiv.innerHTML.split(/<br\s*\/?>(\s*)?/i).filter(v => v.trim() !== '');
            let idxVerso = 0;
            let interval = null;
            let versosNodes = [];

            // Prepara versos para karaoke
            function prepararVersos() {
                letraDiv.innerHTML = '';
                versosNodes = versosText.map((linea, i) => {
                    const span = document.createElement('span');
                    span.textContent = linea;
                    span.style.display = 'block';
                    span.style.marginBottom = '0.3em';
                    letraDiv.appendChild(span);
                    return span;
                });
            }

            function activarKaraoke() {
                karaokeActivo = true;
                karaokeBtn.textContent = '⏸️ Detener Karaoke';
                prepararVersos();
                idxVerso = 0;
                resaltarVerso();
                interval = setInterval(() => {
                    idxVerso++;
                    if (idxVerso < versosNodes.length) {
                        resaltarVerso();
                    } else {
                        detenerKaraoke();
                    }
                }, 2500);
            }

            function detenerKaraoke() {
                karaokeActivo = false;
                karaokeBtn.textContent = '🎤 Karaoke';
                clearInterval(interval);
                versosNodes.forEach(span => span.classList.remove('verso-karaoke'));
            }

            function resaltarVerso() {
                versosNodes.forEach((span, i) => {
                    span.classList.toggle('verso-karaoke', i === idxVerso);
                });
                // Scroll automático
                const versoActivo = versosNodes[idxVerso];
                if (versoActivo) {
                    versoActivo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            karaokeBtn.addEventListener('click', () => {
                if (!karaokeActivo) {
                    activarKaraoke();
                } else {
                    detenerKaraoke();
                }
            });

            // Insertar botón antes de la letra
            letraDiv.parentNode.insertBefore(karaokeBtn, letraDiv);
        });
    }

    inicializarKaraoke();
});

document.addEventListener('DOMContentLoaded', function() {
    // Configuración mejorada con diagnóstico de errores
    const canciones = document.querySelectorAll('.cancion-con-imagen');
    
    if (canciones.length === 0) {
        console.error('No se encontraron elementos .cancion-con-imagen');
        return;
    }

    canciones.forEach((cancion, index) => {
        const reproductor = cancion.querySelector('audio');
        const cover = cancion.querySelector('.imagen-circular');
        
        if (!reproductor) {
            console.error(`Reproductor no encontrado en canción ${index + 1}`);
            return;
        }
        
        if (!cover) {
            console.error(`Imagen no encontrada en canción ${index + 1}`);
            return;
        }

        // Verificar si los eventos se están registrando
        console.log(`Configurando reproductor ${index + 1}`);

        reproductor.addEventListener('play', function() {
            console.log(`Play en reproductor ${index + 1}`);
            cover.classList.add('girando');
        });

        reproductor.addEventListener('pause', function() {
            console.log(`Pause en reproductor ${index + 1}`);
            cover.classList.remove('girando');
        });

        reproductor.addEventListener('ended', function() {
            console.log(`Ended en reproductor ${index + 1}`);
            cover.classList.remove('girando');
        });
    });
});