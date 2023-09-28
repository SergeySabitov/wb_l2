import '../index.html';
import '../assets/styles/index.css'

// Get references to the input and image elements
const imageInput = document.getElementById('imageInput');
const uploadedImage = document.getElementById('uploadedImage');

const imageContainer = document.getElementById('imageContainer');


const clearAllButton = document.getElementById('clearAll');
const saveButton = document.getElementById('save');
// Add an event listener to the input element
imageInput.addEventListener('change', function () {
    const file = this.files[0]; // Get the selected file

    if (file) {
        // Create a FileReader object to read the selected file
        const reader = new FileReader();

        reader.onload = function (e) {
            // Set the src attribute of the image element to the data URL
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block'; // Make the image visible
            imageContainer.classList.remove('noImgProvide');
        };

        // Read the selected file as a data URL
        reader.readAsDataURL(file);

        // enable meme controls

        clearAllButton.disabled = false
        saveButton.disabled = false
    }
});

// Get references to the image container and the "Add Text Field" button
const addTextFieldButton = document.getElementById('addTextField');

let textFields = [];
let isDragging = false;
let offsetX, offsetY, activeTextField, lastTouchedTextField;

// Event listener for the "Add Text Field" button
addTextFieldButton.addEventListener('click', () => {
    const newTextField = createTextField();
    lastTouchedTextField = newTextField;
    newTextField.classList.add('active')
    textFields.map(el => el.classList.remove('active'))
    textFields.push(newTextField);
    imageContainer.appendChild(newTextField);

    if (textFields.length === 1) {
        document.getElementById('fontSize').disabled = false
        document.getElementById('fontColor').disabled = false
        document.getElementById('fontWeight').disabled = false
    }
});

// Create a new text field element
function createTextField() {
    const textBlock = document.createElement('div');
    const enteredText = document.getElementById('textFieldText');

    textBlock.className = 'textBlock';
    textBlock.textContent = enteredText.value ? enteredText.value : 'Жаль, что не все поймут в чем дело!';
    textBlock.style.left = '10px';
    textBlock.style.top = '10px';

    // Event listener for mouse down on the text field
    textBlock.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - textBlock.getBoundingClientRect().left;
        offsetY = e.clientY - textBlock.getBoundingClientRect().top;
        activeTextField = textBlock;
        lastTouchedTextField = textBlock;
        textFields.map(el => el.classList.remove('active'))
        lastTouchedTextField.classList.add('active')
        textBlock.style.zIndex = '1';
    });

    return textBlock;
}

// Event listener for mouse move
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX - imageContainer.getBoundingClientRect().left;
        const y = e.clientY - offsetY - imageContainer.getBoundingClientRect().top;

        if (activeTextField) {
            if (x >= 0 && x + activeTextField.offsetWidth <= imageContainer.offsetWidth &&
                y >= 0 && y + activeTextField.offsetHeight <= imageContainer.offsetHeight) {
                activeTextField.style.left = x + 'px';
                activeTextField.style.top = y + 'px';
            }
        }
    }
});

// Event listener for mouse up
document.addEventListener('mouseup', () => {
    isDragging = false;
    if (activeTextField) {
        activeTextField.style.zIndex = '0';
        activeTextField = null;
    }
});

const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const fontWeightSelect = document.getElementById('fontWeight');

// Event listener for font size change
fontSizeInput.addEventListener('input', () => {
    if (lastTouchedTextField) {
        lastTouchedTextField.style.fontSize = fontSizeInput.value + 'px';
    }
});

// Event listener for font color change
fontColorInput.addEventListener('input', () => {
    if (lastTouchedTextField) {
        lastTouchedTextField.style.color = fontColorInput.value;
    }
});

// Event listener for font weight change
fontWeightSelect.addEventListener('change', () => {
    if (lastTouchedTextField) {
        lastTouchedTextField.style.fontWeight = fontWeightSelect.value;
    }
});



// Добавьте обработчик клика к документу
document.addEventListener('click', function (event) {
    const elementsToTrack = [document.getElementById('controls'),...textFields, document.getElementById('addTextField')]
    // Проверьте, был ли клик выполнен на элементе из набора elementsToTrack или его потомках
    const isClickInsideElements = Array.from(elementsToTrack).some((element) => {
        return element.contains(event.target);
    });

    // Если клик был выполнен вне элементов elementsToTrack, выполните необходимое действие
    if (!isClickInsideElements) {
        // Здесь можно выполнить действие, например, закрыть или скрыть элементы
        // или выполнить другую логику в зависимости от места клика
        if (lastTouchedTextField) {
            lastTouchedTextField.classList.remove('active');
            lastTouchedTextField = null
        }
    }
});

//saving image


// Получите ссылку на кнопку "Сделать скрин и скачать"
const captureButton = document.getElementById('save');

// Добавьте обработчик события click к кнопке
captureButton.addEventListener('click', () => {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var background = new Image();
    background.src = uploadedImage.src;

    background.onload = function(){
        const canvasWidth = canvas.width
        // Вычисляем масштаб для ширины и высоты
        const scaleWidth = canvasWidth / background.width;
        const newWidth = canvasWidth;
        const newHeight = background.height * scaleWidth;

        // Устанавливаем размер canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Рисуем изображение
        ctx.drawImage(background, 0, 0, newWidth, newHeight);  

        textFields.map(textField => {
            
            const params = {
                fontSize: textField.style.fontSize ?  +textField.style.fontSize.slice(0,-2) : 26,
                fontWeight: textField.style.fontWeight ? textField.style.fontWeight : 'bold',
                fontColor: textField.style.color ? textField.style.color : 'white',
                left: +textField.style.left.slice(0, -2),
                top: +textField.style.top.slice(0, -2)
            }
            drawText(textField.innerHTML, params, canvas)
        })
    }
});

const drawText = (text, params, canvas) => {
    // Получите контекст <canvas>
    const context = canvas.getContext('2d');
    
    // Задайте параметры шрифта
    const fontSize = params.fontSize;
    const fontWeight = params.fontWeight
    context.font = `${fontWeight} ${fontSize}px sans-serif`;
    
    // Задайте цвет текста
    const textColor = params.fontColor;
    context.fillStyle = textColor;
    
    // Задайте максимальную ширину текстового контейнера
    const maxWidth = 350;
    
    // Разбиваем текст на строки в соответствии с максимальной шириной
    const lines = [];
    const words = text.split(' ');
    let currentLine = '';
    let finalWidth = maxWidth;
    
    for (const word of words) {
        const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
        const testWidth = context.measureText(testLine).width;
        if (testWidth <= maxWidth) {
            currentLine = testLine;
            finalWidth = testWidth
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    if (lines.length > 1) {
        finalWidth = maxWidth
    }
    
    // Определите начальные координаты для текста
    const x = params.left; // Центр по горизонтали
    const y = params.top;

    
    // Установите выравнивание текста по центру
    context.textAlign = 'center';
    
    // Отобразите текст в элементе <canvas>
    const textFieldHeight = lines.length * fontSize + (lines.length - 1)*5
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], finalWidth / 2 + x + 5, y + 10 + fontSize / 2 + (i * (fontSize + 5))); // 5 - отступ между строками
    }
}


// clear

clearAllButton.addEventListener('click', () => {
    uploadedImage.style.display = 'none'; // Make the image visible
    imageContainer.classList.add('noImgProvide');
    textFields.map(textField => {
        imageContainer.removeChild(textField);
    });
    textFields = []

    imageInput.value = ''

    const canvas = document.getElementById('myCanvas'); // Замените 'myCanvas' на ID вашего элемента

    // Получите контекст рисования <canvas>
    const ctx = canvas.getContext('2d');

    // Очистите весь холст (canvas)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    clearAllButton.disabled = true
    saveButton.disabled = true

    document.getElementById('fontSize').disabled = true
    document.getElementById('fontColor').disabled = true
    document.getElementById('fontWeight').disabled = true
})