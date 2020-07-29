//
// this is the GameLocations object
//
class GameLocations {
    constructor() {
        this._cave = new Cave();
        this._playerRoomNumber = 0;
        this._wumpusRoomNumber = 0;
        this._pitRoomNumbers = [0, 0];
        this._batRoomNumbers = [0, 0];
        this._playerRoomNumber = this.getRandomEmptyRoom();
        this._wumpusRoomNumber = this.getRandomEmptyRoom();
        this._pitRoomNumbers[0] = this.getRandomEmptyRoom();
        this._pitRoomNumbers[1] = this.getRandomEmptyRoom();
        this._batRoomNumbers[0] = this.getRandomEmptyRoom();
        this._batRoomNumbers[1] = this.getRandomEmptyRoom();
    }
    
    getRandomEmptyRoom() {
        var num = Cave.getRandomRoomNumber();
        while (
            num == this._playerRoomNumber ||
            num == this._wumpusRoomNumber ||
            num == this._pitRoomNumbers[0] ||
            num == this._pitRoomNumbers[1] ||
            num == this._batRoomNumbers[0] ||
            num == this._batRoomNumbers[1]) {

            num = Cave.getRandomRoomNumber();
        }
        return num;
    }

    get cave() {
        return this._cave;
    }

    get playerRoomNumber() {
        return this._playerRoomNumber;
    }

    set playerRoomNumber(roomNumber) {
        this._playerRoomNumber = roomNumber;
    }

    get wumpusRoomNumber() {
        return this._wumpusRoomNumber;
    }

    set wumpusRoomNumber(roomNumber) {
        this._wumpusRoomNumber = roomNumber;
    }

    getBatRoomNumber(batNum) {
        return this._batRoomNumbers[batNum];
    }

    setBatRoomNumber(batNum, roomNum) {
        this._batRoomNumbers[batNum] = roomNum;
    }

    getPitRoomNumber(batNum) {
        return this._pitRoomNumbers[batNum];
    }

    setPitRoomNumber(batNum, roomNum) {
        this._pitRoomNumbers[batNum] = roomNum;
    }

}