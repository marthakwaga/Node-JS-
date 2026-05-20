let items = [];

function fillProductDetails() {

  const select = document.getElementById('product');

  const option = select.options[select.selectedIndex];

  document.getElementById('qty').value =
    option.dataset.quantity || '';

  document.getElementById('unitPrice').value =
    option.dataset.price || '';
}


function addItem() {

  const product =
    document.getElementById('product').value;
  const qty =
    parseInt(document.getElementById('qty').value);

  const unitPrice =
    parseFloat(document.getElementById('unitPrice').value);

  const transportFee =
    parseFloat(document.getElementById('transportFee').value) || 0;

  const total =
    (qty * unitPrice) + transportFee;

  const item = {
    product,
    qty,
    unitPrice,
    transportFee,
    total
  };

  items.push(item);

  renderTable();

  calculateGrandTotal();
}


function renderTable() {

  const tbody =
    document.getElementById('itemsBody');

  tbody.innerHTML = '';

  items.forEach((item, index) => {

    tbody.innerHTML += `
      <tr>
        <td>${item.product}</td>
        <td>${item.qty}</td>
        <td>${item.unitPrice}</td>
        <td>${item.transportFee}</td>
        <td>${item.total}</td>

        <td>
          <button
            class="btn btn-danger btn-sm"
            onclick="removeItem(${index})"
          >
            Remove
          </button>
        </td>
      </tr>
    `;
  });

  document.getElementById('itemsInput').value =
    JSON.stringify(items);
}


function removeItem(index) {

  items.splice(index, 1);

  renderTable();

  calculateGrandTotal();
}


function calculateGrandTotal() {

  let total = 0;

  items.forEach(item => {
    total += item.total;
  });

  document.getElementById('grandTotal').innerText =
    `UGX ${total.toLocaleString()}`;

  document.getElementById('grandTotalInput').value =
    total;
}

// Ensure data is updated before form submit
document.querySelector('form').addEventListener('submit', function(e) {
  const itemsInput = document.getElementById('itemsInput');
  const grandTotalInput = document.getElementById('grandTotalInput');

  if (items.length === 0) {
    e.preventDefault();
    alert("Please add at least one item to the sale!");
    return;
  }

  itemsInput.value = JSON.stringify(items);
  grandTotalInput.value = items.reduce((sum, item) => sum + item.total, 0);
});