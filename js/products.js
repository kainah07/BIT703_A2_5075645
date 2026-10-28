// Featured categories
const categories = [
    {
        name: "Adventure Gears",
        img: "images/category1.jpg",
        path: "shop.html?category=adventure gears"
    },
    {
        name: "Footwear",
        img: "images/category2.jpg",
        path: "shop.html?category=footwear"
    },
    {
        name: "Clothing",
        img: "images/category3.jpg",
        path: "shop.html?category=clothing"
    }
];

// Product data
const products = [
    {
        id: 1,
        name: "Backpack",
        price: 300,
        img: "images/products/backpack.jpg",
        rating: 4,
        path: "product.html?id=1",
        description: "A durable backpack designed for outdoor adventures and everyday exploring.",
        category: "adventure gears",
    },
    {
        id: 2,
        name: "Camping Tent",
        price: 450,
        img: "images/products/camping-tent.jpg",
        rating: 5,
        path: "product.html?id=2",
        description: "A reliable camping tent designed to provide comfortable shelter during outdoor adventures.",
        category: "adventure gears"
    },
    {
        id: 3,
        name: "Fleece Jacket",
        price: 150,
        img: "images/products/fleece-jacket.jpg",
        rating: 4,
        path: "product.html?id=3",
        description: "A warm and comfortable fleece jacket suitable for hiking and outdoor activities.",
        category: "clothing"
    },
    {
        id: 4,
        name: "Head Lamp",
        price: 98,
        img: "images/products/head-lamp.jpeg",
        rating: 4,
        path: "product.html?id=4",
        description: "A lightweight head lamp providing reliable hands-free lighting for outdoor adventures.",
        category: "adventure gears"
    },
    {
        id: 5,
        name: "Hiking Boots",
        price: 380,
        img: "images/products/hiking-boots.jpg",
        rating: 5,
        path: "product.html?id=5",
        description: "Durable hiking boots designed to provide comfort and support on outdoor trails.",
        category: "footwear"
    },
    {
        id: 6,
        name: "Hiking Jacket",
        price: 300,
        img: "images/products/hiking-jacket.jpg",
        rating: 4,
        path: "product.html?id=6",
        description: "A versatile hiking jacket designed to provide protection and comfort in changing weather.",
        category: "clothing"
    },
    {
        id: 7,
        name: "Hiking Pants",
        price: 240,
        img: "images/products/hiking-pants.jpg",
        rating: 4,
        path: "product.html?id=7",
        description: "Comfortable and durable hiking pants designed for outdoor exploration and active movement.",
        category: "clothing"
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 300,
        img: "images/products/running-shoes.jpg",
        rating: 4,
        path: "product.html?id=8",
        description: "Lightweight and comfortable running shoes designed for optimal performance and support.",
        category: "footwear"
    },
    {
        id: 9,
        name: "Sleeping Bag",
        price: 360,
        img: "images/products/sleeping-bag.jpg",
        rating: 5,
        path: "product.html?id=9",
        description: "A warm and comfortable sleeping bag designed for outdoor camping adventures.",
        category: "adventure gears"
    },
    {
        id: 10,
        name: "Trekking Pole",
        price: 100,
        img: "images/products/treking-pole.jpg",
        rating: 4,
        path: "product.html?id=10",
        description: "A sturdy trekking pole designed to provide support and stability during outdoor hikes.",
        category: "adventure gears"
    },
    {
        id: 11,
        name: "Trekking Sandals",
        price: 230,
        img: "images/products/treking-sandals.jpg",
        rating: 4,
        path: "product.html?id=11",
        description: "Comfortable trekking sandals designed for outdoor adventures and everyday wear.",
        category: "footwear"
    }
];


const addToCartButton = document.getElementById("add-to-cart");

if (addToCartButton) {
  addToCartButton.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (productId) {
      addToCartById(productId);
    }
  });
}
