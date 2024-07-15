
export default class GameController {

    constructor(gameView, game) {
        this.game = game;
        this.user = this.game.getFirstPlayer();
        this.computer = this.game.getSecondPlayer();

        this.gameView = gameView;
        this.userView = this.gameView.getFirstPlayerView();
        this.computerView = this.gameView.getSecondPlayerView();

        this.bindCallbacks();

        this.gameState = null;
        this.gameView.clearPlayerViews();
        this.setGameState('main_menu');
    }

    bindCallbacks() {
        this.gameView.setDiceClickCallback((index, checked, playerView) => {
            this.onDiceClicked(index, checked, playerView);
        });

        this.gameView.setPlayButtonCallback(() => {
            this.startNewGame();
        });

        this.gameView.setStartRoundButtonCallback(() => {
            this.startRound();
        });

        this.gameView.setNextRoundButtonCallback(() => {
            this.initRound();
        });

        this.gameView.setToRulesButtonCallback(() => {
            this.goToRules();
        });
    }

    onDiceClicked(index, checked, playerView) {
        let player = playerView.getPlayer();

        if (!this.isDiceCanBeClicked(player, checked)) {
            return;
        }

        playerView.setDiceChecked(index, !checked);

        this.updateUserCheckedDicesFromView();
        this.updateGuessedAmountFromUser();
        this.updateStartRoundButton();
    }

    updateUserCheckedDicesFromView() {
        let userAmount = this.userView.getCheckedDicesAmount();
        let guessedAmount = this.gameView.getCheckedDicesAmount();

        this.user.setInHandDices(userAmount);
        this.user.setGuessedDices(guessedAmount);
    }

    updateGuessedAmountFromUser() {
        this.userView.setGuessedAmount(this.user.getGuessedDices());
    }

    updateStartRoundButton() {
        let inHand = this.user.getInHandDices();
        let guessed = this.user.getGuessedDices();
        let enabled = inHand > 0 && guessed > inHand;

        this.gameView.setButtonEnabled('start-round-button', enabled);
    }

    isDiceCanBeClicked(owningPlayer, isChecked) {
        if (this.gameState !== 'before_round') {
            return false;
        }
        return isChecked || owningPlayer === this.computer || this.canUserCheckDices();
    }

    canUserCheckDices() {
        return this.user.getInHandDices() < this.user.getHeldDices();
    }

    startNewGame() {
        this.game.setInitialDices(10);
        this.game.startNewGame();

        this.initRound();

        this.updateStartRoundButton();
    }

    initRound() {
        this.gameView.clearPlayerViews();
        this.computerView.setGuessedAmount('?');

        this.user.setGuessedDices(0);
        this.user.setInHandDices(0);

        this.computer.setGuessedDices(0);
        this.computer.setInHandDices(0);

        if (this.game.isPlayerMovesFirst(this.computer)) {
            this.makeComputerTurn();
        }

        this.setGameState('before_round');

        this.updateStartRoundButton();
    }

    startRound() {

        if (!this.game.isPlayerMovesFirst(this.computer)) {
            this.makeComputerTurn();
        }

        let result = this.game.playRound();

        if (result.isGameOver) {
            this.setGameState('game_over');

        } else {
            this.setGameState('after_round');
        }

        this.updateViewsFromGameResult(result);
    }

    updateViewsFromGameResult(result) {
        let computerInHand = this.computer.getInHandDices();
        let randomDiceIndexes = this.getRandomDiceIndexes(computerInHand);

        this.computerView.setCheckedDices(randomDiceIndexes);
        this.computerView.setDicesHighlighted(true);

        this.userView.setHeldAmount(this.user.getHeldDices());
        this.computerView.setHeldAmount(this.computer.getHeldDices());

        if (!result.isRoundDraw) {
            this.userView.blinkHeldAmount();
            this.computerView.blinkHeldAmount();
        }

        this.gameView.setScreenTitle(this.getResultTitle(result));
    }

    getResultTitle(result) {
        if (this.user === result.winner) {
            return 'Победа!';
        }
        if (this.user === result.loser) {
            return 'Поражение :C';
        }
        return 'Ничья';
    }

    getRandomDiceIndexes(amount) {
        let unusedIndexes = Array.from(Array(5).keys());
        let randomIndexes = [];

        for (let i = 0; i < amount; i++) {
            let unusedIndex = this.randomInt(0, unusedIndexes.length - 1);
            let randomIndex = unusedIndexes[unusedIndex];

            unusedIndexes.splice(unusedIndex, 1);
            randomIndexes.push(randomIndex);
        }

        return randomIndexes;
    }

    makeComputerTurn() {
        let userHeld = this.user.getHeldDices();
        let computerHeld = this.computer.getHeldDices();

        let userAvailableDices = Math.min(5, userHeld);
        let computerAvailableDices = Math.min(5, computerHeld);

        let inHand = this.randomInt(1, computerAvailableDices);
        let guessedAmount = inHand + this.randomInt(1, userAvailableDices);

        this.computer.setInHandDices(inHand);
        this.computer.setGuessedDices(guessedAmount);

        this.computerView.setGuessedAmount(guessedAmount);
        this.computerView.blinkGuessedAmount();
    }

    goToRules() {
        this.user.setHeldDices(0);
        this.computer.setHeldDices(0);
        this.gameView.clearPlayerViews();
        this.setGameState('main_menu');
    }



    setGameState(state) {
        let activeButtons = {
            main_menu: 'play-button',
            before_round: 'start-round-button',
            after_round: 'next-round-button',
            game_over: 'to-rules-button', // TODO: кнопка "к правилам"
        };

        let screenTitles = {
            main_menu: 'Правила',
            before_round: 'Подготовка',
            after_round: 'Результаты раунда',
            game_over: 'Результаты игры',
        };

        this.gameState = state;

        this.gameView.setRulesContainerVisible(state === 'main_menu');
        this.gameView.setActiveButton(activeButtons[state]);
        this.gameView.setScreenTitle(screenTitles[state]);
    }

    randomInt(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }
}