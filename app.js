(function () {
  "use strict";

  const config = window.TEMPOLUX_CONFIG || {};
  const items = Array.isArray(window.TEMPOLUX_PRODUCTS)
    ? window.TEMPOLUX_PRODUCTS
    : [];
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("nav");
  const search = document.querySelector("#search");
  const filters = document.querySelector("#filters");
  const grid = document.querySelector("#products");
  const featured = document.querySelector("#featured");
  const summary = document.querySelector("#summary");
  const catalogEmpty = document.querySelector("#catalog-empty");
  const featuredEmpty = document.querySelector("#featured-empty");
  const floatingWhatsApp = document.querySelector(".whatsapp");

  let active = "Todas";

  const escapeHtml = (value) =>
    String(value).replace(
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

  function isValidWhatsAppNumber(number) {
    return /^\d{7,15}$/.test(String(number || "").trim());
  }

  function configureFloatingWhatsApp() {
    const whatsappNumber = String(config.whatsappNumber || "").trim();

    if (!isValidWhatsAppNumber(whatsappNumber)) {
      return;
    }

    floatingWhatsApp.href = `https://wa.me/${whatsappNumber}`;
    floatingWhatsApp.target = "_blank";
    floatingWhatsApp.rel = "noopener noreferrer";
    floatingWhatsApp.classList.remove("disabled");
    floatingWhatsApp.removeAttribute("aria-disabled");
    floatingWhatsApp.setAttribute("aria-label", "Contactar a TempoLux por WhatsApp");
  }

  function productCard(product) {
    const available = product.available === true;
    const whatsappNumber = String(config.whatsappNumber || "").trim();
    const ready = isValidWhatsAppNumber(whatsappNumber) && available;
    const image = product.image
      ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(
          product.imageAlt || product.name,
        )}" loading="lazy" width="640" height="480">`
      : "<span>Fotografía pendiente</span>";
    const message = encodeURIComponent(
      `Hola, deseo consultar por: ${product.name}`,
    );
    const link = ready
      ? `https://wa.me/${whatsappNumber}?text=${message}`
      : "#pedidos";

    return `
      <article class="card">
        <div class="product-image">${image}</div>
        <div class="card-body">
          <div class="meta">
            <span>${escapeHtml(product.category)}</span>
            <span class="status ${available ? "" : "sold"}">
              ${available ? "Disponible" : "Agotado"}
            </span>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description)}</p>
          <span class="price">${escapeHtml(product.price)}</span>
          <a class="button" href="${link}" ${
            ready
              ? 'target="_blank" rel="noopener noreferrer"'
              : 'aria-disabled="true"'
          }>Pedir por WhatsApp</a>
        </div>
      </article>
    `;
  }

  function renderFilters() {
    const categories = [
      "Todas",
      ...new Set(items.map((product) => product.category).filter(Boolean)),
    ];

    filters.innerHTML = categories
      .map(
        (category) => `
          <button
            class="filter"
            type="button"
            data-category="${escapeHtml(category)}"
            aria-pressed="${category === active}"
          >${escapeHtml(category)}</button>
        `,
      )
      .join("");
  }

  function renderProducts() {
    const term = search.value.trim().toLocaleLowerCase("es");
    const results = items.filter((product) => {
      const matchesCategory =
        active === "Todas" || product.category === active;
      const searchableText =
        `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase(
          "es",
        );

      return matchesCategory && searchableText.includes(term);
    });
    const featuredItems = items.filter((product) => product.featured === true);

    grid.innerHTML = results.map(productCard).join("");
    featured.innerHTML = featuredItems.map(productCard).join("");
    catalogEmpty.hidden = results.length > 0;
    featuredEmpty.hidden = featuredItems.length > 0;
    summary.textContent = items.length
      ? `${results.length} producto${results.length === 1 ? "" : "s"} encontrado${
          results.length === 1 ? "" : "s"
        }.`
      : "Catálogo pendiente de productos reales.";
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.querySelector(".sr-only").textContent = open
      ? "Abrir menú"
      : "Cerrar menú";
    menu.classList.toggle("open", !open);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector(".sr-only").textContent = "Abrir menú";
    }
  });

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");

    if (!button) {
      return;
    }

    active = button.dataset.category;
    renderFilters();
    renderProducts();
  });

  search.addEventListener("input", renderProducts);
  document.querySelector("#year").textContent = new Date().getFullYear();

  configureFloatingWhatsApp();
  renderFilters();
  renderProducts();
})();
