//
// this is the GameLocations object
//
class GameLocations {
    constructor() {
        this._cave = null;
        this._playerRoomNumber = 0;
        this._wumpusRoomNumber = 0;
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
}