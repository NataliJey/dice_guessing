import PlayerView from './PlayerView.js';

export default class GameView {

    constructor($gameContainer, game) {
        this.$game = $gameContainer;

        this.$screenTitle = this.$game.find('.screen-title-text');
        this.$rulesContainer = this.$game.find('.rules-container');

        this.$dices = this.$game.find('.dice');
        this.$controls = this.$game.find('.controls-container .controls');

        this.$playButton = this.$controls.find('.play-button');
        this.$startRoundButton = this.$controls.find('.start-round-button');
        this.$nextRoundButton = this.$controls.find('.next-round-button');
        this.$toRulesButton = this.$controls.find('.to-rules-button');

        this.game = game;
        this.firstPlayerView = this.createViewForPlayer('.first-player', game.getFirstPlayer());
        this.secondPlayerView = this.createViewForPlayer('.second-player', game.getSecondPlayer());
    }

    createViewForPlayer(containerSelector, player) {
        let $playerContainer = this.$game.find(containerSelector);

        return new PlayerView($playerContainer, player);
    }

    clearPlayerViews() {
        this.firstPlayerView.clear();
        this.secondPlayerView.clear();
    }

    setDiceClickCallback(callback) {
        this.firstPlayerView.setDiceClickCallback(callback);
        this.secondPlayerView.setDiceClickCallback(callback);
    }

    setPlayButtonCallback(callback) {
        this.$playButton.click(e => {
            callback();
        });
    }

    setStartRoundButtonCallback(callback) {
        this.$startRoundButton.click(e => {
            callback();
        });
    }

    setNextRoundButtonCallback(callback) {
        this.$nextRoundButton.click(e => {
            callback();
        });
    }

    setToRulesButtonCallback(callback) {
        this.$toRulesButton.click(e => {
            callback();
        });
    }

    setScreenTitle(title) {
        this.$screenTitle.text(title);
    }

    getCheckedDicesAmount() {
        return this.$dices.filter('.checked').length;
    }

    getFirstPlayerView() {
        return this.firstPlayerView;
    }

    getSecondPlayerView() {
        return this.secondPlayerView;
    }

    setButtonEnabled(buttonClass, enabled) {
        this.$controls.find('.' + buttonClass).prop('disabled', !enabled);
    }

    setRulesContainerVisible(visible) {
        this.$rulesContainer.css('visibility', visible ? 'visible' : 'hidden');
    }

    setActiveButton(buttonClass) {
        this.$controls.find('.button').hide();
        this.$controls.find('.' + buttonClass).show();
    }
}