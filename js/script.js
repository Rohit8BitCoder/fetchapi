
 function generateSku(product) {

  const cat = product.category ? product.category.slice(0, 3).toUpperCase() : "GEN";
  const id = product.id;
  return `SKU-${cat}-${id}`;
}



const api = "https://fakestoreapi.com/products";

// -------------------------------------------
// Fetch and Render Products
// -------------------------------------------
fetch(api)
  .then((response) => response.json())
  .then((products) => {
    const productsContainer = document.getElementById('products');

    products.forEach((product) => {
      
       const sku = generateSku(product);
       console.log(sku);

      // Create product card
      const productCard = document.createElement('div');
      productCard.innerHTML = `
        <div class="product">
          <div class="card h-100 shadow-sm">
            <div class="d-flex justify-content-center p-3">
              <img src="${product.image}" class="img-fluid" alt="${product.title}">
            </div>
            <div class="card-body">
              <h5 class="card-title text-truncate">${product.title}</h5>
              <p class="card-text text-truncate" title="${product.description}">${product.description}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <p class="text-success fw-bold fs-5">₹ ${product.price}</p>
                <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Navigate to product details page if card (not button) is clicked
      productCard.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart-btn')) return;
        window.location.href = `product-details.html?id=${product.id}`;
      });

      // Add to cart logic
      productCard.querySelector('.add-to-cart-btn').addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent card click
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
          });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        console.log('Added to cart from index page');
        alert("Item added to cart");
      });

      // Append card to container
      productsContainer.appendChild(productCard);
    });
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
    document.getElementById('products').innerHTML = `<p class="text-danger">Failed to load products.</p>`;
  });
