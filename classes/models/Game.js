import Player from './Player.js';

export default class Game {

    constructor() {
        this.firstPlayer = new Player();
        this.secondPlayer = new Player();
        this.players = [this.firstPlayer, this.secondPlayer];
        this.roundNumber = 1;
        this.initialDices = 10;
    }

    setInitialDices(dices) {
        this.initialDices = dices;
    }

    startNewGame() {
        this.roundNumber = 1;
        for (const player of this.players) {
            player.setHeldDices(this.initialDices);
            player.setInHandDices(0);
            player.setGuessedDices(0);
        }
    }

    playRound() {

        let winner = this.getRoundWinner();
        let loser = this.getOpponent(winner);
        let isGameOver = false;

        if (winner) {
            let amount = loser.getInHandDices();

            winner.modifyHeldDices(amount);
            loser.modifyHeldDices(-amount);

            isGameOver = loser.getHeldDices() <= 0;
        }

        this.roundNumber++;

        return {
            isRoundDraw: winner === null,
            isGameOver,
            winner,
            loser,
        };
    }

    isPlayerMovesFirst(player) {
        if (player === this.firstPlayer) {
            return this.roundNumber % 2 === 0;
        }
        if (player === this.secondPlayer) {
            return this.roundNumber % 2 !== 0;
        }
        throw new Error('"player" is not player from that game');
    }

    getOpponent(forPlayer) {
        if (forPlayer === null) {
            return null;
        }
        return forPlayer === this.firstPlayer
            ? this.secondPlayer : this.firstPlayer;
    }

    getRoundWinner() {
        let handsSum = this.getHandsSum();
        let winners = [];

        for (let player of this.players) {
            if (handsSum === player.getGuessedDices()) {
                winners.push(player);
            }
        }

        if (winners.length === 1) {
            return winners[0];
        }

        return null;
    }

    getHandsSum() {
        return this.players.reduce(
            (sum, player) => {
                return sum + player.getInHandDices();
            },
            0
        );
    }

    getRoundNumber() {
        return this.roundNumber;
    }

    getFirstPlayer() {
        return this.firstPlayer;
    }

    getSecondPlayer() {
        return this.secondPlayer;
    }
}