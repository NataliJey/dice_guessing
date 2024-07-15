
export default class PlayerView {

    constructor($playerContainer, player) {
        this.$player = $playerContainer;

        this.$dices = this.$player.find('.dice');
        this.$heldAmount = this.$player.find('.held-amount-text');
        this.$guessedAmount = this.$player.find('.guessed-amount-text');

        this.player = player;
    }

    setDiceClickCallback(callback) {
        this.$dices.each((index, dice) => {
            $(dice).data('index', index);
        });

        this.$dices.click(e => {
            let $dice = $(e.target);
            let index = $dice.data('index');
            let checked = this.isDiceChecked(index);

            callback(index, checked, this);
        });
    }

    clear() {
        this.setCheckedDices([]);
        this.setDicesHighlighted(false);
        this.setGuessedAmount(0);
        this.setHeldAmount(this.player.getHeldDices());
    }

    setHeldAmount(amount) {
        this.$heldAmount.text(amount);
    }

    setCheckedDices(checkedIndexes) {
        for (let i = 0; i < 5; i++) {
            this.setDiceChecked(i, checkedIndexes.includes(i));
        }
    }

    getCheckedDicesAmount() {
        return this.$dices.filter('.checked').length;
    }

    setDicesHighlighted(highlighted) {
        this.$dices.toggleClass('highlighted', highlighted);
    }

    setDiceChecked(diceIndex, checked) {
        this.$dices.eq(diceIndex).toggleClass('checked', checked);
    }

    isDiceChecked(diceIndex) {
        return this.$dices.eq(diceIndex).hasClass('checked');
    }

    setGuessedAmount(amount) {
        this.$guessedAmount.text(amount);
    }

    blinkGuessedAmount() {
        this.runBlinkAnimation(this.$guessedAmount);
    }

    blinkHeldAmount() {
        this.runBlinkAnimation(this.$heldAmount);
    }

    runBlinkAnimation($element) {
        $element.removeClass('blink');
        requestAnimationFrame(() => {
            $element.addClass('blink');
        });
    }

    getPlayer() {
        return this.player;
    }
}