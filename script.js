// Define a list of products available for purchase
const products = [
  { id:1, name:"Apple", price: 3},
  { id: 2, name: "Banana", price: 2 },
  { id: 3, name: "Orange", price: 4 },
  { id: 4, name: "Blueberry", price: 5 },
  { id: 5, name: "Almond", price: 2.29 },
  { id: 6, name: "Walnut", price: 4.49 },
];

// Get DOM elements
const productList = document.getElementById('product-list');
const cartDiv = document.getElementById('cart');
const totalPriceEl = document.getElementById('total-price');
const clearBtn = document.getElementById('clear-cart-btn')

// Save the current cart state to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Load cart from localStorage if available
function loadCart() {
  const storedCart = localStorage.getItem("cart");
  if(storedCart) {
    cart = JSON.parse(storedCart);
    renderCart()
  }
}

// Create an empty array to store cart items
let cart = []

// Loop through each product and display it in the product list with button
products.forEach(product => {
  const div = document.createElement('div'); // Create a container div for each product
  div.className = 'product'; // Add a CSS class for styling
  div.innerHTML = `${product.name} $${product.price}<button onclick="addToCart(${product.id})">Add to Cart</button>`; // Add the product div to the product list in the DOM
  productList.appendChild(div);
})

//  Add product to cart, or increase quantity if it already exists
function addToCart (productId) {
  const product = products.find(p => p.id === productId); // Find the product in the product list by ID
  const existingItem = cart.find(item => item.id === productId); // Check if the product is already in the cart

  if(existingItem) {
    existingItem.quantity += 1; // If the product is already in the cart, increase its quantity
  } else {
    cart.push({...product, quantity: 1});  // If not, add it to the cart with quantity 1
  }

  saveCart() // Persist cart to localStorage
  renderCart();  // Update the cart display
}

// Display the cart contents and calculate total price
function renderCart(){
  // Clear the current cart display
  cartDiv.innerHTML = "";
  // Initialize total price
  let total = 0;

  // If cart is empty, hide the cart area and exit early
  if(cart.length === 0){
    cartDiv.style.display = "none";
    totalPriceEl.textContent = "";
    return; // End the function early when the cart is empty to prevent the remaining rendering logic from executing
  }

  cartDiv.style.display = "block"; // Show cart if it has items

  // Loop through each cart item and display it
  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = "cart-item";
    div.innerHTML = `
      ${item.name} = $${item.price * item.quantity}
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${item.id})">−</button>
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)" />
        <button onclick="increaseQuantity(${item.id})">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    `;

  cartDiv.appendChild(div);
  });
  totalPriceEl.textContent = `Total: $${total}`
}

// Decrease quantity by 1 or remove item if quantity reaches 0
function decreaseQuantity(productId){
  const item = cart.find(i => i.id === productId);
  if(item){
    item.quantity -= 1;
    if(item.quantity === 0) {
      cart = cart.filter(i => i.id !== productId);
      // Remove from cart
    }
  }
  saveCart();
  renderCart();
}

// Increase item quantity by 1
function increaseQuantity(productId){
  const item = cart.find(i => i.id === productId);
  if(item) {
    item.quantity += 1;
  }
  saveCart();
  renderCart();
}

// Update quantity directly from input field
function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.id === productId);
  if(item) {
    const qty = parseInt(newQuantity);
    if(!isNaN(qty) && qty >= 1){
      item.quantity = qty;
    }
  }
  saveCart();
  renderCart();
}

// Remove item entirely from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId) // Keep only items that don't match the given ID
  saveCart();
  renderCart();
}

function clearCart(){
  cart = []
  saveCart();
  renderCart();
}

clearBtn.addEventListener('click', clearCart)

// Load cart from localStorage when the page loads
loadCart();
