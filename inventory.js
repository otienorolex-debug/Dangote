products =['Laptop', 'Phone', 'Headphones', 'Monitor']
 function logFirstProduct() {
    console.log(products[0]);
}

function addProduct(product) {
    products.push(product);
    console.log(`${product} has been added to the inventory.`);
}

function removeProduct(product) {
    const index = products.indexOf(product);
    if (index > -1) {
        products.splice(index, 1);
        console.log(`${product} has been removed from the inventory.`);
    } else {
        console.log(`${product} not found in the inventory.`);
    }
}

function listProducts() {
    console.log('Current Inventory:');
    products.forEach((product, index) => {
        console.log(`${index + 1}. ${product}`);
    });
}


function updateProductName(oldName, newName) {
    const index = products.indexOf(oldName);
    if (index > -1) {
        products[index] = newName;
        console.log(`${oldName} has been updated to ${newName}.`);
    } else {
        console.log(`${oldName} not found in the inventory.`);
    }
}   

function  removeLastProduct() {
    if (products.length > 0) {
        const removedProduct = products.pop();
        console.log(`${removedProduct} has been removed from the inventory.`);
    } else {
        console.log('No products to remove.');
    }
}   