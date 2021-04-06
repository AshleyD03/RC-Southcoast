class Page {
    constructor () {

    }
}

class Personalise extends Page {
    constructor () {

    }
}

class GameMode extends Page{
    constructor () {

    }
}

class Settings {
    constructor () {
        this.__gameMode = new GameMode ();
        this.__personalies = new Personalise ();
    }
}

export {Settings};