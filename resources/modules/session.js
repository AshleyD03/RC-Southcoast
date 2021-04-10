import { flagRecorder } from './Record.js'
import { Clock } from './clock.js'
import { PenaltyBoard } from './penalties.js'
import { PlayerSettings, SessionSettings } from './Settings.js';

class Player {
    constructor (params) {
        this._isActive = true;

        this.Clock = new Clock({
            className: 'time-counter',
            Player: this,
        });
        this.PenaltyBoard = new PenaltyBoard({
            Player: this,
        });
        this.Settings = new PlayerSettings({
            Player: this,
        });
        this.FlagRecorder = flagRecorder({
            Player: this,
        });
    }

    setActive (a) {
        if (a === true || a === false) this._isActive = a;
    }
}

class Session {
    constructor () {
        this.Players = {};
        this.Settings = new SessionSettings();
    }

    addPlayer (params) {
        let newPlayer = new Player(params);
        this.Players[params.name] = newPlayer;
    }

    setPlayer (id) {
        let target = this.Players[id];
        if (!target) target = Object.values(this.Players)[id];
        if (!target) return false
        
        Object.values(this.Players).forEach(player => player.setActive(false))
        target.setActive(true);
    }
    
    getActivePlayer () {
        let item = Object.values(this.Players) 
        [Object.values(this.Players)
        .findIndex(player => player._isActive === true)]
        return item
    }
}

export {Player, Session};