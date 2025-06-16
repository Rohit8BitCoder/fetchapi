const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

if (productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      const container = document.getElementById('product-details');
      container.innerHTML = `
      <div class="p-4" style="background-color:white">
        <div class="row">
        
          <div class="col-md-3">
            <img src="${product.image}" class="img-fluid shadow-light" alt="${product.title}">
          </div>
          <div class="col-md-7">
            <h2>${product.title}</h2>
            <h4 class="text-success fs-1">₹ ${product.price}</h4>
            <span class="badge bg-primary mb-2 fs-6 ">${product.category}</span>
            <p>${product.description}</p>
            <div>Rating: ${product.rating.rate} ⭐ (${product.rating.count} reviews)</div>
            <button id="add-to-cart-btn" class="btn btn-warning mt-3 fs-4">Add to Cart</button>
          </div>
        </div>
        </div>
      `;

      //add to card logic
      document.getElementById('add-to-cart-btn').addEventListener('click', function () {
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
        console.log('add to card by product detail page')
      });
    })
    .catch(() => {
      document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
    });
} else {
  document.getElementById('product-details').innerHTML = '<p>No product selected.</p>';
}