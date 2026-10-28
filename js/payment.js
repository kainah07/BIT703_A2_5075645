let paymentMethod = "card";
let showVoucher = false;

function getElement(id) {
  return document.getElementById(id);
}

// Get the shipping cost from localStorage for the payment page

function getPaymentShippingCost() {
  if (cart.length === 0) return 0;

  return Number(localStorage.getItem("shippingCost") || 0);
}

// Display the products in the payment summary

function displayPaymentProducts() {
  const container = getElement("shipping-cart-products");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <p class="py-4 text-gray-500">
        Your cart is empty.
      </p>
    `;
    return;
  }

  container.innerHTML = cart.map(product => `
    <div class="mb-5 flex items-center gap-4 last:mb-0">
      <img
        src="${product.img}"
        alt="${product.name}"
        class="h-20 w-20 rounded-md object-cover"
      >

      <div class="min-w-0 flex-1">
        <p class="font-light uppercase">${product.name}</p>
        <p class="text-sm text-gray-400">
          Quantity: ${product.quantity}
        </p>
      </div>

      <p class="shrink-0">
        $${(Number(product.price) * product.quantity).toFixed(2)}
      </p>
    </div>
  `).join("");
}

// Update the payment summary with subtotal, discounts, shipping, taxes, and total

function updatePaymentSummary() {
  displayPaymentProducts();

  const subtotal = getSubtotal();
  const couponDiscount = getCouponDiscount();
  const voucherDiscount = getVoucherDiscount();
  const shippingCost = getPaymentShippingCost();
  const taxes = getTaxes();

  const total = Math.max(
    0,
    subtotal - couponDiscount - voucherDiscount + shippingCost + taxes
  );

  // Subtotal
  if (getElement("shipping-subtotal")) {
    getElement("shipping-subtotal").textContent =
      `$${subtotal.toFixed(2)}`;
  }

  // Coupon discount
  if (getElement("shipping-coupon-discount")) {
    getElement("shipping-coupon-discount").textContent =
      `-$${couponDiscount.toFixed(2)}`;
  }

  const couponRow = getElement("shipping-coupon-row");

  if (couponRow) {
    couponRow.classList.toggle(
      "hidden",
      cart.length === 0 || couponDiscount <= 0
    );

    couponRow.classList.toggle(
      "flex",
      cart.length > 0 && couponDiscount > 0
    );
  }

  // Voucher discount
  if (getElement("shipping-voucher-discount")) {
    getElement("shipping-voucher-discount").textContent =
      `-$${voucherDiscount.toFixed(2)}`;
  }

  const voucherRow = getElement("shipping-voucher-row");

  if (voucherRow) {
    voucherRow.classList.toggle(
      "hidden",
      cart.length === 0 || voucherDiscount <= 0
    );

    voucherRow.classList.toggle(
      "flex",
      cart.length > 0 && voucherDiscount > 0
    );
  }

  // Shipping
  if (getElement("shipping-cost")) {
    getElement("shipping-cost").textContent =
      cart.length === 0
        ? "$0.00"
        : shippingCost === 0
          ? "FREE"
          : `$${shippingCost.toFixed(2)}`;
  }

  // Taxes
  if (getElement("shipping-taxes")) {
    getElement("shipping-taxes").textContent =
      `$${taxes.toFixed(2)}`;
  }

  // Total
  if (getElement("shipping-total")) {
    getElement("shipping-total").textContent =
      `$${total.toFixed(2)}`;
  }

  updatePaymentVoucherMessage();

  // Hide voucher entry after a voucher is successfully applied
  const voucherSection = getElement("voucher-section");

  if (voucherSection) {
    voucherSection.classList.toggle(
      "hidden",
      voucherDiscount > 0
    );
  }
}

// Voucher message display on the payment page

function updatePaymentVoucherMessage() {
  const messageElement = getElement("voucher-message");

  if (!messageElement) return;

  const message = localStorage.getItem("voucherMessage") || "";

  messageElement.textContent = message;
  messageElement.classList.toggle("hidden", message === "");

  messageElement.classList.toggle(
    "text-red-600",
    message === "Invalid voucher code."
  );

  messageElement.classList.toggle(
    "text-green-700",
    message !== "" && message !== "Invalid voucher code."
  );
}

// Toggle voucher entry section

const toggleVoucherButton = getElement("toggle-voucher");

if (toggleVoucherButton) {
  toggleVoucherButton.addEventListener("click", () => {
    showVoucher = !showVoucher;

    const voucherContent = getElement("voucher-content");
    const voucherArrow = getElement("voucher-arrow");

    if (voucherContent) {
      voucherContent.classList.toggle("hidden", !showVoucher);
    }

    if (voucherArrow) {
      voucherArrow.textContent = showVoucher ? "▲" : "▼";
    }

    toggleVoucherButton.setAttribute(
      "aria-expanded",
      String(showVoucher)
    );
  });
}

// Apply voucher form submission

const voucherForm = getElement("voucher-form");

if (voucherForm) {
  voucherForm.addEventListener("submit", event => {
    event.preventDefault();

    const voucherInput = getElement("voucher-code");

    if (!voucherInput) return;

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    applyVoucher(voucherInput.value);

    updatePaymentSummary();
  });
}

// payment method selection

function getPaymentMethod() {
  const selected = document.querySelector(
    'input[name="payment"]:checked'
  );

  return selected ? selected.value : "card";
}

function updatePaymentFields() {
  paymentMethod = getPaymentMethod();

  const cardFieldIds = [
    "card-number",
    "card-expiry",
    "card-cvv",
    "cardholder-name"
  ];

  cardFieldIds.forEach(id => {
    const field = getElement(id);

    if (!field) return;

    field.required = paymentMethod === "card";
    field.disabled = paymentMethod !== "card";
  });

  const errorElement = getElement("payment-error");

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
  }
}

document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener("change", updatePaymentFields);
});

// payment form submission

function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (cart.length === 0) {
    alert("Your cart is empty. Please add a product before checkout.");
    window.location.href = "shop.html";
    return;
  }

  if (!form.reportValidity()) {
    return;
  }

  paymentMethod = getPaymentMethod();

  /*
    Demonstration only.
    This does not process a real card or PayPal payment.
  */

  clearCart();

  // Hide the voucher section and reset the order summary
  updatePaymentSummary();

  const modal = getElement("success-modal");

  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

const paymentForm = getElement("payment-form");

if (paymentForm) {
  paymentForm.addEventListener("submit", handleSubmit);
}

// Continue shopping button on the success modal

const continueShoppingButton = getElement("continue-shopping");

if (continueShoppingButton) {
  continueShoppingButton.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
}

// Initialize the payment fields and summary on page load

updatePaymentFields();
updatePaymentSummary();
