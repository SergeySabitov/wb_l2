// Генерация случайного числа в заданном диапазоне
function getRandomNumber(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

let minRange = 0;
let maxRange = 100;
// Инициализация игры
function initGame() {
    const secretNumber = getRandomNumber(minRange, maxRange);
    console.log(secretNumber, minRange, maxRange)
    let attempts = 0;


    document.getElementById('shreckMessage').innerHTML = ` Эй, человечишка! Хватит стоять, начнем игру!
    <p>Тут у нас игра с числами. Нужно отгадать число от <span id="minRange">${minRange}</span> до <span id="maxRange">${maxRange}</span>. Правила просты, как два пальца! 
        Попробуй угадать!</p>`

    document.getElementById('guessButton').addEventListener('click', function () {
        const guessInput = document.getElementById('guessInput');
        const guess = parseInt(guessInput.value);
        if (attempts === 0) {
            document.getElementById('shreckImage').style.display = 'none';
            document.getElementById('shreckImage2').style.display = 'block';

        }

        let message = '';
        if (guess >= minRange && guess <= maxRange) {
            attempts++;
            if (guess === secretNumber) {
                message = `Ого, красавчик! Ты угадал, это было число ${secretNumber}. И справился всего лишь за ${attempts} попытки.`;
            } else {
                if (attempts % 3 === 0) {
                    const hint = secretNumber % 2 === 0 ? 'чётное' : 'нечётное';
                    message = `Так, держи подсказку: моё число - ${hint}.`;
                } else {
                    message =
                        guess < secretNumber ? 'Не попал, дружище. Моё число побольше!' : 'Промахнулся! Моё число чуть меньше, чем ты думаешь!';
                }
            }
        } else {
            message = 'Кажется, ты чего-то попутал. Введи число в рамках разрешенного диапазона.';
        }
        var i = 0;
        var speed = 15; /* Скорость/длительность эффекта в миллисекундах */

        function typeWriter() {
            if (i < message.length) {
                document.getElementById("shreckMessage").innerHTML = message.slice(0,i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter()
    });

    document.getElementById('resetButton').addEventListener('click', function () {
        document.getElementById('shreckImage').style.display = 'block';
        document.getElementById('shreckImage2').style.display = 'none';
        initGame();
    });
}

initGame();

// Открыть модальное окно
document.getElementById("openModal").addEventListener("click", function() {
    document.getElementById("myModal").style.display = "block";
});

// Закрыть модальное окно
document.getElementsByClassName("close")[0].addEventListener("click", function() {
    document.getElementById("myModal").style.display = "none";
});

// Применить диапазон и закрыть модальное окно
document.getElementById("applyRange").addEventListener("click", function() {
    minRange = +document.getElementById("minRangeInput").value;
    maxRange = +document.getElementById("maxRangeInput").value;

    initGame();
    // Добавьте здесь логику для применения выбранного диапазона

    document.getElementById("myModal").style.display = "none";
});