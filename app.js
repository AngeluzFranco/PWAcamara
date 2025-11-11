// app.js - lógica principal de la cámara para la PWA
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadLink = document.getElementById('downloadLink');

// Elementos de la galería
const galleryContainer = document.getElementById('galleryContainer');
const galleryPhoto = document.getElementById('galleryPhoto');
const prevPhotoBtn = document.getElementById('prevPhoto');
const nextPhotoBtn = document.getElementById('nextPhoto');
const photoCounter = document.getElementById('photoCounter');
const deletePhotoBtn = document.getElementById('deletePhoto');
const downloadCurrentBtn = document.getElementById('downloadCurrent');
const emptyGallery = document.getElementById('emptyGallery');

let stream = null;
let savedPhotos = []; // Array para fotos guardadas
let currentPhotoIndex = 0; // Índice de la foto actual en la galería
const MAX_PHOTOS = 3; // Máximo de fotos a guardar

async function openCamera() {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' }, // Cámara trasera preferida en móviles
        width: { ideal: 1280, max: 1920 }, // Mayor resolución para móviles modernos
        height: { ideal: 720, max: 1080 }
      }
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    cameraContainer.style.display = 'block';
    openCameraBtn.textContent = '📱 Cámara Activa';
    openCameraBtn.disabled = true;
    takePhotoBtn.disabled = false;
    console.log('Cámara abierta exitosamente');
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    alert('No se pudo acceder a la cámara. Verifica los permisos en la configuración del navegador.');
  }
}

function takePhoto() {
  if (!stream) {
    alert('Primero debes abrir la cámara');
    return;
  }

  // Obtener dimensiones reales del video para mejor calidad en móviles
  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;
  
  // Ajustar canvas al tamaño real del video
  canvas.width = width;
  canvas.height = height;

  // Dibujar frame actual con mejor calidad
  ctx.drawImage(video, 0, 0, width, height);
  const imageDataURL = canvas.toDataURL('image/jpeg', 0.8); // JPEG con buena calidad para móviles

  // Mostrar canvas y enlace de descarga
  canvas.style.display = 'block';
  downloadLink.href = imageDataURL;
  downloadLink.style.display = 'block';

  console.log('Foto capturada, resolución:', width, 'x', height);

  // Guardar en la galería
  savePhotoToGallery(imageDataURL);

  // Opcional: cerrar cámara después de tomar la foto
  closeCamera();
}

function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
  }
  cameraContainer.style.display = 'none';
  openCameraBtn.textContent = '📱 Abrir Cámara';
  openCameraBtn.disabled = false;
  takePhotoBtn.disabled = true;
  console.log('Cámara cerrada');
}

openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
window.addEventListener('beforeunload', () => { closeCamera(); });

// Event listeners para la galería
prevPhotoBtn.addEventListener('click', showPreviousPhoto);
nextPhotoBtn.addEventListener('click', showNextPhoto);
deletePhotoBtn.addEventListener('click', clearGallery);

// ===== FUNCIONES DE LA GALERÍA =====

function loadPhotosFromStorage() {
  const stored = localStorage.getItem('pwaCameraPhotos');
  if (stored) {
    savedPhotos = JSON.parse(stored);
  }
  updateGalleryDisplay();
}

function savePhotosToStorage() {
  localStorage.setItem('pwaCameraPhotos', JSON.stringify(savedPhotos));
}

function savePhotoToGallery(imageDataURL) {
  // Agregar al inicio del array
  savedPhotos.unshift({
    id: Date.now(),
    data: imageDataURL,
    timestamp: new Date().toLocaleString()
  });

  // Limitar a máximo 3 fotos (eliminar las más antiguas)
  if (savedPhotos.length > MAX_PHOTOS) {
    savedPhotos = savedPhotos.slice(0, MAX_PHOTOS);
  }

  // Guardar en localStorage
  savePhotosToStorage();
  
  // Mostrar la foto recién tomada
  currentPhotoIndex = 0;
  updateGalleryDisplay();
  
  console.log(`Foto guardada. Total: ${savedPhotos.length}/${MAX_PHOTOS}`);
}

function updateGalleryDisplay() {
  if (savedPhotos.length === 0) {
    galleryContainer.style.display = 'none';
    emptyGallery.style.display = 'block';
    return;
  }

  galleryContainer.style.display = 'block';
  emptyGallery.style.display = 'none';
  
  // Mostrar la foto actual
  const currentPhoto = savedPhotos[currentPhotoIndex];
  galleryPhoto.src = currentPhoto.data;
  downloadCurrentBtn.href = currentPhoto.data;
  
  // Actualizar contador
  photoCounter.textContent = `${currentPhotoIndex + 1} / ${savedPhotos.length}`;
  
  // Habilitar/deshabilitar botones de navegación
  prevPhotoBtn.disabled = currentPhotoIndex === 0;
  nextPhotoBtn.disabled = currentPhotoIndex === savedPhotos.length - 1;
}

function showPreviousPhoto() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;
    updateGalleryDisplay();
  }
}

function showNextPhoto() {
  if (currentPhotoIndex < savedPhotos.length - 1) {
    currentPhotoIndex++;
    updateGalleryDisplay();
  }
}

function clearGallery() {
  if (savedPhotos.length === 0) return;
  
  // Confirmar eliminación de toda la galería
  if (!confirm('¿Estás seguro de que quieres eliminar todas las fotos de la galería?')) {
    return;
  }
  
  // Limpiar todas las fotos
  savedPhotos = [];
  currentPhotoIndex = 0;
  savePhotosToStorage();
  
  updateGalleryDisplay();
  console.log('Galería limpiada completamente');
}

// Cargar fotos al inicializar la página
document.addEventListener('DOMContentLoaded', loadPhotosFromStorage);

// Registrar el Service Worker (si está disponible)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registrado:', reg.scope))
    .catch(err => console.warn('Registro de Service Worker falló:', err));
}