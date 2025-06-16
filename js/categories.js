const apiUrl = "https://fakestoreapi.com/products";
let products = [];
let categories = [];


function findSkuGaps(products) {
  // Group product IDs by category
  const categoryMap = {};
  products.forEach(product => {
    const cat = product.category;
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(product.id);
  });

  // For each category, find missing IDs in the range
  const gaps = {};
  for (const cat in categoryMap) {
    const ids = categoryMap[cat].sort((a, b) => a - b);
    const min = ids[0];
    const max = ids[ids.length - 1];
    const missing = [];
    for (let i = min; i <= max; i++) {
      if (!ids.includes(i)) {
        missing.push(i);
      }
    }
    if (missing.length > 0) {
      gaps[cat] = missing;
    }
  }
  return gaps;
}

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
          <div class="mt-2"><small>SKU: ${generateSku(product)}</small></div>
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

document.getElementById('searchInput').addEventListener('input', function(e) {
  const searchText = e.target.value.trim().toLowerCase();
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
});

document.getElementById('sortAsc').addEventListener('click', () => sortProducts(products, 'asc'));
document.getElementById('sortDec').addEventListener('click', () => sortProducts(products, 'dec'));


document.addEventListener('DOMContentLoaded', function() {
  const skuGapsBtn = document.getElementById('skuGapsBtn');
  if (skuGapsBtn) {
    skuGapsBtn.addEventListener('click', function() {
      const gaps = findSkuGaps(products);
      alert('Missing SKUs:\n' + JSON.stringify(gaps, null, 2));
    });
  }
});

// --------------------------
// Initialization
// --------------------------

fetchData();
