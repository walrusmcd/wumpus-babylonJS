//
// this is the player object
//
class Player {

    constructor(playerName) {
        this._arrowCount = 0;
        this._goldCoins = 0;
        this._numberOfTurns = 0;
        this._currentScore = 0;
        this._killedTheWumpus = 0;
        this._name = playerName;
    }

    get name() {
        return this._name;
    }

    get arrowCount() {
        return this._arrowCount;
    }

    set arrowCount(num) {
        this._arrowCount = num;
    }

    get goldCoins() {
        return this._goldCoins;
    }

    set goldCoins(num) {
        this._goldCoins = num;
    }

    get numberOfTurns() {
        return this._numberOfTurns;
    }

    set numberOfTurns(num) {
        this._numberOfTurns = num;
    }

    killedTheWumpus() {
        this._killedTheWumpus = 1;
    }

    getCurrentScore() {
        return 100 
            - this._numberOfTurns 
            + this._goldCoins 
            + (5 * this._arrowCount) 
            + (50 * this._killedTheWumpus);
    }
}