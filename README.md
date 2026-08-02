# TempoLux

Tienda virtual estática, moderna y adaptable a celulares. Permitirá consultar el catálogo y solicitar productos por WhatsApp, sin pagos en línea ni inicio de sesión.

## Contenido pendiente

- Productos, precios, categorías y fotografías reales.
- Logo oficial, WhatsApp, contacto y redes sociales.
- Información de entregas y formas de pago.

No se incluyen datos personales ni información real pendiente de confirmar.

La rama de desarrollo incluye temporalmente productos claramente marcados como **Producto de muestra** y precios señalados como temporales. Sirven únicamente para aprobar el diseño y deben reemplazarse antes de publicar el catálogo definitivo.

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

Coloca el logo oficial en `assets/logo/logo-tempolux.png`. La página mostrará automáticamente el logo cuando el archivo exista y conservará un monograma temporal mientras esté pendiente.

El sitio no requiere instalaciones: abre `index.html` en un navegador. Es compatible con GitHub Pages.
