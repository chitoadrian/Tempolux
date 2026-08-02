(function () {
  "use strict";

  const config = window.TEMPOLUX_CONFIG || {};
  const productDetails = window.TEMPOLUX_PRODUCT_DETAILS || {};
  const categories = [
    "Todos",
    "Accesorios",
    "Relojes",
    "Perfumes",
    "Belleza",
    "Cuidado personal",
    "Tecnología",
    "Gorras",
    "Llaveros",
  ];
  const variantOptions = {
    "Cera para Cabello Shiner Gold": [
      "Dorado",
      "Naranja",
      "Beige",
      "Verde",
      "Negro",
      "Azul",
      "Morado",
      "Rojo",
    ],
    "Anillo Ojo Turco Ajustable": ["Azul", "Multicolor"],
  };

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu");
  const search = document.querySelector("#search");
  const filters = document.querySelector("#filters");
  const productGrid = document.querySelector("#products");
  const featuredGrid = document.querySelector("#featured");
  const summary = document.querySelector("#summary");
  const catalogEmpty = document.querySelector("#catalog-empty");
  const featuredEmpty = document.querySelector("#featured-empty");
  const floatingWhatsApp = document.querySelector(".whatsapp");
  const productDialog = document.querySelector("#product-dialog");
  const dialogContent = document.querySelector("#dialog-product-content");
  const dialogClose = document.querySelector("#dialog-close");
  const catalogError = document.querySelector("#catalog-error");

  let products = [];
  let activeCategory = "Todos";

  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>'"]/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[character],
    );

  function whatsappUrl(product, variant = "") {
    const variantText = variant ? `, variante ${variant}` : "";
    const message = `Hola, deseo información sobre ${product.name} por ${product.price}${variantText}.`;

    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function productImage(product, className = "") {
    const isModal = className.includes("dialog-photo");
    const position = isModal
      ? product.modalImagePosition || product.imagePosition || "50% 45%"
      : product.imagePosition || "50% 45%";
    const scale = isModal
      ? Number(product.modalImageScale) || Number(product.imageScale) || 1.08
      : Number(product.imageScale) || 1.08;
    const crop = ["Top", "Right", "Bottom", "Left"].map((side) => {
      const modalValue = product[`modalCrop${side}`];
      const value = isModal && modalValue !== undefined
        ? modalValue
        : product[`crop${side}`];
      const percentage = Number(value);

      return Number.isFinite(percentage)
        ? Math.min(Math.max(percentage, 0), 45)
        : 0;
    });

    return `<img class="product-photo ${className}" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" width="640" height="640" style="--image-position: ${escapeHtml(position)}; --image-scale: ${scale}; --crop-top: ${crop[0]}%; --crop-right: ${crop[1]}%; --crop-bottom: ${crop[2]}%; --crop-left: ${crop[3]}%">`;
  }

  function productCard(product) {
    return `
      <article class="card product-card" data-product-id="${escapeHtml(product.id)}" tabindex="0" aria-label="Ver detalles de ${escapeHtml(product.name)}">
        <div class="product-image">${productImage(product)}</div>
        <div class="card-body">
          <div class="meta">
            <span>${escapeHtml(product.category)}</span>
            <span class="status ${product.available ? "" : "sold"}">${product.available ? "Disponible" : "Agotado"}</span>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          <span class="price">${escapeHtml(product.price)}</span>
          <button class="button product-order" type="button" data-order-id="${escapeHtml(product.id)}">Pedir por WhatsApp</button>
        </div>
      </article>
    `;
  }

  function renderFilters() {
    filters.innerHTML = categories
      .map(
        (category) => `
          <button class="filter" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === activeCategory}">${escapeHtml(category)}</button>
        `,
      )
      .join("");
  }

  function renderProducts() {
    const term = search.value.trim().toLocaleLowerCase("es");
    const visibleProducts = products.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" || product.category === activeCategory;
      return (
        matchesCategory &&
        product.name.toLocaleLowerCase("es").includes(term)
      );
    });
    const featuredProducts = (config.featuredProductIds || [])
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);

    productGrid.innerHTML = visibleProducts.map(productCard).join("");
    featuredGrid.innerHTML = featuredProducts.map(productCard).join("");
    catalogEmpty.hidden = visibleProducts.length > 0;
    featuredEmpty.hidden = featuredProducts.length > 0;
    summary.textContent = `${visibleProducts.length} producto${visibleProducts.length === 1 ? "" : "s"}.`;
  }

  function variantField(product) {
    const options = variantOptions[product.name];

    if (!options) {
      return "";
    }

    return `
      <label class="variant-field">
        <span>Elige una opción</span>
        <select id="dialog-variant">
          ${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  function openProduct(product) {
    dialogContent.innerHTML = `
      <div class="dialog-image">${productImage(product, "dialog-photo")}</div>
      <div class="dialog-details">
        <p class="eyebrow">${escapeHtml(product.category)}</p>
        <h2 id="dialog-title">${escapeHtml(product.name)}</h2>
        <p class="dialog-price">${escapeHtml(product.price)}</p>
        <p class="dialog-description">${escapeHtml(product.description || "Consulta por WhatsApp para conocer más detalles de este producto.")}</p>
        <p class="dialog-status"><span aria-hidden="true"></span>${product.available ? "Disponible" : "Agotado"}</p>
        ${variantField(product)}
        <a class="button dialog-order" href="${whatsappUrl(product)}" target="_blank" rel="noopener noreferrer">Pedir por WhatsApp</a>
      </div>
    `;

    const variantSelect = dialogContent.querySelector("#dialog-variant");
    const orderLink = dialogContent.querySelector(".dialog-order");

    if (variantSelect) {
      const updateLink = () => {
        orderLink.href = whatsappUrl(product, variantSelect.value);
      };
      variantSelect.addEventListener("change", updateLink);
      updateLink();
    }

    productDialog.showModal();
  }

  function findProduct(id) {
    return products.find((product) => product.id === id);
  }

  function handleGridClick(event) {
    const orderButton = event.target.closest("[data-order-id]");

    if (orderButton) {
      event.stopPropagation();
      const product = findProduct(orderButton.dataset.orderId);
      if (product) openProduct(product);
      return;
    }

    const card = event.target.closest("[data-product-id]");
    if (card) openProduct(findProduct(card.dataset.productId));
  }

  function handleGridKeydown(event) {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-product-id]")) {
      event.preventDefault();
      openProduct(findProduct(event.target.dataset.productId));
    }
  }

  async function loadCatalog() {
    try {
      const response = await fetch(config.catalogPath, { cache: "no-cache" });
      if (!response.ok) throw new Error(`No se pudo cargar el catálogo (${response.status}).`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("El catálogo no tiene un formato válido.");
      products = data.map((product) => ({
        ...product,
        ...(productDetails[product.id] || {}),
      }));
      renderProducts();
    } catch (error) {
      console.error(error);
      catalogError.hidden = false;
      summary.textContent = "No fue posible cargar el catálogo.";
    }
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.querySelector(".sr-only").textContent = open ? "Abrir menú" : "Cerrar menú";
    menu.classList.toggle("open", !open);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderProducts();
  });

  search.addEventListener("input", renderProducts);
  productGrid.addEventListener("click", handleGridClick);
  featuredGrid.addEventListener("click", handleGridClick);
  productGrid.addEventListener("keydown", handleGridKeydown);
  featuredGrid.addEventListener("keydown", handleGridKeydown);
  dialogClose.addEventListener("click", () => productDialog.close());
  productDialog.addEventListener("click", (event) => {
    if (event.target === productDialog) productDialog.close();
  });

  floatingWhatsApp.href = `https://wa.me/${config.whatsappNumber}`;
  document.querySelector("#year").textContent = new Date().getFullYear();
  renderFilters();
  loadCatalog();
})();
