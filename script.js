document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-guess');
    const errorMessage = document.getElementById('error-message');
    const keyboard = document.querySelector('.keyboard');

    let currentRow = 0;
    let guessCount = 0;

    function createKeyboard() {
        const row1Keys = 'QWERTYUIOP'.split('');
        const row2Keys = 'ASDFGHJKL'.split('');
        const row3Keys = 'ZXCVBNM'.split('');

        const row1 = document.getElementById('row1');
        const row2 = document.getElementById('row2');
        const row3 = document.getElementById('row3');

        if (!row1 || !row2 || !row3) {
            console.error('One or more rows not found.');
            return;
        }

        row1Keys.forEach(key => {
            const keyElement = createKeyElement(key);
            row1.appendChild(keyElement);
        });

        row2Keys.forEach(key => {
            const keyElement = createKeyElement(key);
            row2.appendChild(keyElement);
        });

        row3Keys.forEach(key => {
            const keyElement = createKeyElement(key);
            row3.appendChild(keyElement);
        });
    }

    function createKeyElement(key) {
        const keyElement = document.createElement('div');
        keyElement.classList.add('key');
        keyElement.textContent = key;
        keyElement.addEventListener('click', () => {
            guessInput.value += key; // Append clicked key to the guess input
        });
        return keyElement;
    }

    const gameSettings = {
        wordList: [
            'apple', 'berry', 'cloud', 'delta', 'earth',
            'fairy', 'ghost', 'hotel', 'igloo', 'joker',
            'happy', 'lemon', 'mango', 'night', 'ocean',
            'pizza', 'queen', 'river', 'storm', 'tiger',
            'crush', 'viola', 'water', 'xenon', 'yogur',
            'zebra', 'yacht', 'whale', 'virus', 'union',
            'tango', 'snake', 'quick', 'panda', 'ozone',
            'mummy', 'limbo', 'kicks', 'jokes', 'happy',
            'games', 'fever', 'crazy', 'bingo', 'alert',
            'bonus', 'coach', 'death', 'eagle', 'fudge',
            'glowy', 'humor', 'infer', 'jewel', 'knife',
            'lyric', 'magic', 'noble', 'opera', 'phase',
            'quart', 'reign', 'squad', 'trick', 'unity',
            'value', 'worth', 'xenon', 'yearn', 'zodia',
            'yield', 'world', 'vixen', 'ultra', 'token',
            'story', 'spark', 'quest', 'radar', 'pixel',
            'oasis', 'north', 'metal', 'loved', 'kings',
            'jazzy', 'hawks', 'glory', 'freak', 'devil',
            'chips', 'brain', 'alias', 'bloom', 'crisp'
        ],

        fetchRandomWord: function() {
            const randomIndex = Math.floor(Math.random() * this.wordList.length);
            return this.wordList[randomIndex].toUpperCase();
        }
    };

    let targetWord = '';

    function initializeGame() {
        targetWord = gameSettings.fetchRandomWord();
        console.log('The target word is:', targetWord);
        createBoard(); // Call function to create the board
        createKeyboard(); // Call function to create the keyboard
        displayAverageGuesses(); // Display average guesses on page load
    }

    function createRow() {
        for (let i = 0; i < 5; i++) {
            let cell = document.createElement('div');
            cell.className = `cell position-${i} row-${currentRow}`;
            board.appendChild(cell);
        }
        currentRow++;
    }

    function createBoard() {
        for (let i = 0; i < 6; i++) {
            createRow();
        }
        currentRow = 0;
    }

    const validateGuess = guess => {
        if (guess.length !== 5) {
            errorMessage.textContent = 'Please enter a 5-letter word.';
            errorMessage.style.visibility = 'visible';
            return false;
        }
        errorMessage.style.visibility = 'hidden';
        return true;
    };

    const placeWordInRow = (guess, row) => {
        for (let i = 0; i < 5; i++) {
            const cell = document.querySelector(`.row-${row}.position-${i}`);
            cell.textContent = guess[i];
        }
        updateKeyboardColors(guess); // Update keyboard colors after placing word
    };

    const shadeLetters = (guess, row) => {
        const targetWordArray = targetWord.split('');
        const guessArray = guess.split('');
        const targetLetterCount = {};
        for (let i = 0; i < 5; i++) {
            if (targetWordArray[i] === guessArray[i]) {
                const cell = document.querySelector(`.row-${row}.position-${i}`);
                cell.classList.add('correct');
                targetWordArray[i] = null;
                guessArray[i] = null;
            } else {
                targetLetterCount[targetWordArray[i]] = (targetLetterCount[targetWordArray[i]] || 0) + 1;
            }
        }
        for (let i = 0; i < 5; i++) {
            const cell = document.querySelector(`.row-${row}.position-${i}`);
            if (guessArray[i] !== null) {
                if (targetLetterCount[guessArray[i]]) {
                    cell.classList.add('wrong-place');
                    targetLetterCount[guessArray[i]]--;
                } else {
                    cell.classList.add('not-in-word');
                }
            }
        }
        updateKeyboardColors(guess); // Update keyboard colors after shading letters
    };

    const checkWin = guess => guess === targetWord;

    const displayAnswer = () => {
        alert(`You win! The word was ${targetWord}`);
    };

    const getLetterStatus = (letter, position, currentGuess) => {
        const targetWordArray = targetWord.split('');
        const guessArray = currentGuess.split('');

        if (guessArray[position] === letter && targetWordArray[position] === letter) {
            return 'correct';
        } else if (targetWordArray.includes(letter) && !guessArray.includes(letter)) {
            return 'not-in-word';
        } else if (targetWordArray.includes(letter) && guessArray[position] !== letter) {
            return 'wrong-place';
        } else {
            return '';
        }
    };

    const updateKeyboardColors = () => {
        const keys = keyboard.querySelectorAll('.key');
        const currentGuess = guessInput.value.toUpperCase();

        keys.forEach((key, index) => {
            const letter = key.textContent;
            const status = getLetterStatus(letter, index, currentGuess);
            key.classList.remove('gray', 'green', 'yellow');

            if (status === 'correct') {
                key.classList.add('green');
            } else if (status === 'wrong-place') {
                key.classList.add('yellow');
            } else if (status === 'not-in-word') {
                key.classList.add('gray');
            }
        });
    };

    const checkWordAPI = async (word) => {
        const url = `https://api.datamuse.com/words?sp=${word}&max=1`; // Datamuse API endpoint for word lookup

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.length > 0; // Check if the API returns any results for the given word
        } catch (error) {
            console.error('Error checking word validity:', error);
            return false; // Handle error case
        }
    };

    submitButton.addEventListener('click', async () => {
        const currentGuess = guessInput.value.toUpperCase();
        if (!validateGuess(currentGuess)) {
            return;
        }

        const isValidWord = await checkWordAPI(currentGuess.toLowerCase());
        if (!isValidWord) {
            errorMessage.textContent = 'Invalid word, please try again.';
            errorMessage.style.visibility = 'visible';
            return;
        }

        errorMessage.style.visibility = 'hidden';
        placeWordInRow(currentGuess, currentRow);
        shadeLetters(currentGuess, currentRow);
        updateKeyboardColors(); // Update keyboard colors after processing the guess

        guessCount++;

        if (checkWin(currentGuess)) {
            displayAnswer();
            updateAverageGuesses(guessCount);
            return;
        }
        if (currentRow < 5) {
            currentRow++;
        } else {
            displayAnswer();
        }
        guessInput.value = '';
    });

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    function updateAverageGuesses(guessCount) {
        let totalGuesses = parseInt(getCookie('totalGuesses')) || 0;
        let gameCount = parseInt(getCookie('gameCount')) || 0;

        totalGuesses += guessCount;
        gameCount++;

        const averageGuesses = totalGuesses / gameCount;

        setCookie('totalGuesses', totalGuesses, 30);
        setCookie('gameCount', gameCount, 30);
        document.getElementById('average-guesses').innerText = `Average Guesses: ${averageGuesses.toFixed(2)}`;
    }

    function displayAverageGuesses() {
        let totalGuesses = parseInt(getCookie('totalGuesses')) || 0;
        let gameCount = parseInt(getCookie('gameCount')) || 0;

        if (gameCount === 0) {
            document.getElementById('average-guesses').innerText = 'Average Guesses: N/A';
        } else {
            const averageGuesses = totalGuesses / gameCount;
            document.getElementById('average-guesses').innerText = `Average Guesses: ${averageGuesses.toFixed(2)}`;
        }
    }

    initializeGame(); // Call to initialize the game when the DOM is loaded
});
