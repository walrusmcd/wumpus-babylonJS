//
// this is the Cave object
//

// true means there is a door
var cave1 = [ 
  [false, false, true, false, false, false], // 1
  [false, false, false, true, false, true],  // 2
  [false, false, false, true, false, false], // 3
  [false, true, true, false, false, false],  // 4
  [false, false, false, false, true, false], // 5
  [false, false, false, true, true, false],  // 6
  [false, false, false, true, false, false], // 7
  [true, false, true, true, false, false],   // 8
  [true, false, true, false, false, false],  // 9
  [false, false, true, false, false, true],  // 10
  [false, true, false, true, false, true],   // 11
  [true, false, false, true, false, false],  // 12
  [true, false, true, true, false, false],   // 13
  [true, false, false, false, false, true],  // 14
  [false, false, false, false, false, true], // 15
  [false, false, true, false, true, false],  // 16
  [true, false, false, false, false, true],  // 17
  [true, false, false, true, false, false],  // 18
  [true, false, true, true, false, false],   // 19
  [false, true, false, true, false, true],   // 20
  [false, true, false, false, true, false],  // 21
  [false, false, true, false, true, false],  // 22
  [false, false, true, false, false, true],  // 23
  [true, false, false, false, false, true],  // 24
  [true, false, false, false, false, false], // 25
  [true, true, false, false, false, false],  // 26
  [false, true, false, false, true, false],  // 27
  [false, true, false, false, false, false], // 28
  [false, false, true, false, true, true],   // 29
  [false, false, false, false, false, true]  // 30
];

class Cave {

  static NUMBER_OF_ROOMS = 30;
  static ROWS = 5;
  static COLS = 6;

  static getRandomRoomNumber() {
    var randomRoom = (Math.random() * 30) + 1;
    randomRoom = Math.floor(randomRoom);
    return randomRoom;
  }

  get caveDoors() {
    return cave1;
  }

  static getRoomCol(roomNumber) {
    return ((roomNumber-1) % Cave.COLS) + 1;
  }

  static getRoomRow(roomNumber) {
    return Math.floor((roomNumber-1) / Cave.COLS) + 1;
  }

  static getRoomNumber(row, col) {
    return ((row - 1) * Cave.COLS) + col;
  }

  static validateCave(caveDoors) {
    // does each cave have matching doors ?
    for (var i = 0; i < Cave.NUMBER_OF_ROOMS; ++i) {
      var row = Cave.getRoomRow(i+1);
      var col = Cave.getRoomCol(i+1);
      if (caveDoors[i][0]) {
        if (row == 0) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
        if (caveDoors[Cave.getRoomNumber(row-1, col)-1][3] == false) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
      }
      if (caveDoors[i][1]) {
        if ((row == 0 && (roomNumber % 2)) || col == Cave.COLS) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
        if (caveDoors[Cave.getRoomNumber(row-(col % 2), col+1)-1][4] == false) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
      }
      if (caveDoors[i][2]) {
        if ((row == Cave.ROWS && ((row % 2) == 0)) || col == Cave.COLS) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
        if (caveDoors[Cave.getRoomNumber(row+1-(col % 2), col+1)-1][5] == false) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
      }
      if (caveDoors[i][3]) {
        if (row == Cave.ROWS) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
        if (caveDoors[Cave.getRoomNumber(row+1, col)-1][0] == false) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
      }
      if (caveDoors[i][4]) {
        if (col == 0 || (row == Cave.ROWS && ((col % 2) == 0))) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
        if (caveDoors[Cave.getRoomNumber(row+1-(col % 2), col-1)-1][1] == false) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
      }
      if (caveDoors[i][5]) {
        if (col == 0 || (row == 0 && (col % 2))) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
        if (caveDoors[Cave.getRoomNumber(row-(col % 2), col-1)-1][2] == false) {
          console.error("room"+(i+1)+" failed validation!");
          return false;
        }
      }
    }
    // does each cave have at most 3 doors?
    // can you get to every room ?
  }
}