// time

function updateClock() {
    const clockElement = document.querySelector('.clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    clockElement.textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);

updateClock();

// modal

class Modal {
    constructor(whereCreates, elemThatOpens) {
        this.body = document.querySelector(whereCreates); 
        this.elemOpenModal = document.querySelector(elemThatOpens); 
        this.modal = null;
        this.isOpen = false;
        this.modalContent = null;
    }

    open(createClassOne, createClassTwo, createClassBtn, mContent, callback) {
        this.elemOpenModal.addEventListener('click', () => {
            if (this.isOpen) return;

            this.modal = document.createElement('div');
            this.modal.classList.add(createClassOne);
            this.body.appendChild(this.modal);

            const topModal = document.createElement('div');
            topModal.classList.add(createClassTwo);
            this.modal.appendChild(topModal);

            const btn = document.createElement('button');
            btn.classList.add(createClassBtn);
            topModal.appendChild(btn);

            const imgBtn = document.createElement('img');
            imgBtn.classList.add('img_x');
            imgBtn.src = 'img/Vector (Stroke).svg';
            btn.appendChild(imgBtn);

            btn.addEventListener('click', () => {
                this.close();
            });

            this.modalContent = document.createElement('div');
            this.modalContent.classList.add(mContent);
            this.modal.appendChild(this.modalContent);

            this.isOpen = true;
            console.log('Модальное окно открыто!');

            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    }

    close() {
        if (this.modal) {
            this.body.removeChild(this.modal);
            this.isOpen = false;
            console.log('Модальное окно закрыто!');
        } else {
            console.error('Модальное окно не открыто.');
        }
    }

    content(text) {
        if (this.isOpen && this.modalContent) {
            this.modalContent.innerHTML = text;
            console.log('Контент добавлен!');
        } else {
            console.error('Модальное окно не открыто или контентное окно не создано.');
        }
    }

    bindEvents() {
        const startButton = this.modal.querySelector('.runtimer');
        const pauseButton = this.modal.querySelector('.pausetimer');
        const relaxButton = this.modal.querySelector('.relaxation');

        if (startButton && pauseButton && relaxButton) {
            startButton.addEventListener('click', () => {
                if (isRelaxing) {
                    seconds = 1500;
                    isRelaxing = false;
                    updateTimer(); 
                }
                resumeTimer();
                startButton.style.display = 'none';
                pauseButton.style.display = 'inline-block';
            });

            pauseButton.addEventListener('click', () => {
                pauseTimer();
                startButton.style.display = 'inline-block';
                pauseButton.style.display = 'none';
            });

            relaxButton.addEventListener('click', () => {
                if (isRunning) {
                    pauseTimer();
                }
                startRelaxationTimer();
                startButton.style.display = 'none';
                pauseButton.style.display = 'inline-block';
            });
        }
    }
}

const modalOne = new Modal('.container', '.app_desktop');

modalOne.open('tomato_modal', 'top_button', 'icon_close', 'modal_content', () => {
    modalOne.content(`
        <div class="app_head">
            <p class="head_app-name">Pomidoro timer</p>
            <button class="head_app-setting"> setting</button>
        </div>

        <div class="app_content">
            <div class="timer">25:00</div>
            <div class="btn_content">
                <button class="runtimer">start</button>
                <button class="pausetimer">pause</button>
                <button class="relaxation">relaxation</button>
            </div>
        </div>
    `);

    modalOne.bindEvents(); 
});



// timer pomidoro
let seconds = 1500;
let isRunning = false;
let isRelaxing = false; 
let timerID = null;
let lastMinute = Math.floor(seconds / 60); 
const tick = new Audio('au/tick.mp3');

// Обновление отображения таймера
function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timerElement = document.querySelector('.timer');
    timerElement.textContent = formatTime(minutes, remainingSeconds);

    // Проверка на изменение минуты
    if (Math.floor(seconds / 60) !== lastMinute) {
        lastMinute = Math.floor(seconds / 60);
        tick.play();
    }
}

// Форматирование времени
function formatTime(min, sec) {
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Функция для запуска таймера
function startTimer() {
    if (isRunning) return;
    isRunning = true;

    const tickFunc = () => {
        if (seconds <= 0) {
            if (isRelaxing) {
                alert("Время релаксации завершилось!");
            } else {
                alert("Время вышло!");
            }
            isRunning = false;
            tick.pause();
            tick.currentTime = 0;
            return;
        }

        seconds--;
        updateTimer();

        if (isRunning) {
            timerID = setTimeout(tickFunc, 1000);
        }
    };

    tickFunc();
}

// Функция для паузы таймера
function pauseTimer() {
    clearTimeout(timerID);
    isRunning = false;
    tick.pause(); 
}

// Функция для возобновления таймера
function resumeTimer() {
    isRunning = true;
    const tickFunc = () => {
        if (seconds <= 0) {
            if (isRelaxing) {
                alert("Время релаксации завершилось!");
            } else {
                alert("Время вышло!");
            }
            isRunning = false;
            tick.pause();
            tick.currentTime = 0; 
            return;
        }

        seconds--;
        updateTimer();

        if (isRunning) {
            timerID = setTimeout(tickFunc, 1000);
        }
    };

    tickFunc();
    tick.play();
}

// Функция для переключения на таймер релаксации
function startRelaxationTimer() {
    if (isRunning) {
        pauseTimer();
    }

    isRelaxing = true;
    seconds = 300;
    updateTimer();
    resumeTimer();
}

// Кнопка Start
startButton.addEventListener('click', () => {
    if (isRelaxing) {
        seconds = 1500; 
        isRelaxing = false;
        updateTimer();
    }
    resumeTimer();
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block'; 
});

// Кнопка Pause
pauseButton.addEventListener('click', () => {
    pauseTimer();
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none'; 
});

// Кнопка Relax 
relaxButton.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    }
    startRelaxationTimer();
    startButton.style.display = 'none'; 
    pauseButton.style.display = 'inline-block';
});


