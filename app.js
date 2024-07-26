
class GameModel {
    constructor() {
        this.blocks = [];
        this.score = 0;
        this.timer = 30;
        this.intervalId = null;
        this.moleIntervalId = null;
        this.createBoard();
    }

    createBoard() {
        this.blocks = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            status: 'empty'
        }));
    }

    startGame() {
        this.score = 0;
        this.timer = 30;
        this.createBoard();
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.moleIntervalId) clearInterval(this.moleIntervalId);
    }

    increaseScore() {
        this.score += 1;
    }

    decreaseTimer() {
        if (this.timer > 0) {
            this.timer -= 1;
        }
    }

    generateMoleLocation() {
        
        const currentMoles = this.blocks.filter(block => block.status === 'mole').length;
        if (currentMoles >= 3) return;

        const emptyBlocks = this.blocks.filter(block => block.status === 'empty');
        if (emptyBlocks.length === 0) return;

        const randomBlock = emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
        randomBlock.status = 'mole';
    }

    removeMole(id) {
        const block = this.blocks.find(block => block.id === id);
        if (block && block.status === 'mole') {
            block.status = 'empty';
            this.increaseScore();
        }
    }

    gameOver() {
        clearInterval(this.intervalId);
        clearInterval(this.moleIntervalId);
        alert('Time is Up!!!');
    }
}


class GameView {
    constructor() {
        this.gameBoard = document.querySelector('.game-board');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.startButton = document.getElementById('start-button');
        this.bindEvents();
    }

    renderBoard(blocks) {
        if (!blocks) return;
        this.gameBoard.innerHTML = '';
        blocks.forEach(block => {
            const div = document.createElement('div');
            div.id = `block-${block.id}`;
            div.className = block.status === 'mole' ? 'mole' : '';
            this.gameBoard.appendChild(div);
        });
    }

    increaseScore(score) {
        this.scoreElement.textContent = score;
    }

    updateTimer(timer) {
        this.timerElement.textContent = timer;
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => {
            gameController.startGame();
        });

        this.gameBoard.addEventListener('click', (event) => {
            const blockId = event.target.id.replace('block-', '');
            if (blockId) {
                gameController.handleBlockClick(parseInt(blockId, 10));
            }
        });
    }
}


class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        this.view.renderBoard(this.model.blocks);
    }

    startGame() {
        this.model.startGame();
        this.view.increaseScore(this.model.score);
        this.view.updateTimer(this.model.timer);
        this.view.renderBoard(this.model.blocks);

        this.model.intervalId = setInterval(() => {
            this.model.decreaseTimer();
            this.view.updateTimer(this.model.timer);
            if (this.model.timer <= 0) {
                this.model.gameOver();
            }
        }, 1000);

        this.model.moleIntervalId = setInterval(() => {
            this.model.generateMoleLocation();
            this.view.renderBoard(this.model.blocks);
        }, 1000);
    }

    handleBlockClick(id) {
        this.model.removeMole(id);
        this.view.increaseScore(this.model.score);
        this.view.renderBoard(this.model.blocks);
    }
}


const model = new GameModel();
const view = new GameView();
const gameController = new GameController(model, view);
