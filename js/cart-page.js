function updateCartDisplay() {
  const cartProducts = document.getElementById("cart-products");
  const emptyCart = document.getElementById("empty-cart");
  const cartButtons = document.getElementById("cart-buttons");
  const mobileCartButtons = document.getElementById("mobile-cart-buttons");

  if (!cartProducts || !emptyCart || !cartButtons) return;

  if (cart.length === 0) {
    cartProducts.innerHTML = "";
    emptyCart.classList.remove("hidden");
    cartButtons.classList.add("hidden");

    if (mobileCartButtons) {
      mobileCartButtons.classList.add("hidden");
    }

    // Clear coupon message when cart is empty
    if (couponMessageElement) {
      couponMessageElement.textContent = "";
      couponMessageElement.classList.add("hidden");
    }

    // Clear saved discounts when cart is empty
    clearDiscountsIfCartEmpty();
    
  } else {
    emptyCart.classList.add("hidden");
    cartButtons.classList.remove("hidden");
    cartButtons.classList.add("flex");

    if (mobileCartButtons) {
      mobileCartButtons.classList.remove("hidden");
      mobileCartButtons.classList.add("flex");
    }

    cartProducts.innerHTML = cart.map(product => `
      <article class="grid grid-cols-1 gap-5 border-b py-5 md:grid-cols-4">

        <!-- Product image -->
        <div>
          <img
            src="${product.img}"
            alt="${product.name}"
            class="h-32 w-full rounded-md object-cover"
          >
        </div>

        <!-- Product information -->
        <div class="md:col-span-2">
          <h2 class="font-light uppercase">
            ${product.name}
          </h2>

          <p class="mt-2 text-sm text-gray-400">
            ${product.description}
          </p>

          <p class="mt-2">
            $${Number(product.price).toFixed(2)}
          </p>
        </div>

        <!-- Quantity controls -->
        <div class="flex items-center md:justify-end">
          <div class="flex items-center border">
            <button
              type="button"
              onclick="handleCartDecrease(${product.id}); updateCartDisplay()"
              class="px-3 py-2 hover:bg-gray-100"
            >−</button>

            <span class="px-4">${product.quantity}</span>

            <button
              type="button"
              onclick="increaseQuantity(${product.id}); updateCartDisplay()"
              class="px-3 py-2 hover:bg-gray-100"
            >+</button>
          </div>
        </div>

      </article>
    `).join("");

  }

  // Update cart summary
  document.getElementById("cart-subtotal").textContent =
    `$${getSubtotal().toFixed(2)}`;

  // Update cart summary with discount, shipping, taxes, and total
  document.getElementById("cart-discount").textContent =
    `-$${getCouponDiscount().toFixed(2)}`;

  const shipping = getShipping();

  // Update shipping display based on cart contents
  document.getElementById("cart-shipping").textContent =
    cart.length === 0
      ? "$0.00"
      : shipping === 0
        ? "FREE"
        : `$${shipping.toFixed(2)}`;

  // Update taxes display
  document.getElementById("cart-taxes").textContent =
    `$${getTaxes().toFixed(2)}`;

  // Update total display
  document.getElementById("cart-total").textContent =
    `$${getTotal().toFixed(2)}`;

  const discountRow = document.getElementById("discount-row");
  const couponDiscount = getCouponDiscount();

  document.getElementById("cart-discount").textContent =
    `-$${couponDiscount.toFixed(2)}`;

  if (discountRow) {
    discountRow.classList.toggle(
      "hidden",
      cart.length === 0 || couponDiscount <= 0
    );

    discountRow.classList.toggle(
      "flex",
      cart.length > 0 && couponDiscount > 0
    );
  }
}

// Removes a product from the cart based on its ID, updates the cart in localStorage, and refreshes the cart display.
function removeCartProduct(id) {
  cart = cart.filter((product) => product.id !== id);

  clearDiscountsIfCartEmpty();
  saveCart();
  updateCartDisplay();
}



let productToRemove = null;

// Shows a confirmation modal when the user tries to remove a product from the cart.
function showRemoveConfirmation(product) {
  productToRemove = product;

  document.getElementById("remove-product-name").textContent =
    product.name;

  const modal = document.getElementById("remove-confirm-modal");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

// Hides the confirmation modal and resets the productToRemove variable.
function hideRemoveConfirmation() {
  const modal = document.getElementById("remove-confirm-modal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");

  productToRemove = null;
}

// Shows a confirmation modal when the user tries to decrease the quantity of a product to zero. 
function handleCartDecrease(id) {
  const product = cart.find(item => item.id === id);

  if (!product) return;

  if (product.quantity === 1) {
    showRemoveConfirmation(product);
  } else {
    decreaseQuantity(id);
    updateCartDisplay();
  }
}

  // Apply coupon
const couponForm = document.getElementById("coupon-form");
const couponInput = document.getElementById("coupon-code");
const couponMessageElement = document.getElementById("coupon-message");

function displayCouponMessage(message) {
  couponMessageElement.textContent = message;
  couponMessageElement.classList.remove("hidden");

  couponMessageElement.classList.toggle(
    "text-red-600",
    message === "Invalid coupon code."
  );

  couponMessageElement.classList.toggle(
    "text-green-700",
    message === "10% discount applied."
  );
}

// Restore the saved coupon message
const savedCouponMessage = localStorage.getItem("couponMessage") || "";

if (savedCouponMessage && couponMessageElement) {
  displayCouponMessage(savedCouponMessage);
}

if (couponForm && couponInput && couponMessageElement) {
  couponForm.addEventListener("submit", function (event) {
    event.preventDefault();

    applyCoupon(couponInput.value);

    const message = localStorage.getItem("couponMessage") || "";
    displayCouponMessage(message);

    updateCartDisplay();
  });
}

updateCartDisplay();

document.getElementById("cancel-remove").addEventListener("click", () => {
  hideRemoveConfirmation();
});

document.getElementById("confirm-remove").addEventListener("click", () => {
  if (productToRemove) {
    removeCartProduct(productToRemove.id);
    hideRemoveConfirmation();
  }
});
