import { drawChart } from "./helpers";

const updateProductsLocalStorage = (products, dateString) => {
    let storageItems = JSON.parse(localStorage.getItem('products'));

    if (storageItems) {
        const storageItemIndex = storageItems.findIndex(el => el.date === dateString);
        if (storageItemIndex !== -1) {
            storageItems[storageItemIndex].items = products;
        } else {
            const newStorageItem = {
                date: dateString,
                items: products
            }
            storageItems.push(newStorageItem)
        }
        
    } else {
        storageItems = [];
        storageItems.push({
            date: dateString,
            items: products
        })
    }

    localStorage.setItem('products', JSON.stringify(storageItems))
    drawChart();
}

const updateDietProductsLocalStorage = (products) => {
    localStorage.setItem('dietProducts', JSON.stringify(products))
}

export {updateDietProductsLocalStorage, updateProductsLocalStorage}