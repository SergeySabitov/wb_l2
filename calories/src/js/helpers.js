import Chart from 'chart.js/auto'

function addProductToContainer(productInfo, parentContainer, products, deleteItemHandler, updateCalories) {
    // Создаем элемент для отображения информации о продукте
    const productElement = document.createElement('div');
    productElement.classList.add('product'); // Добавляем класс для стилизации (по желанию)
    productElement.id = productInfo.id + '_product';

    // Создаем HTML-разметку для информации о продукте
    productElement.innerHTML = `
        <h2 class="productName">${productInfo.name}</h2>
        <div class="productInfo">
            ${productInfo.weight ? `<p class="productWeight">Вес: ${productInfo.weight} г</p>`: ''}
            <p class="productCalories">${productInfo.weight ? 
                `Калории: ${Math.round(productInfo.calories / 100 * productInfo.weight)} ккал` : 
                `Калории: ${productInfo.calories} ккал`}
            </p>
        </div>
    `;

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('deleteIcon');
    deleteIcon.innerHTML = '&#10005;';

    productElement.appendChild(deleteIcon);

    deleteIcon.addEventListener('click', () => {
        parentContainer.removeChild(productElement)
        const elementIndex = products.findIndex(el => el.id === productInfo.id);
        products.splice(elementIndex,1);
        const todayDateString = dateToString(new Date())
        deleteItemHandler(products, todayDateString);
        updateCalories(products)
    })

    // Добавляем элемент с информацией о продукте в родительский контейнер
    parentContainer.appendChild(productElement);
}

const dateToString = (date) => {
    var day = date.getDate();
    var month = date.getMonth() + 1; // Месяцы в JavaScript нумеруются с 0 (январь) до 11 (декабрь)
    var year = date.getFullYear();
    
    // Добавляем ведущий ноль к дню и месяцу, если они состоят из одной цифры
    if (day < 10) {
        day = '0' + day;
    }
    
    if (month < 10) {
        month = '0' + month;
    }
    
    // Формируем строку в формате "DD-MM-YYYY"
    return day + '-' + month + '-' + year;

}

const stringToDate = (dateString) => {

// Разбиваем строку на день, месяц и год
    var parts = dateString.split("-");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Месяцы в JavaScript нумеруются с 0 (январь)
    var year = parseInt(parts[2], 10);

    return new Date(year, month, day);
}

const drawChart = () => {

    const chartContainer = document.getElementsByClassName('chart-container')[0]
    chartContainer.innerHTML = ''

    const newCanvas = document.createElement('canvas')
    newCanvas.id ='muChart'

    chartContainer.appendChild(newCanvas)

    
    const storageProducts = JSON.parse(localStorage.getItem('products'));
    let totalCalories = []
    if (storageProducts) {
        storageProducts.forEach(el => {
            let totalCaloriesElement = {
                date: el.date,
                calories: Math.round(el.items.reduce((acc,item) => acc + item.weight * item.calories/100, 0))
            };
            totalCalories.push(totalCaloriesElement)
        })
    }
    var ctx = newCanvas.getContext('2d');


    let dailyCalorieGoal = localStorage.getItem('calorieGoal') ? JSON.parse(localStorage.getItem('calorieGoal')) : 2000;
    var data = {
        labels: totalCalories.map(el => el.date),
        datasets: [
            {
                label: 'Потребленные каллории',
                data: totalCalories.map(el => el.calories),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                type: 'bar', // Specify the chart type as 'bar'
            },
            {
                label: 'Цель',
                data: totalCalories.map(el => dailyCalorieGoal),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
                type: 'bar', // Specify the chart type as 'line'
            }
        ]
    };

    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    var myChart = new Chart(ctx, {
        type: 'bar', // Specify the default chart type
        data: data,
        options: options
    });

}
export {addProductToContainer, dateToString, stringToDate, drawChart}