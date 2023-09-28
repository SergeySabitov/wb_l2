import '../index.html';
import '../assets/styles/index.css'
import { addProductToContainer, dateToString, drawChart, stringToDate } from './helpers';
import Chart from 'chart.js/auto';
import { updateDietProductsLocalStorage, updateProductsLocalStorage } from './updateLocalStorage';

const todayProductsContainer = document.getElementById('todayProducts');

const dietProductsContainer = document.getElementById('dietProducts')

    // Функция обновления данных на странице
function updateCalories(products) {
    const caloriesConsumedElement = document.getElementById("calories-consumed");
    const dailyCalorieGoalElement = document.getElementById("daily-calorie-goal");
    const caloriesConsumed =Math.round(products.reduce((acc, product) => acc+product.calories / 100 * product.weight, 0));
    let dailyCalorieGoal = localStorage.getItem('calorieGoal') ? JSON.parse(localStorage.getItem('calorieGoal')) : 2000;
    caloriesConsumedElement.textContent = caloriesConsumed;
    dailyCalorieGoalElement.textContent = dailyCalorieGoal;
    if (caloriesConsumed > dailyCalorieGoal) {
        // Подсветить, если превышено количество калорий
        caloriesConsumedElement.style.color = "red";
    } else {
        caloriesConsumedElement.style.color = "black";
    }
}

let products = [{
    id:0,
    name: 'Хлеб',
    weight: 200,
    calories: 78
},{
    id:1,
    name: 'Рис',
    weight: 150,
    calories: 110
}]

let dietProducts = [
    {
        id:0,
        name: 'Хлеб',
        weight: null,
        calories: 78
    },{
        id:1,
        name: 'Рис',
        weight: null,
        calories: 110
    }
]


let totalCalories = [];

let activeTab = 1;

const storageProducts = JSON.parse(localStorage.getItem('products'));

const todayDateString = dateToString(new Date())

if (storageProducts) {
    storageProducts.forEach(el => {
        let totalCaloriesElement = {
            date: el.date,
            calories: Math.round(el.items.reduce((acc,item) => acc + item.weight * item.calories/100, 0))
        };
        totalCalories.push(totalCaloriesElement);

        if (totalCaloriesElement.date === todayDateString) {
            products = el.items;
            updateCalories(products)
        }
    })
    console.log(totalCalories)
}

const storageDiet = JSON.parse(localStorage.getItem('dietProducts'));

if (storageDiet) {
    dietProducts = storageDiet;
}

products.map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories))
dietProducts.map(el => addProductToContainer(el, dietProductsContainer, dietProducts, updateDietProductsLocalStorage, updateCalories))

const addNewProductTab = document.getElementById('addNewProductTab')
const addDietProductTab = document.getElementById('addDietProductTab')
addNewProductTab.addEventListener('click', () => {
    addNewProductTab.classList.add('active');
    addDietProductTab.classList.remove('active');
    document.getElementById('tab1').style.display = 'block'
    document.getElementById('tab2').style.display = 'none'
    activeTab = 1
})

addDietProductTab.addEventListener('click', () => {
    addNewProductTab.classList.remove('active');
    addDietProductTab.classList.add('active');
    document.getElementById('tab1').style.display = 'none'
    document.getElementById('tab2').style.display = 'block'
    activeTab = 2
})

document.addEventListener('DOMContentLoaded', function () {
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.getElementById('closeModal')
    const addProductBtn = document.getElementById('addProductBtn');
    // const productContainer = document.getElementById('productContainer');

    // Открыть модальное окно
    openModalBtn.addEventListener('click', function () {
        modal.style.display = 'block';
        if (dietProducts) {
            select.innerHTML = '';
            selectItems.innerHTML = '';
            dietProducts.map(el => {
                const option = document.createElement('option')
                option.value = el.name;
                option.textContent = el.name;
                select.appendChild(option);

                const optionDiv = document.createElement('div')
                optionDiv.textContent = el.name;
                selectItems.appendChild(optionDiv);
            })

            var options = selectItems.querySelectorAll('div');

            for (var i = 0; i < options.length; i++) {
                options[i].addEventListener('click', function () {
                    selectSelected.textContent = this.textContent;
                    select.value = this.textContent;
                    selectItems.style.display = 'none';
                });
            }
        }
    });

    // Закрыть модальное окно
    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Добавить продукт
    addProductBtn.addEventListener('click', function () {
        let productName = 'product name'
        let productWeight = 0
        let productCalories = 0
        if (activeTab === 1) {
            productName = document.getElementById('productName').value;
            productWeight = +document.getElementById('productWeight').value;
            productCalories = +document.getElementById('productCalories').value;
        } else {
            productName = select.value
            productWeight = +document.getElementById('dietProductWeight').value;
            productCalories = dietProducts.find(el => el.name === select.value).calories;
        }


        let lastId = products.sort((a,b) => b.id-a.id)[0]
        const newId = lastId ? lastId + 1: 0
        const productInfo = {
            id: newId,
            name: productName,
            weight: productWeight,
            calories: productCalories,
        };

        const index = products.findIndex(el => el.name === productInfo.name && el.calories === productInfo.calories)

        if (index !== -1) {
            products[index].weight += productInfo.weight;
            todayProductsContainer.innerHTML = ''
            products.sort((a,b) => a.id -b.id).map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories))
        } else {
            products.push(productInfo)
            addProductToContainer(productInfo, todayProductsContainer, products, updateProductsLocalStorage, updateCalories)
        }

        updateCalories(products)
        drawChart()

        updateProductsLocalStorage(products, todayDateString);
        // Очистить поля ввода
        document.getElementById('productName').value = '';
        document.getElementById('productWeight').value = '';
        document.getElementById('productCalories').value = '';

        modal.style.display = 'none'; // Закрыть модальное окно после добавления продукта
    });


    const openDietModalBtn = document.getElementById('openDietModalBtn');
    const dietModal = document.getElementById('myDietModal');
    const closeDietModalBtn = document.getElementById('closeDietModal');
    const addDietProductBtn = document.getElementById('addDietProductBtn');
    // const productContainer = document.getElementById('productContainer');

    // Открыть модальное окно
    openDietModalBtn.addEventListener('click', function () {
        dietModal.style.display = 'block';
    });

    // Закрыть модальное окно
    closeDietModalBtn.addEventListener('click', function () {
        dietModal.style.display = 'none';
    });

    // Добавить продукт
    addDietProductBtn.addEventListener('click', function () {
        const productName = document.getElementById('dietProductName').value;
        const productCalories = +document.getElementById('dietProductCalories').value;


        let lastId = dietProducts.sort((a,b) => b.id-a.id)[0]
        const newId = lastId ? lastId + 1: 0
        const productInfo = {
            id: newId,
            name: productName,
            weight: null,
            calories: productCalories,
        };

        const index = dietProducts.findIndex(el => el.name === productInfo.name && el.calories === productInfo.calories)

        if (index !== -1) {
           alert('Продукт уже есть в рационе')
        } else {
            dietProducts.push(productInfo)
            addProductToContainer(productInfo, dietProductsContainer, dietProducts, updateDietProductsLocalStorage, updateCalories)
            updateDietProductsLocalStorage(dietProducts);
        }

        // Очистить поля ввода
        document.getElementById('dietProductName').value = '';
        document.getElementById('dietProductCalories').value = '';

        dietModal.style.display = 'none'; // Закрыть модальное окно после добавления продукта
    });



    // user account


    const newCalorieGoalElement = document.getElementById("new-calorie-goal");
    const setGoalButton = document.getElementById("set-goal-button");


    // Изменение установленной дозы калорий при нажатии на кнопку "Set Goal"
    setGoalButton.addEventListener("click", function () {
        const newGoal = parseInt(newCalorieGoalElement.value);
        if (!isNaN(newGoal) && newGoal >= 0) {
            localStorage.setItem('calorieGoal', newGoal)
            updateCalories(products)
            drawChart();
        }
    });
});

drawChart()

var customSelect = document.querySelector('.custom-select');
var select = customSelect.querySelector('select');
var selectSelected = customSelect.querySelector('.select-selected');
var selectItems = customSelect.querySelector('.select-items');


// Открываем или закрываем выпадающий список
selectSelected.addEventListener('click', function () {
    selectItems.style.display = selectItems.style.display === 'block' ? 'none' : 'block';
});


// Закрываем список, если щелкнули за его пределами
window.addEventListener('click', function (e) {
    if (!customSelect.contains(e.target)) {
        selectItems.style.display = 'none';
    }
});


//filter

const filterByName = document.getElementById('filterByName')
const filterByCalories = document.getElementById('filterByCalories')

filterByName.addEventListener('click', () => {
    const sortedProducts =  products.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        
        return 0;
    })
    todayProductsContainer.innerHTML = '';
    if (filterByName.classList.contains('active')) {
        filterByName.classList.toggle('asc')
        filterByName.classList.toggle('desc');
        
        if (filterByName.classList.contains('asc')) {
            filterByName.innerHTML = 'имя &#9650;'
           sortedProducts.map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories));
        } else {
            filterByName.innerHTML = 'имя &#9660;'
            sortedProducts.reverse().map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories));
        }
    } else {
        filterByName.classList.add('asc');
        filterByName.classList.add('active')
        filterByCalories.classList.remove('active')
        sortedProducts.map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories));
    }
})

filterByCalories.addEventListener('click', () => {
    const sortedProducts =  products.sort((a, b) => a.calories /100*a.weight - b.calories/100*b.weight)
    todayProductsContainer.innerHTML = '';

    if (filterByCalories.classList.contains('active')) {
        filterByCalories.classList.toggle('asc')
        filterByCalories.classList.toggle('desc');
        if (filterByCalories.classList.contains('asc')) {
            filterByCalories.innerHTML = 'ккал &#9650;'
           sortedProducts.map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories));
        } else {
            filterByCalories.innerHTML = 'ккал &#9660;'
            sortedProducts.reverse().map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories));
        }
    } else {
        filterByCalories.classList.add('asc');
        filterByCalories.classList.add('active')
        filterByName.classList.remove('active')
        sortedProducts.map(el => addProductToContainer(el, todayProductsContainer, products, updateProductsLocalStorage, updateCalories));
    }
})
