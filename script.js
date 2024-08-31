let startScreen = document.querySelector('.start_screen')
let gameArea = document.querySelector('.main_game__area')
let airArea = document.querySelector('.air_area')


let speed = 15;
let snowflakeSpeed = 1;
let snowflakesLimit = 15;


function startGame() {
    let minutes = document.querySelector('.minutes')
    let seconds = document.querySelector('.seconds')

    let currentSeconds = "00";
    let currentMinutes = "00";
    minutes.textContent = currentMinutes;
    seconds.textContent = currentSeconds;
    document.querySelector('.timer').style.display = 'block'
    document.querySelector(".gameOver_screen").style.display = 'none'
    document.querySelector(".win_screen").style.display = 'none'
    let isBoost = false;
    let audio = new Audio('background_song.mp3');
    audio.volume = 0.5;
    audio.loop = true;
    audio.play();

    let fish = document.querySelector(".fish")
    let messageArea = document.querySelector(".message_area")
    let messageText = document.querySelector(".message_area_text")
    let messageTimer = document.querySelector(".boost_timer")

    var timer = setInterval(function () {

        currentSeconds = parseInt(document.querySelector('.seconds').textContent)
        currentMinutes = parseInt(document.querySelector('.minutes').textContent)
        if (currentSeconds == 59) {
            currentMinutes += 1;
            if (currentMinutes == 3) {
                isBoost = true
            }
            if (currentMinutes == 10) {

                document.querySelectorAll('.snowflake').forEach((snowflake) => {
                    gameArea.removeChild(snowflake)
                })
                document.querySelector(".timer").style.display = 'none'
                document.querySelector(".win_screen").style.display = 'block'
            }
            currentSeconds = 0;
            snowflakeSpeed = snowflakeSpeed * 1.2
            snowflakesLimit += 5;
        }
        else { currentSeconds += 1; }
        if (currentSeconds < 10) {
            seconds.textContent = "0" + currentSeconds;
        } else {
            seconds.textContent = currentSeconds;
        }
        if (currentMinutes < 10) {
            minutes.textContent = "0" + currentMinutes;
        } else {
            minutes.textContent = currentMinutes;
        }
    }, 1000)

    function createRandomsnowflake() {
        const snowflake = document.createElement('div')
        const size = getRandomNumber(10, 50)
        const width = document.documentElement.clientWidth
        const x = getRandomNumber(size, width - size)
        const y = 0

        const item = getRandomNumber(1, 5)
        snowflake.classList.add('snowflake')
        snowflake.style.top = `${y}px`
        snowflake.style.left = `${x}px`

        if (item == 3 && isBoost && !fish.classList.contains("fish_immortality") && document.querySelectorAll('.boostItem').length == 0) {
            snowflake.classList.add('boostItem')
            snowflake.style.width = `20px`
            snowflake.style.height = `20px`
            const whatBoost = getRandomNumber(1, 1)
            if (whatBoost == 1) {
                snowflake.classList.add('fish_immortality_item')
                snowflake.style.backgroundImage = `url("immortality_item.png")`
            }
        }

        else {
            snowflake.style.width = `${size}px`
            snowflake.style.height = `${size}px`

            const snowflakeImg = getRandomNumber(1, 5)
            const snowflakeRotate = getRandomNumber(0, 10)
            snowflake.style.rotate = `${snowflakeRotate}deg`
            snowflake.style.backgroundImage = `url("Snowflake${snowflakeImg}.png")`
        }

        gameArea.append(snowflake)


        let forInterval = getRandomNumber(0.01, 50)
        var snowflakeDown = setInterval(function () {
            let fishPosition = fish.getBoundingClientRect();
            const testElem = document.createElement('div');
            testElem.style.width = "2px";
            testElem.style.position = "absolute";
            testElem.style.height = "2px"
            testElem.style.backgroundColor = "blue"
            testElem.style.top = fishPosition.y + "px"
            testElem.style.left = fishPosition.x + "px"


            let snowflakePosition = snowflake.getBoundingClientRect();
            if (snowflakePosition.y + snowflakePosition.height < document.documentElement.clientHeight - snowflakePosition.height / 3) {
                snowflake.style.top = parseInt(snowflake.style.top) + snowflakeSpeed + 'px'

                if (((snowflakePosition.x >= fishPosition.x && snowflakePosition.x <= fishPosition.x + fishPosition.width)
                    || (snowflakePosition.x + parseInt(snowflake.style.width) >= fishPosition.x
                        && snowflakePosition.x + parseInt(snowflake.style.width) <= fishPosition.x + fishPosition.width)) &&
                    ((snowflakePosition.y >= fishPosition.y && snowflakePosition.y <= fishPosition.y + fishPosition.height)
                        || (snowflakePosition.y + parseInt(snowflake.style.height) >= fishPosition.y
                            && snowflakePosition.y + parseInt(snowflake.style.height) <= fishPosition.y + fishPosition.height)
                    )) {
                    if (snowflake.classList.contains('boostItem')) {
                        if (snowflake.classList.contains('fish_immortality_item')) {
                            let takeAudio = new Audio('take_item_sound.mp3');
                            takeAudio.volume = 1;
                            takeAudio.loop = false;
                            takeAudio.play();

                            fish.classList.add('fish_immortality')
                            messageArea.style.display = 'flex'
                            messageText.textContent = `Неуязвимость:`;
                            messageTimer.textContent = "10"
                            var boostTimer = setInterval(function () {
                                currentBoostSeconds = parseInt(messageTimer.textContent)
                                console.log(currentBoostSeconds)
                                currentBoostSeconds -= 1
                                messageTimer.textContent = currentBoostSeconds;
                            }, 1000)

                            const fishImmortalityset = setTimeout(() => {
                                fish.classList.remove('fish_immortality')
                                messageArea.style.display = 'none'
                                clearInterval(boostTimer)
                            }, 10000)
                        }

                        gameArea.removeChild(snowflake)

                    } else if (!fish.classList.contains("fish_immortality")) {
                        clearInterval(snowflakeDown)
                        audio.pause();
                        clearInterval(timer)
                        let deathAudio = new Audio('death.mp3');
                        deathAudio.volume = 1;
                        deathAudio.loop = false;
                        deathAudio.play();
                        document.querySelectorAll('.snowflake').forEach((snowflake) => {
                            gameArea.removeChild(snowflake)
                        })

                        document.querySelector(".gameOver_screen").style.display = 'block'
                        document.querySelector(".timer_count").textContent = document.querySelector('.timer').textContent
                        document.querySelector(".timer").style.display = 'none'
                    }


                }
            } else {
                clearInterval(snowflakeDown)
                gameArea.removeChild(snowflake)
                while (document.querySelectorAll('.snowflake').length < snowflakesLimit) {
                    createRandomsnowflake()
                }

            }

        }, forInterval)

    }

    function getRandomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min)
    }

    while (document.querySelectorAll('.snowflake').length < snowflakesLimit) {
        createRandomsnowflake();
    }






    startScreen.style.display = 'none';
    gameArea.style.display = 'flex'


    document.addEventListener('keydown', move)
    // Функция премещения
    function move(event) {

        let fishHead = document.querySelector(".fish_head")
        let fishBody = document.querySelector(".fish_body")

        let c = fish.getBoundingClientRect(); // Получаем текущую позицию
        let y = document.body.scrollTop + c.top; // Получаем позицию по Y
        let x = document.body.scrollLeft + c.left; // Получаем опзицию по X

        // Движение влево
        if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
            fish.style.left = parseInt(fish.style.left) - speed + 'px';

            if (parseInt(fish.style.left) < 0) {
                fish.style.left = (window.screen.width - parseInt(fish.style.width)) + 'px'
            }
            fishBody.style.order = 2;
            fishHead.style.order = 1;

        }

        if (event.code == 'KeyD' || event.code == 'ArrowRight') {
            window.screen.width, fish.style.left
            fish.style.left = parseInt(fish.style.left) + speed + 'px';
            if (parseInt(fish.style.left) > (window.screen.width - parseInt(fish.style.width))) {
                fish.style.left = 0
            }
            fishBody.style.order = 1;
            fishHead.style.order = 2;
        }
    }
}

