import {swapClass} from './util.js'

class Clock {
    constructor ({className, target=null, Player}) {
        this.Player = Player;
        this.__targets = Array.from(document.getElementsByClassName(className))
        this.__time = 0;
        this.__minutes = 0;
        this.__looper = null;
        this.__targetTime = target;
        this._visual = '00:00:00';

        this._start_ = (begin) => {
            
            if (typeof begin !== 'number') this.time === 0;
            else this.time = begin;
            this.__minutes = 0;

            if (this.__looper) clearInterval(this.__looper);

            let loop = (resolve, reject) => {
                this.__looper = setInterval(() => {
            
                    this.__time -=- 1;
                    if (this.__time > 6000) {
                        this.__minutes += 1;
                        this.__time -= 6000;
                    }

                    let len = 4 - this.__time.toString().length;
                    this._visual = `${'0'.repeat(len)}${this.__time}`;

                    this._visual = `${'0'.repeat(2-this.__minutes.toString().length)}${this.__minutes}:` +
                                    `${this._visual.substring(0,2)}:` + 
                                    `${this._visual.substring(2,4)}`
                    this.__setVisual__();

                    if (this.__targetTime && this.__time >= this._targetTime) {
                        resolve(true)
                        clearInterval(this.__looper)
                    } 
    
                }, 10)
            }

            return new Promise(loop);
        }
    }

    __setVisual__ (msg=this._visual) {
        this.__targets.forEach(target => target.innerHTML = msg)
    }

    _initVisual_ () {
        this.__setVisual__();
    }

    _pause_ () {
        clearInterval(this.__looper)
    }

    _unPause_ () {
        this._start_(this.__time)
    }
}

export {Clock}