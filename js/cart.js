/* Load saved cart data */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Load saved coupon and voucher status */
let couponApplied = localStorage.getItem("couponApplied") === "true";
let couponMessage = localStorage.getItem("couponMessage") || "";

let voucherApplied = localStorage.getItem("voucherApplied") === "true";
let voucherMessage = localStorage.getItem("voucherMessage") || "";

/* Save cart data */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCartById(id) {
  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    console.error("Product not found:", id);
    return;
  }

  addToCart(product);

  const button = document.getElementById("add-to-cart");

  if (button) {
    button.textContent = "Added to Cart ✓";
    button.disabled = true;
    button.classList.add("opacity-70", "cursor-not-allowed");

    setTimeout(() => {
      button.textContent = "Add To Cart";
      button.disabled = false;
      button.classList.remove("opacity-70", "cursor-not-allowed");
    }, 1500);
  }
}


/* Add product to cart */
function addToCart(product) {
  const existingProduct = cart.find(
    (item) => item.id === product.id
  );

  if (existingProduct) {
    cart = cart.map((item) =>
      item.id === product.id
        ? {
            ...item,
            ...product,
            quantity: item.quantity + 1
          }
        : item
    );
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
}


/* Increase quantity */
function increaseQuantity(id) {
  cart = cart.map((product) =>
    product.id === id
      ? { ...product, quantity: product.quantity + 1 }
      : product
  );

  saveCart();
}


function clearDiscountsIfCartEmpty() {
  if (cart.length === 0) {
    couponApplied = false;
    couponMessage = "";

    voucherApplied = false;
    voucherMessage = "";

    localStorage.removeItem("couponApplied");
    localStorage.removeItem("couponMessage");
    localStorage.removeItem("voucherApplied");
    localStorage.removeItem("voucherMessage");
  }
}


/* Clear cart and saved discounts */
function clearCart() {
  cart = [];
  couponApplied = false;
  couponMessage = "";
  voucherApplied = false;
  voucherMessage = "";

  localStorage.removeItem("cart");
  localStorage.removeItem("couponApplied");
  localStorage.removeItem("couponMessage");
  localStorage.removeItem("voucherApplied");
  localStorage.removeItem("voucherMessage");
  localStorage.removeItem("shippingMethod");
  localStorage.removeItem("shippingCost");
}

/* Decrease quantity */
function decreaseQuantity(id) {
  cart = cart
    .map((product) =>
      product.id === id
        ? { ...product, quantity: product.quantity - 1 }
        : product
    )
    .filter((product) => product.quantity > 0);

  clearDiscountsIfCartEmpty();
  saveCart();
}


/* Apply coupon */
function applyCoupon(code) {
  const normalizedCode = code.trim().toUpperCase();

  if (normalizedCode === "ADVENTURE10") {
    couponApplied = true;
    couponMessage = "10% discount applied.";
  } else {
    couponApplied = false;
    couponMessage = "Invalid coupon code.";
  }

  localStorage.setItem("couponApplied", String(couponApplied));
  localStorage.setItem("couponMessage", couponMessage);
}

/* Apply voucher */
function applyVoucher(code) {
  const normalizedCode = code.trim().toUpperCase();

  if (normalizedCode === "GEAR20") {
    voucherApplied = true;
    voucherMessage = "Voucher applied: $20 off.";
  } else {
    voucherApplied = false;
    voucherMessage = "Invalid voucher code.";
  }

  localStorage.setItem("voucherApplied", String(voucherApplied));
  localStorage.setItem("voucherMessage", voucherMessage);
}


function removeCoupon() {
  couponApplied = false;
  couponMessage = "";

  localStorage.removeItem("couponApplied");
  localStorage.removeItem("couponMessage");
}

function removeVoucher() {
  voucherApplied = false;
  voucherMessage = "";

  localStorage.removeItem("voucherApplied");
  localStorage.removeItem("voucherMessage");
}


/* Calculate subtotal */
function getSubtotal() {
  return cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
}

/* Calculate discounts */
function getCouponDiscount() {
  return couponApplied ? getSubtotal() * 0.10 : 0;
}

function getVoucherDiscount() {
  return voucherApplied ? 20 : 0;
}

function getDiscount() {
  return getCouponDiscount() + getVoucherDiscount();
}

/* Calculate shipping */
function getShipping() {
  if (cart.length === 0) {
    return 0;
  }

  const subtotal = getSubtotal();

  if (subtotal > 600) {
    return 0;
  }

  return 20;
}

/* Calculate taxes */
function getTaxes() {
  return 0;
}

/* Calculate total */
function getTotal() {
  return getSubtotal() - getDiscount() + getShipping() + getTaxes();
}