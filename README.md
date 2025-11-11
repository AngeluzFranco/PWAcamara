# Cámara PWA — práctica

Proyecto demo: una Progressive Web App que accede a la cámara, permite tomar una foto y funciona offline mediante un Service Worker.

Archivos principales:
- `index.html` — interfaz y elementos DOM.
- `app.js` — lógica para abrir la cámara, tomar la foto y registrar el Service Worker.
- `sw.js` — service worker con estrategia cache-first.
- `manifest.json` — metadatos para instalar la PWA.
- `icon-192.svg`, `icon-512.svg` — iconos de ejemplo (reemplazar por PNGs si lo prefieres).

Probar localmente (recomendado):

1) Desde PowerShell en Windows, situarse en la carpeta del proyecto y servir en localhost:

```powershell
cd 'C:\Users\angel\OneDrive\Desktop\narvaez\pwaCamara'
# Si tienes Python 3 instalado:
python -m http.server 8000
# O con PowerShell 5 y Node.js installed, puedes usar un paquete tipo 'live-server' si lo tienes.
```

2) Abrir en el navegador: http://localhost:8000

Notas y consideraciones:
- La API de cámara (`getUserMedia`) requiere `https` o `localhost`.
- Los iconos se han añadido como SVGs por simplicidad; para cumplir exactamente con algunos criterios (PNG), reemplaza `icon-192.svg`/`icon-512.svg` por PNGs con los mismos nombres y actualiza `manifest.json` si cambias `type`.
- Para probar la capacidad offline, abre DevTools → Application → Service Workers y verifica que el worker esté activo, luego desactiva la red y recarga.

Sugerencias de mejora (opcionales):
- Añadir miniaturas guardadas en IndexedDB o mostrar galería de fotos.
- Añadir control de cámara frontal/trasera cuando el dispositivo soporte múltiples cámaras.