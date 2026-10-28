// Searches for products that matches the search term in their name or category. Returns an array of matching products.
function searchProducts(searchTerm) {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
        return [];
    }

    return products.filter((product) =>
        product.name.toLowerCase().includes(search) ||
        (product.category || "").toLowerCase().includes(search)
    );
}

// Select all search forms on the current page.
const searchForms = document.querySelectorAll(".search-form");

// Add a submit event listener to each search form.
searchForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const input = form.querySelector(".search-input");
        const searchTerm = input.value.trim();

        if (searchTerm) {
            window.location.href =
                `shop.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
});