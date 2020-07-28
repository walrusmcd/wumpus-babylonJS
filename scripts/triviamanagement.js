//
// this is the trivia managment object
//
class TriviaManagement {
    constructor() {

    }

    get randomTriviaAnswer() {
        return "trivia answer #" + Math.floor((Math.random() * 100)+1).toString();
    }
}