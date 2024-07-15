
export default class Player {

    constructor(name) {
        Player.number = Player.number ?? 0;

        this.name = 'Player-' + Player.number++;
        this.dices = 0;
        this.inHand = 0;
        this.guessed = 0;
    }

    setHeldDices(dices) {
        this.dices = dices;
    }

    getHeldDices() {
        return this.dices;
    }

    modifyHeldDices(dicesToAdd) {
        this.dices += dicesToAdd;
    }

    setInHandDices(dices) {
        this.inHand = dices;
    }

    getInHandDices() {
        return this.inHand;
    }

    setGuessedDices(amount) {
        this.guessed = amount;
    }

    getGuessedDices() {
        return this.guessed;
    }
}