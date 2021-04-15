import { flagRecorder } from './Record.js'
import { Clock } from './clock.js'
import { PenaltyBoard } from './penalties.js'
import { PlayerSettings, SessionSettings } from './Settings.js';

class Player {
    constructor (params) {
        this.__isActive = true;
        this.name = params.name;
        this._tag = params.tag ?? '@Guest';
        this.Session = params.Session;

        // === Key modules ===
        // Linked :>
        this.Clock = new Clock({
            className: 'time-counter',
            Player: this,
        });

        // Linked :>
        this.PenaltyBoard = new PenaltyBoard({
            Player: this,
        });

        // Not linked ?!
        this.Settings = new PlayerSettings({
            Player: this,
        });

        // Not linked ?!
        this.FlagRecorder = flagRecorder({
            Player: this,
        });

        // === Player board visuals
        this.__node = document.getElementById('playerboard-player-template').content.cloneNode(true).children[0];
        this.node = {
            score: 0,
            name: this.name,
            tag: this._tag,
            iconUrl: this.iconUrl ?? 'resources/images/PlayerIconSerious.webp',
        }
        this.node.tag.style.color = this.Settings.Personalise._formMap.color.value;

        // Event listenerts
        this.node.body.addEventListener('click', e => {
            // Set this player
            this.Session.setPlayer(this.name)
        })

        this.__node.children[0].addEventListener('click', e => {
            window.settingsContainer.__turnToId__('settings-personalise')
        })


        document.getElementById('playerboard-player-target').appendChild(this.node.body)
    }

    updateGameRules () {
        // Apply styling to this specific player
    }

    set isActive(a) {
        if (a === true) {
            this.__isActive = a;
            this.node = {
                classAdd: 'selected',
            }
            
            // Activate visual elements
            this.Clock._initVisual_();
            this.PenaltyBoard._controlls
            .forEach(cont => {
                cont._node.style.display = 'grid';
                cont.__records.forEach(rec => rec._node.style.display = 'grid');
            })
            this.PenaltyBoard._initPoints_();
            this.Settings._SetActive_();
            this.FlagRecorder.__records.forEach(record => {
                record._node.style.display = 'grid';
            })
            this.FlagRecorder._updateCounter_()
        }
        if (a === false) {
            this.__isActive = a;
            this.node = {
                classRemove: 'selected',
            }

            // De-active visual elements
            this.Clock._pause_();
            this.PenaltyBoard._controlls
            .forEach(cont => {
                cont._node.style.display = 'none';
                cont.__records.forEach(rec => rec._node.style.display = 'none');
            })
            this.FlagRecorder.__records.forEach(record => {
                record._node.style.display = 'none';
            })
        }
    }

    get isActive() {
        return this.__isActive;
    }

    set node({
        score,
        name,
        tag,
        iconUrl,
        classAdd,
        classRemove
    }) {
        this.__node.classList.add(classAdd);
        this.__node.classList.remove(classRemove);
        let children = this.__node.children;
        children[0].children[0].src = iconUrl ?? children[0].children[0].src;
        children[1].children[0].innerHTML = name ?? children[1].children[0].innerHTML;
        children[1].children[1].innerHTML = tag ?? children[1].children[1].innerHTML;
        children[2].innerHTML = score ?? children[2].innerHTML;
    } 

    get node () {
        let children = this.__node.children;
        return {
            body: this.__node,
            icon: children[0].children[0],
            name: children[1].children[0],
            tag: children[1].children[1],
            score: children[2],
        }
    }
}

class Session {
    constructor ({
        isMultiplayer=true,

    }) {
        // Key properties 
        this.__isMultiplayer;
        this.isMultiplayer = isMultiplayer;

        // Class Carriers
        this.Players = [];
        this.Settings = new SessionSettings({Session: this});
        this.ActivePlayer;

        // Link clock controlls
        this.__clockButtons = Array.from(document.getElementsByClassName('clock-controlls'));
        this.__clockButtons.forEach(cont => {
            cont.dataset.isOn = 'false';
            cont.addEventListener('click', e => {
                let player = this.ActivePlayer;
                if (!player) return false

                let status = cont.dataset.isOn || 'false';

                if (status === 'false') {
                    // pause clock
                    player.Clock._unPause_();
                    this.__clockButtons.forEach(but => {
                        but.innerHTML = 'pause_circle'
                        but.dataset.isOn = 'true';
                    })
                } else {
                    // pause current clock
                    player.Clock._pause_();
                    this.__clockButtons.forEach(but => {
                        but.innerHTML = 'play_circle'
                        but.dataset.isOn = 'false';
                    })
                }

                // Remember when swapping active player to pause clock
            })
        })
    }

    set isMultiplayer (bool) {
        // Get targets
        let elements = Array.from(document.getElementsByClassName('multiplayer-only'))

        if (bool === true) elements.forEach(ele => ele.style.display = 'inline-block')
        else if (bool === false) elements.forEach(ele => ele.style.display = 'none')
        else return false

        this.__isMultiplayer = bool;
        return true
    }

    get isMultiplayer () {
        return this.__isMultiplayer;
    }

    addPlayer (params) {
        if (this._isMultiplayer === false && this.Players.length > 0) return false
        if (this.Players.length >= this.Settings.GameMode._formMap.playerCapacity.value) return false
        
        console.log(params.name)
        let newPlayer = new Player({...params, Session: this});
        this.Players.push(newPlayer);

        // increase minimum player capacity in settings
        let miniEle = document.getElementById(this.Settings.GameMode._formMap.playerCapacity.id);
        miniEle.min = this.Players.length;
    }

    setPlayer (id) {
        let target = this.Players[id];
        if (!target) target = this.Players.find(player => player.name === id);
        if (!target) return false
        
        // Loops over all others to fix cases that change all player styles like adding penalties
        this.Players.forEach(player => player.isActive = false)
        target.isActive = true;
        this.ActivePlayer = target;
    }

    updateGameRules () {
        // Apply changes to each players penalty board
        this.Players.forEach(player => {
            player.PenaltyBoard._removeAllControllers_()
            Object.values(this.Settings.GameMode._penalties).forEach(penalty => {
                player.PenaltyBoard._createController_(penalty.name, penalty.value)
            })
        })

        // Set current player active to add new style changes
        this.setPlayer(this.ActivePlayer.name)
    }
}

export {Player, Session};