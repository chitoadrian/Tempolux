# TempoLux

Tienda virtual estática, moderna y adaptable a celulares. Permitirá consultar el catálogo y solicitar productos por WhatsApp, sin pagos en línea ni inicio de sesión.

## Contenido pendiente

- Productos, precios, categorías y fotografías reales.
- Logo oficial, WhatsApp, contacto y redes sociales.
- Información de entregas y formas de pago.

No se incluyen datos personales ni productos ficticios.

## Estructura

```text
assets/images/   Fotografías de productos
assets/logo/     Logo oficial
data/products.js Catálogo y configuración
index.html       Contenido y estructura
style.css        Diseño responsive
app.js           Menú, búsqueda, filtros y tarjetas
```

## Actualizar el catálogo

Agrega únicamente datos reales a `window.TEMPOLUX_PRODUCTS` en `data/products.js`, siguiendo el formato documentado allí. Para activar los pedidos, completa `whatsappNumber` con el número internacional usando solo dígitos.

El sitio no requiere instalaciones: abre `index.html` en un navegador. Es compatible con GitHub Pages.
