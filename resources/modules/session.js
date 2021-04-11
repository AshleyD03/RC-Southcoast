import { flagRecorder } from './Record.js'
import { Clock } from './clock.js'
import { PenaltyBoard } from './penalties.js'
import { PlayerSettings, SessionSettings } from './Settings.js';

class Player {
    constructor (params) {
        this.__isActive = true;
        this.Name = params.name;

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

    set isActive(a) {
        if (a === true) {
            this.__isActive = a;
            
            // Activate visual elements
            this.Clock._initVisual_();
        }
        if (a === false) {
            this.__isActive = a;

            // De-active visual elements
            this.Clock._pause_();
        }
    }

    get isActive() {
        return this.__isActive;
    }
}

class Session {
    constructor () {
        this.Players = {};
        this.Settings = new SessionSettings({Session: this});
    }

    addPlayer (params) {
        let newPlayer = new Player(params);
        this.Players[params.name] = newPlayer;
    }

    setPlayer (id) {
        let target = this.Players[id];
        if (!target) target = Object.values(this.Players)[id];
        if (!target) return false
        
        Object.values(this.Players).forEach(player => player.isActive = false)
        target.isActive = true;
    }
    
    getActivePlayer () {
        let item = Object.values(this.Players) 
        [Object.values(this.Players)
        .findIndex(player => player.isActive === true)]
        return item
    }
}

export {Player, Session};