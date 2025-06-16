const apiUrl = "https://fakestoreapi.com/products";
let products = [];
let categories = [];

async function fetchData() {
  const response = await fetch(apiUrl);
  products = await response.json();
  categories = [...new Set(products.map(p => p.category))];
  renderCategories();
}

function renderCategories() {
  const categoryList = document.getElementById('categoryList');
  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.className = "nav-item mb-2";
    li.innerHTML = `<a href="#" class="nav-link text-dark" data-category="${cat}">${cat}</a>`;
    categoryList.appendChild(li);
  });
}

document.getElementById('categoryList').addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const selectedCat = e.target.getAttribute('data-category');
    showProductsByCategory(selectedCat);
  }
});

function showProductsByCategory(category) {
  document.getElementById('categoryTitle').textContent = `Products in "${category}"`;
  const filtered = products.filter(p => p.category === category);
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  filtered.forEach(product => {
    const col = document.createElement('div');
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.title}" style="object-fit:contain;height:200px;">
        <div class="card-body">
          <h5 class="card-title text-truncate">${product.title}</h5>
          <p class="card-text text-muted mb-1">${product.category}</p>
          <p class="text-truncate">${product.description}</p>
          <strong class="text-success">₹${product.price}</strong>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
}

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

  // Filter products by title
  const filtered = products.filter(product =>
    product.title.toLowerCase().includes(searchText)
  );

  if (filtered.length === 0) {
    productList.style.display = 'none';
    noResults.style.display = 'block';
    productList.innerHTML = '';
  } else {
    productList.style.display = 'flex';
    noResults.style.display = 'none';
    displayProducts(filtered);
  }
});

function displayProducts(productArray) {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  productArray.forEach(product => {
    const col = document.createElement('div');
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.title}" style="object-fit:contain;height:200px;">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">$${product.price}</p>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
}

fetchData();
