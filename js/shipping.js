
let selectedShippingMethod =
  localStorage.getItem("shippingMethod") || "";

let showVoucher = false;

function getSelectedShippingMethod() {
  const selected = document.querySelector(
    'input[name="shipping"]:checked'
  );

  return selected ? selected.value : selectedShippingMethod;
}

function calculateShippingCost() {
  if (cart.length === 0) return 0;

  const subtotal = getSubtotal();
  const method = getSelectedShippingMethod();

  if (method === "next-day") {
    return subtotal > 600 ? 5 : 25;
  }

  return subtotal > 600 ? 0 : 20;
}

function updateShippingOptions() {
  const subtotal = getSubtotal();

  document.getElementById("standard-shipping-label").textContent =
    subtotal > 600
      ? "Free Shipping"
      : "Standard Shipping - $20.00";

  document.getElementById("next-day-label").textContent =
    subtotal > 600
      ? "Next Day Delivery - $5.00"
      : "Next Day Delivery - $25.00";

  const standardRadio = document.querySelector(
    'input[name="shipping"][value="standard"]'
  );

  const nextDayRadio = document.querySelector(
    'input[name="shipping"][value="next-day"]'
  );

  // Restore the saved method when it is still available.
  // Otherwise, select standard shipping for orders over $600.
  if (selectedShippingMethod === "standard") {
    standardRadio.checked = true;
  } else if (selectedShippingMethod === "next-day") {
    nextDayRadio.checked = true;
  } else if (subtotal > 600) {
    standardRadio.checked = true;
  } else {
    nextDayRadio.checked = true;
  }

  selectedShippingMethod = getSelectedShippingMethod();
}

function updateShippingSummary() {
  const productsContainer = document.getElementById(
    "shipping-cart-products"
  );

  productsContainer.innerHTML = cart.map(product => `
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
        $${(product.price * product.quantity).toFixed(2)}
      </p>
    </div>
  `).join("");

  const subtotal = getSubtotal();
  const couponDiscount = getCouponDiscount();
  const voucherDiscount = getVoucherDiscount();
  const shippingCost = calculateShippingCost();
  const taxes = getTaxes();


  // Save shipping selection for the payment page.
  localStorage.setItem("shippingMethod", selectedShippingMethod);
  localStorage.setItem("shippingCost", String(shippingCost));

  document.getElementById("shipping-subtotal").textContent =
    `$${subtotal.toFixed(2)}`;

  document.getElementById("shipping-coupon-discount").textContent =
    `-$${couponDiscount.toFixed(2)}`;

  document.getElementById("shipping-voucher-discount").textContent =
    `-$${voucherDiscount.toFixed(2)}`;

  const couponRow = document.getElementById("shipping-coupon-row");
  couponRow.classList.toggle("hidden", couponDiscount === 0);
  couponRow.classList.toggle("flex", couponDiscount > 0);

  const voucherRow = document.getElementById("shipping-voucher-row");
  voucherRow.classList.toggle("hidden", voucherDiscount === 0);
  voucherRow.classList.toggle("flex", voucherDiscount > 0);

  document.getElementById("shipping-cost").textContent =
    cart.length === 0
      ? "$0.00"
      : shippingCost === 0
        ? "FREE"
        : `$${shippingCost.toFixed(2)}`;

  document.getElementById("shipping-taxes").textContent =
    `$${taxes.toFixed(2)}`;

  const total =
    subtotal - couponDiscount - voucherDiscount + shippingCost + taxes;

  document.getElementById("shipping-total").textContent =
    `$${total.toFixed(2)}`;

  // Restore voucher message.
  const voucherMessageElement =
    document.getElementById("voucher-message");

  const savedVoucherMessage =
    localStorage.getItem("voucherMessage") || "";

  voucherMessageElement.textContent = savedVoucherMessage;
  voucherMessageElement.classList.toggle(
    "hidden",
    savedVoucherMessage === ""
  );

  voucherMessageElement.classList.toggle(
    "text-red-600",
    savedVoucherMessage === "Invalid voucher code."
  );

  voucherMessageElement.classList.toggle(
    "text-green-700",
    savedVoucherMessage !== "" &&
    savedVoucherMessage !== "Invalid voucher code."
  );

  // Hide voucher entry once the voucher has been applied.
  document.getElementById("voucher-section").classList.toggle(
    "hidden",
    voucherDiscount > 0
  );
}


// Toggle voucher input.
document.getElementById("toggle-voucher").addEventListener("click", () => {
  showVoucher = !showVoucher;

  document.getElementById("voucher-content").classList.toggle(
    "hidden",
    !showVoucher
  );

  document.getElementById("voucher-arrow").textContent =
    showVoucher ? "▲" : "▼";
});


// Apply voucher.
document.getElementById("voucher-form").addEventListener("submit", event => {
  event.preventDefault();

  const voucherCode =
    document.getElementById("voucher-code").value;

  applyVoucher(voucherCode);
  updateShippingSummary();
});


// Update price when shipping option changes.
document.querySelectorAll('input[name="shipping"]').forEach(radio => {
  radio.addEventListener("change", () => {
    selectedShippingMethod = radio.value;
    updateShippingSummary();
  });
});


// Validate the form and continue to payment.
document.getElementById("shipping-form").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty. Please add a product before checkout.");
    window.location.href = "shop.html";
    return;
  }

  const form = event.currentTarget;

  if (!form.reportValidity()) return;

  const shippingDetails = {
    firstName: document.getElementById("first-name").value.trim(),
    lastName: document.getElementById("last-name").value.trim(),
    address: document.getElementById("address").value.trim(),
    address2: document.getElementById("address2").value.trim(),
    country: document.getElementById("country").value,
    city: document.getElementById("city").value.trim(),
    postalCode: document.getElementById("postal-code").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };

  localStorage.setItem(
    "shippingDetails",
    JSON.stringify(shippingDetails)
  );

  localStorage.setItem("shippingMethod", selectedShippingMethod);
  localStorage.setItem(
    "shippingCost",
    String(calculateShippingCost())
  );

  window.location.href = "payment.html";
});


// Initialize the page.
updateShippingOptions();
updateShippingSummary();
