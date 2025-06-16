function renderCart() {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  const cartItemsDiv = document.getElementById('cart-items');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cartItemsDiv.innerHTML = cart.map((item, idx) => `
      <div class="card mb-4" style="max-width:740px;">
        <div class="row g-0">
          <div class="col-md-4" style="padding-left:20px;">
            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text">₹ ${item.price}</p>
              <p class="card-text"><small class="text-muted fs-5">Quantity: ${item.quantity}</small></p>
              <button class="btn btn-danger mt-3 fs-4 remove-from-cart-btn" data-index="${idx}">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    //remove buttons
    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1);
        sessionStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', renderCart);