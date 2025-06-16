const slider = document.getElementById('productSlider');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

1
fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(products => {
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card product-card';
      card.innerHTML = `
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h6 class="card-title text-truncate">${product.title}...</h6>
          <p class="card-text text-muted mb-1">${product.category}</p>
          <strong class="text-success">₹${product.price}</strong>
        </div>
      `;
      slider.appendChild(card);
    });
  });


const scrollAmount = 300; 

nextBtn.addEventListener('click', () => {
  slider.scrollLeft += scrollAmount;
});

prevBtn.addEventListener('click', () => {
  slider.scrollLeft -= scrollAmount;
});
