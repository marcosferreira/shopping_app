const db = new Dexie('ShoppingApp');
db.version(1).stores({ items: '++id,description,prince,isPurchased' });

const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalPriceDiv = document.getElementById('totalPriceDiv');

const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray();

    itemsDiv.innerHTML = allItems.map(item =>
        `<div class="item ${item.isPurchase && 'purchased'}">
            <label for="itemCheck">
                <input
                    type="checkbox"
                    name="itemCheck"
                    id="itemCheck"
                    class="checkbox"
                    onchange="toggleItemStatus(event, ${item.id})"
                    ${item.isPurchase && 'checked'}>
            </label>

            <div class="itemInfo">
                <p>${item.name}</p>
                <p>$${item.price} x ${item.quantity}</p>
            </div>

            <button class="deleteButton" onclick="removeItem(${item.id})">
                x
            </button>
        </div>`
    ).join('');

    const arrayOfPrices = allItems.map(item => item.price * item.quantity);
    const totalPrice = arrayOfPrices.reduce((a,b) => a+b, 0);

    totalPriceDiv.innerHTML = `Total price: ${totalPrice}`;
}

window.onload = populateItemsDiv;

itemForm.onsubmit = async (event) => {
    event.preventDefault();

    const name = document.getElementById('nameInput').value;
    const quantity = document.getElementById('quantityInput').value;
    const price = document.getElementById('priceInput').value;

    await db.items.add({ name, quantity, price });
    await populateItemsDiv();

    itemForm.reset();
}

const toggleItemStatus = async (event, id) => {
    await db.items.update(id, { isPurchase: !!event.target.checked});
    await populateItemsDiv()
}

const removeItem = async (id) => {
    await db.items.delete(id);
    await populateItemsDiv();
}