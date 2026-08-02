# TempoLux

Catálogo público y responsive de TempoLux. Los visitantes pueden explorar productos sin crear una cuenta y solicitar información directamente por WhatsApp. No utiliza carrito, pagos en línea, base de datos ni formularios que almacenen datos personales.

## Estructura principal

```text
assets/images/productos/       Fotografías reales
assets/logo/logo-tempolux.png  Logo oficial
assets/css/product-image-fix.css Ajustes de imágenes
data/productos.json            Fuente principal del catálogo
data/products.js               Configuración pública
index.html                     Estructura de la página
style.css                      Diseño responsive
app.js                         Catálogo, búsqueda, filtros, modal y WhatsApp
```

## Agregar un producto

1. Guarda su imagen optimizada en `assets/images/productos/`. Usa un nombre breve, descriptivo y sin espacios.
2. Abre `data/productos.json`.
3. Agrega un objeto antes del corchete final, separándolo del producto anterior con una coma:

```json
{
  "id": "identificador-unico",
  "name": "Nombre del producto",
  "price": "$0.00",
  "description": "Descripción real del producto",
  "category": "Categoría",
  "image": "assets/images/productos/nombre-imagen.png",
  "available": true
}
```

El `id` no debe repetirse. La ruta distingue mayúsculas y minúsculas en GitHub Pages.

## Editar precio o descripción

Busca el producto en `data/productos.json` y modifica únicamente `price` o `description`. Mantén las comillas y comas del formato JSON. Si todavía no existe una descripción, puedes agregar la propiedad `description` al producto.

## Eliminar un producto

Elimina su objeto completo de `data/productos.json`. Revisa la coma entre los objetos anterior y siguiente. Después puedes eliminar su fotografía si ninguna otra entrada la utiliza.

## Agregar o reemplazar una imagen

Guarda el archivo dentro de `assets/images/productos/` y actualiza la propiedad `image` del producto. Se recomiendan imágenes cuadradas, comprimidas y con fondo limpio. La interfaz utiliza `object-fit: contain` para mostrar la fotografía completa sin deformarla.

## Cambiar el número de WhatsApp

Edita `whatsappNumber` en `data/products.js`. Usa el formato internacional con solo dígitos, sin `+`, espacios ni guiones. Actualiza también los enlaces visibles de WhatsApp en `index.html`.

## Productos destacados

Edita `featuredProductIds` en `data/products.js` y usa identificadores que existan en `data/productos.json`.

## Publicar cambios en GitHub Pages

1. Realiza los cambios en la rama configurada para GitHub Pages.
2. Confirma que `data/productos.json` sea JSON válido y que todas las imágenes existan.
3. Crea el commit y súbelo a GitHub.
4. GitHub Pages actualizará automáticamente el sitio después de procesar el commit.
5. Revisa la publicación en `https://chitoadrian.github.io/Tempolux/`.

En este proyecto GitHub Pages publica actualmente desde `desarrollo-inicial`. No cambies esa configuración sin revisar primero el flujo de publicación.
