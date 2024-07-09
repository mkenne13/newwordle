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
    }

    function displayAverageGuesses() {
        const averageGuessesElement = document.getElementById('average-guesses-value');
        const averageGuesses = calculateAverageGuesses();
        averageGuessesElement.textContent = averageGuesses.toFixed(2);
    }

    function calculateAverageGuesses() {
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];
        const totalGuesses = guesses.reduce((total, guess) => total + guess, 0);
        return guesses.length ? totalGuesses / guesses.length : 0;
    }

    function updateAverageGuesses(newGuesses) {
        const guesses = JSON.parse(localStorage.getItem('guesses')) || [];
        guesses.push(newGuesses);
        localStorage.setItem('guesses', JSON.stringify(guesses));
    }

    function checkGuess(guess) {
        if (guess.length !== 5) {
            showErrorMessage('Guess must be a 5-letter word.');
            return;
        }

        if (!gameSettings.wordList.includes(guess.toLowerCase())) {
            showErrorMessage('Invalid word.');
            return;
        }

        updateBoard(guess);
    }

    function updateBoard(guess) {
        const rowCells = document.querySelectorAll(`.row-${guessCount}`);
        guess.split('').forEach((letter, index) => {
            const cell = rowCells[index];
            cell.textContent = letter;

            if (letter === targetWord[index]) {
                cell.classList.add('correct');
            } else if (targetWord.includes(letter)) {
                cell.classList.add('wrong-place');
            } else {
                cell.classList.add('not-in-word');
            }
        });

        guessCount++;
        if (guess === targetWord) {
            showErrorMessage('Congratulations! You guessed the word!', false);
            updateAverageGuesses(guessCount);
            displayAverageGuesses();
            return;
        }

        if (guessCount === 6) {
            showErrorMessage(`Game over! The word was ${targetWord}.`);
            return;
        }

        guessInput.value = '';
        guessInput.focus();
    }

    function showErrorMessage(message, show = true) {
        errorMessage.textContent = message;
        errorMessage.style.visibility = show ? 'visible' : 'hidden';
    }

    submitButton.addEventListener('click', () => {
        const guess = guessInput.value.toUpperCase();
        checkGuess(guess);
    });

    initializeGame();
});
