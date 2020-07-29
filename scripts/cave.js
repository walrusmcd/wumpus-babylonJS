//
// this is the Cave object
//

var cave1 = [ 
  [false, false, true, false, false, false],
  [false, false, false, true, false, true],
  [false, false, false, true, false, false],
  [false, true, true, false, false, false],
  [false, false, false, false, true, false],
  [false, false, false, true, true, false],
  [false, false, false, true, false, false],
  [true, false, true, false, false, false],
  [true, false, true, false, false, false],
  [false, false, true, false, false, true],
  [false, true, false, true, false, true],
  [true, false, false, true, false, false],
  [true, false, true, true, false, false],
  [false, false, false, false, false, true],
  [false, false, false, true, false, true],
  [false, false, true, false, true, false],
  [true, false, false, false, false, true],
  [true, false, false, true, false, false],
  [true, false, true, true, false, false],
  [false, true, false, true, false, true],
  [true, true, false, false, true, false],
  [false, false, true, false, true, true],
  [false, false, true, false, false, true],
  [true, false, false, false, false, true],
  [true, false, false, false, false, false],
  [true, true, false, false, false, false],
  [false, true, false, false, true, false],
  [false, true, false, false, false, false],
  [false, false, true, false, true, true],
  [false, false, false, false, false, true]
];

class Cave {

  static getRandomRoomNumber() {
    var randomRoom = (Math.random() * 30) + 1;
    randomRoom = Math.floor(randomRoom);
    return randomRoom;
  }

  get caveDoors() {
    return cave1;
  }

}