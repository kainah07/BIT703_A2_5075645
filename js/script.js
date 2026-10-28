// Toggle mobile menu
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");

    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open menu" : "Close menu"
    );
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    });
  });
}

// Display hero images by creating image elements and adding them to the hero container
const heroImages = [
  {
    img: "images/hero1.jpg",
    name: "Outdoor adventure gear"
  },
  {
    img: "images/hero2.jpg",
    name: "Hiking equipment"
  },
  {
    img: "images/hero3.jpg",
    name: "Camping gear"
  }
];

const heroContainer = document.getElementById("hero-images");

if (heroContainer) {
  heroImages.forEach((image) => {
    const img = document.createElement("img");

    img.src = image.img;
    img.alt = image.name;

    img.className =
      "h-45 w-45 rounded-md object-cover md:h-54 md:w-54 lg:h-64 lg:w-64";

    heroContainer.appendChild(img);
  });
}

// Product card
function createProductCard(product, options = {}) {
    const {
        catalogue = false,
        horizontal = false,
        featured = false,
        showRating = true,
        showAddToCart = catalogue,
        centered = false
    } = options;

    const card = document.createElement("article");
    card.className = centered
        ? "min-w-0 overflow-hidden rounded-md text-center"
        : "flex min-w-0 flex-col";

    const link = document.createElement("a");
    link.href = product.path;
    link.className = horizontal ? "flex gap-4" : "block";

    const image = document.createElement("img");
    image.src = product.img;
    image.alt = product.name;
    image.loading = "lazy";

    image.className = horizontal
        ? "h-34 w-55 rounded-md object-cover"
        : featured
            ? "h-45 md:h-90 w-full rounded-md object-cover"
            : catalogue
                ? "aspect-square w-full rounded-md object-cover"
                : centered
                    ? "h-90 w-full rounded-md object-cover"
                    : "h-52 w-full rounded-md object-cover";

    const info = document.createElement("div");

    info.className = horizontal
        ? "min-w-0"
        : catalogue
            ? "mt-5 flex items-start justify-between gap-2"
            : centered
                ? "mt-4"
                : "mt-4 flex items-center justify-between gap-2";

    const name = document.createElement("h3");
    name.textContent = product.name;
    name.className = centered
        ? "text-lg font-medium capitalize"
        : "min-w-0 font-light uppercase";

    const details = document.createElement("div");
    details.appendChild(name);

    if (showRating) {
        const rating = document.createElement("span");
        const score = Math.max(
            0,
            Math.min(5, Math.floor(Number(product.rating) || 0))
        );

        rating.textContent =
            "★".repeat(score) + "☆".repeat(5 - score);

        rating.className = centered
            ? "mt-2 block text-gray-700"
            : "shrink-0 text-sm text-gray-700";

        rating.setAttribute(
            "aria-label",
            `Rating: ${score} out of 5 stars`
        );

        if (horizontal) {
            details.appendChild(rating);
        } else {
            info.appendChild(details);
            info.appendChild(rating);
        }
    }

    if (!showRating || horizontal) {
        info.appendChild(details);
    }

    const price = document.createElement("p");
    price.textContent = `$${Number(product.price).toFixed(2)}`;
    price.className = centered
        ? "mt-2 text-gray-700"
        : "font-light";

    if (centered) {
        info.appendChild(price);
    } else {
        details.appendChild(price);
    }

    link.appendChild(image);
    link.appendChild(info);
    card.appendChild(link);

    if (showAddToCart) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Add to Cart";
        button.className =
            "mt-4 w-full rounded-md bg-[#2F4B4D] py-2 text-white transition-colors hover:bg-gray-800";

        button.addEventListener("click", () => {
            addToCart(product);

            button.textContent = "Added to Cart";
            button.disabled = true;
            button.classList.add("opacity-70", "cursor-not-allowed");

            setTimeout(() => {
                button.textContent = "Add to Cart";
                button.disabled = false;
                button.classList.remove("opacity-70", "cursor-not-allowed");
            }, 1500);
        });

        card.appendChild(button);
    }

    return card;
}


// Featured products carousel
const featuredContainer = document.getElementById("featured-products");
const previousButton = document.getElementById("previous-products");
const nextButton = document.getElementById("next-products");

if (featuredContainer && previousButton && nextButton) {
    const featuredProducts = products.slice(0, 6);
    let currentIndex = 0;

    function getItemsPerPage() {
        return window.innerWidth < 768 ? 1 : 2;
    }

    function displayFeaturedProducts() {
        const itemsPerPage = getItemsPerPage();

        const visibleProducts = featuredProducts.slice(
            currentIndex,
            currentIndex + itemsPerPage
        );

        featuredContainer.innerHTML = "";

        visibleProducts.forEach((product) => {
            const card = createProductCard(product, 
                { featured: true, showRating: false, centered: true }
            );

            featuredContainer.appendChild(card);
        });
    }

    previousButton.addEventListener("click", () => {
        const itemsPerPage = getItemsPerPage();

        currentIndex =
            currentIndex - itemsPerPage >= 0
                ? currentIndex - itemsPerPage
                : featuredProducts.length - itemsPerPage;

        displayFeaturedProducts();
    });

    nextButton.addEventListener("click", () => {
        const itemsPerPage = getItemsPerPage();

        currentIndex =
            currentIndex + itemsPerPage < featuredProducts.length
                ? currentIndex + itemsPerPage
                : 0;

        displayFeaturedProducts();
    });

    window.addEventListener("resize", () => {
        currentIndex = Math.min(
            currentIndex,
            featuredProducts.length - getItemsPerPage()
        );

        displayFeaturedProducts();
    });

    displayFeaturedProducts();
}

// Product grid
const productGrid = document.getElementById("product-grid");

if (productGrid) {
    // Use the first 5 products
    const gridProducts = products.slice(0, 5);

    // Create the large featured product
    const featuredProduct = gridProducts[0];

    const featuredCard = document.createElement("div");
    featuredCard.className =
        "col-span-2 md:col-span-1 md:row-span-2";

    const featuredLink = document.createElement("a");
    featuredLink.href = featuredProduct.path;

    const featuredImage = document.createElement("img");
    featuredImage.src = featuredProduct.img;
    featuredImage.alt = featuredProduct.name;
    featuredImage.className =
        "h-52 w-full rounded-md object-cover md:h-[500px]";

    // Product name and rating
    const featuredInfo = document.createElement("div");
    featuredInfo.className =
        "mt-4 flex md:items-center justify-between gap-2";

    const featuredName = document.createElement("h3");
    featuredName.className = "font-light uppercase";
    featuredName.textContent = featuredProduct.name;

    featuredInfo.appendChild(featuredName);

    const featuredPrice = document.createElement("p");
    featuredPrice.className = "font-light";
    featuredPrice.textContent =
        `$${featuredProduct.price.toFixed(2)}`;

    featuredLink.appendChild(featuredImage);
    featuredLink.appendChild(featuredInfo);
    featuredLink.appendChild(featuredPrice);

    featuredCard.appendChild(featuredLink);
    productGrid.appendChild(featuredCard);

    // Create the remaining four product cards
    gridProducts.slice(1).forEach((product) => {
        const card = createProductCard(product);

        productGrid.appendChild(card);
    });
}

// Footer year
const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// Featured categories
const categoriesContainer = document.getElementById("featured-categories");

if (categoriesContainer) {
    categories.forEach((item) => {
        const card = document.createElement("div");
        card.className = "w-60 flex-none lg:w-auto";

        const link = document.createElement("a");
        link.href = item.path;
        link.className = "group block";

        const imageContainer = document.createElement("div");
        imageContainer.className = "relative overflow-hidden rounded-md";

        const image = document.createElement("img");
        image.src = item.img;
        image.alt = item.name;
        image.className =
            "h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105";

        const overlay = document.createElement("div");
        overlay.className =
            "absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30";

        const name = document.createElement("p");
        name.textContent = item.name;
        name.className =
            "mb-5 mt-3 text-center uppercase text-gray-500 transition-colors duration-200 group-hover:text-gray-800";

        imageContainer.appendChild(image);
        imageContainer.appendChild(overlay);

        link.appendChild(imageContainer);
        link.appendChild(name);
        card.appendChild(link);

        categoriesContainer.appendChild(card);
    });

    // Shop Now link
    const shopCard = document.createElement("div");
    shopCard.className = "hidden h-80 lg:block";

    const shopLink = document.createElement("a");
    shopLink.href = "shop.html?view=all";
    shopLink.textContent = "Shop Now";
    shopLink.className =
        "flex h-full w-full items-center justify-center rounded-md bg-gray-700 text-white transition-colors duration-200 hover:bg-gray-800";

    shopCard.appendChild(shopLink);
    categoriesContainer.appendChild(shopCard);
}

// Initialize the shop page after the HTML has loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeShopPage);
} else {
    initializeShopPage();
}

// Shop page layout and product filtering
function initializeShopPage() {
    const normalShop = document.getElementById("normal-shop");
    const catalogueLayout = document.getElementById("catalogue-layout");
    const featuredContainer = document.getElementById("shop-featured-products");
    const catalogueContainer = document.getElementById("catalogue-products");
    const catalogueHeading = document.getElementById("catalogue-heading");
    const noProducts = document.getElementById("no-products");
    const backToShop = document.getElementById("back-to-shop");

    if (!normalShop || !catalogueLayout || !featuredContainer ||
        !catalogueContainer || typeof products === "undefined") {
        return;
    }

    // Display the six products on the normal shop page
    featuredContainer.innerHTML = "";

    products.slice(0, 6).forEach((product) => {
        featuredContainer.appendChild(
            createProductCard(product, {
                horizontal: true,
            })
        );
    });

    const params = new URLSearchParams(window.location.search);
    const viewAll = params.get("view") === "all";
    const category = params.get("category") || "";
    const searchTerm = params.get("search") || "";

    const showCatalogue = viewAll || category !== "" || searchTerm !== "";

    if (!showCatalogue) {
        normalShop.classList.remove("hidden");
        catalogueLayout.classList.add("hidden");
        backToShop.hidden = true;
        return;
    }

    // Show catalogue and hide the normal shop
    normalShop.classList.add("hidden");
    catalogueLayout.classList.remove("hidden");
    catalogueLayout.classList.add("grid");
    backToShop.hidden = false;

    // Filter products by category or search term
    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter((product) =>
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Set the catalogue heading
    if (catalogueHeading) {
        catalogueHeading.innerHTML = "";

        const heading = document.createElement("h2");
        heading.className = "text-2xl font-light md:text-3xl";

        if (searchTerm) {
            heading.textContent = `Search results for "${searchTerm}"`;
        } else if (category) {
            heading.textContent = category;
            heading.className = "capitalize";
        } else {
            heading.textContent = "All Products";
        }

        const count = document.createElement("p");
        count.className = "mt-2 text-gray-500";
        count.textContent =
            `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`;

        catalogueHeading.appendChild(heading);
        catalogueHeading.appendChild(count);
    }

    // Display catalogue products with Add to Cart buttons
    catalogueContainer.innerHTML = "";

    if (filteredProducts.length > 0) {
        filteredProducts.forEach((product) => {
            catalogueContainer.appendChild(
                createProductCard(product, { catalogue: true })
            );
        });

        if (noProducts) {
            noProducts.classList.add("hidden");
        }
    } else if (noProducts) {
        noProducts.classList.remove("hidden");
    }
}

// Hide Featured Categories and Newsletter in catalogue view
const shopIntroSections = document.getElementById("shop-intro-sections");
const shopParams = new URLSearchParams(window.location.search);

if (shopIntroSections) {
    const viewAll = shopParams.get("view") === "all";
    const category = shopParams.get("category");
    const searchTerm = shopParams.get("search");

    if (viewAll || category || searchTerm) {
        shopIntroSections.classList.add("hidden");
    } else {
        shopIntroSections.classList.remove("hidden");
    }
}

// Product details page
const productImage = document.getElementById("product-image");

if (productImage) {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    const product = products.find((item) => item.id === productId);

    if (product) {
        productImage.src = product.img;
        productImage.alt = product.name;

        document.getElementById("product-name").textContent = product.name;
        document.getElementById("product-price").textContent =
            `$${product.price.toFixed(2)}`;

        document.getElementById("product-rating").textContent =
            "★".repeat(product.rating || 0) +
            "☆".repeat(5 - (product.rating || 0));

        document.getElementById("product-review-count").textContent =
            product.review || "No reviews yet.";

        document.getElementById("product-description").textContent =
            product.description || "Product details coming soon.";

        /* Display similar products */
        const similarProductsContainer = document.getElementById(
            "similar-products-container"
        );

        if (similarProductsContainer) {
            const similarProducts = products
                .filter(
                    (item) =>
                        item.category === product.category &&
                        item.id !== product.id
                )
                .slice(0, 3);

            similarProducts.forEach((item) => {
                const card = createProductCard(item, {
                    horizontal: true,
                });

                similarProductsContainer.appendChild(card);
            });
        }
    } else {
        document.getElementById("product-name").textContent =
            "Product not found";
    }
}