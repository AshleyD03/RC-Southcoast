class PenaltyBoard {
    constructor () {
        this.__target = document.getElementById('penalty-board-target');
        this.__points = 0;
        this._controlls = [];
    }

    _addPoints_ (a) {
        this.__points += a;
        Array.from(document.getElementsByClassName('point-counter')).forEach(element => {
            element.innerHTML = this.__points;
        });
    }

    _createController_ (name, value) {
        // Creates a penalty controller that can add & remove penalty
        let controller = new Controller (name, value, this)
        this.__target.appendChild(controller._node)
        this._controlls.push(controller)
    }

    _removeController_ () {
        // Remove a penalty controller
    }
}

class Controller {
    // Contains a controller node

    constructor (name, value, penaltyBoard) {
        // Init properties
        this.__name = name;
        this.__value = value ?? 1;
        this.__count = 0;
        this.__records = [];
        this.__penaltyBoard = penaltyBoard;
        this.id = this.__penaltyBoard._controlls.length;

        // Clone node and seperate parts
        this._node = document.getElementById('penalty-control-template').content.cloneNode(true).children[0];
        let nodeName = this._node.children[0].children[0];
        let nodeValue = this._node.children[0].children[1];
        let nodeAdd = this._node.children[1].children[0];
        let nodeCount = this._node.children[1].children[1];
        let nodeRemove = this._node.children[1].children[2];

        // Add style changes
        nodeName.innerHTML = this.__name;
        nodeValue.innerHTML = this.__value;

        let timeout = (obj) => {
            obj.disabled = true;
            setTimeout(function() {
                obj.disabled = false;
            }, 1500);
        }

        // Add event
        nodeAdd.addEventListener('click', e => {
            timeout(nodeAdd)

            // Alter values
            this.__count -=- 1;
            this.__penaltyBoard._addPoints_(this.__value);
            nodeCount.innerHTML = `${this.__count * this.__value}`;
        })

        // Remove event
        nodeRemove.addEventListener('click', e => {
            if (this.__count < 1) return 
            timeout(nodeRemove)

            // Alter values
            this.__count -= 1;
            this.__penaltyBoard._addPoints_(-this.__value);
            nodeCount.innerHTML = `${this.__count * this.__value}`;
        })
    }

    __createRecord__ () {

    }

    __removeRecord__ () {
        
    }
}

class Record {
    // Contains a record node
    constructor () {

    }

    _remove_ () {

    }
}

export {PenaltyBoard}