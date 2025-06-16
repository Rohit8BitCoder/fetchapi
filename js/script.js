const api = "https://fakestoreapi.com/products";

fetch(api)
  .then((response) => response.json())
  .then((products) => {
    const productsContainer = document.getElementById('products');

    
products.forEach((product) => {
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

  
  productCard.addEventListener('click', function (e) {
    
    if (e.target.classList.contains('add-to-cart-btn')) return;
    window.location.href = `product-details.html?id=${product.id}`;
  });

  //add card logic
  productCard.querySelector('.add-to-cart-btn').addEventListener('click', function (e) {
    e.stopPropagation();
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
    console.log('add to card by index page')
    alert("item added to card")
  });

  productsContainer.appendChild(productCard);
});

  })
  .catch((error) => {
    console.error('Error fetching products:', error);
    document.getElementById('products').innerHTML = `<p class="text-danger">Failed to load products.</p>`;
  });
