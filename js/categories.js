const apiUrl = "https://fakestoreapi.com/products";
let products = [];
let categories = [];

// --------------------------
// Core Functions
// --------------------------

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    products = await response.json();
    categories = [...new Set(products.map(p => p.category))];
    renderCategories();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderCategories() {
  const categoryList = document.getElementById('categoryList');
  categoryList.innerHTML = '';
  
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.className = "nav-item mb-2";
    li.innerHTML = `
      <a href="#" class="nav-link text-dark" data-category="${cat}">
        ${cat}
      </a>
    `;
    categoryList.appendChild(li);
  });
}

// --------------------------
// Product Display Functions
// --------------------------

function displayProducts(productArray) {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  
  productArray.forEach(product => {
    const col = document.createElement('div');
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" 
             class="card-img-top" 
             alt="${product.title}" 
             style="object-fit:contain;height:200px;">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">$${product.price}</p>
          <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });

  // Add to Cart button logic
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      const product = products.find(p => p.id === id);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to cart!');
    });
  });
}

function showProductsByCategory(category) {
  document.getElementById('categoryTitle').textContent = `Products in "${category}"`;
  const filtered = products.filter(p => p.category === category);
  displayProducts(filtered);
}

// --------------------------
// Sorting Functionality
// --------------------------

function sortProducts(products, order = "asc") {
  let arr = [...products];
  let n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const shouldSwap = order === 'asc' 
        ? arr[j].price > arr[j + 1].price 
        : arr[j].price < arr[j + 1].price;
      
      if (shouldSwap) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  displayProducts(arr);
}

// --------------------------
// Event Listeners
// --------------------------

document.getElementById('categoryList').addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const selectedCat = e.target.getAttribute('data-category');
    showProductsByCategory(selectedCat);
  }
});


let searchTimeout; 

document.getElementById('searchInput').addEventListener('input', function(e) {
  clearTimeout(searchTimeout); 
  const searchText = e.target.value.trim().toLowerCase();
  searchTimeout = setTimeout(() => {
    const productList = document.getElementById('productList');
    const noResults = document.getElementById('noResults');
    
    if (searchText === "") {
      productList.style.display = 'none';
      noResults.style.display = 'none';
      productList.innerHTML = '';
      return;
    }

    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchText)
    );

    if (filtered.length === 0) {
      productList.style.display = 'none';
      noResults.style.display = 'block';
    } else {
      productList.style.display = 'flex';
      noResults.style.display = 'none';
      displayProducts(filtered);
    }
  }, 300); 
});



document.getElementById('skuGapsBtn').addEventListener('click', function() {
  const gaps = findMissingSkus(products);
  alert('Missing SKUs:\n' + JSON.stringify(gaps, null, 2));
});

document.getElementById('sortAsc').addEventListener('click', () => sortProducts(products, 'asc'));
document.getElementById('sortDec').addEventListener('click', () => sortProducts(products, 'dec'));

// --------------------------
// Initialization
// --------------------------

fetchData();