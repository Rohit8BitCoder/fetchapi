function renderCartTotals(subtotal,tax,total,discount){
  document.getElementById('cart-totals').innerHTML =`
  <div class="card mb-4" style="max-width:740px;">
      <div class="card-body d-flex flex-column align-items-end">
  <div> <h4>Subtotal: ₹${subtotal}</h4></div>
    <div><h4>Tax (18%): ₹${tax}</h4></div>
    <div><h4>Discount: ₹${discount}</h4></div>
    <div><h4><strong>Total: ₹${total}</h4></strong></div>
    </div>
    </div>`
}


// Cart total calculator with tax and discount logic.

function calculatorTotal(items , taxRate , discount){
  const subtotal = items.reduce ((acc,item)=> acc + (item.price * item.quantity),0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax - discount;
  
  return { 
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total > 0 ? total.toFixed(3): '0.00',
    discount: discount.toFixed(2)};
 
}

// -------------------------------------------
// Render Cart Function
// -------------------------------------------
function renderCart() {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  const totals = calculatorTotal(cart,18,30);
   renderCartTotals(totals.subtotal, totals.tax, totals.total, totals.discount);

  const cartItemsDiv = document.getElementById('cart-items');

  // If cart is empty
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  // If cart has items
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
            <p class="card-text">
              <small class="text-muted fs-5">Quantity: ${item.quantity}</small>
            </p>
            <button 
              class="btn btn-danger mt-3 fs-4 remove-from-cart-btn" 
              data-index="${idx}">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Add event listeners to all remove buttons
  document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      cart.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(cart));
      renderCart(); // Re-render after removal
    });
  });
}

// -------------------------------------------
// Initial render on DOMContentLoaded
// -------------------------------------------
document.addEventListener('DOMContentLoaded', renderCart);



