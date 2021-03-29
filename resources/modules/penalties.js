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
        this.__message = `+${this.__value} ${this.__name}`;
        this.__target = document.getElementById('penalty-record-target');

        // Clone node and seperate parts
        this._node = document.getElementById('penalty-control-template').content.cloneNode(true).children[0];
        let nodeName = this._node.children[0].children[0];
        let nodeValue = this._node.children[0].children[1];
        let nodeAdd = this._node.children[1].children[0];
        this._nodeCount = this._node.children[1].children[1];
        let nodeRemove = this._node.children[1].children[2];

        // Add style changes
        nodeName.innerHTML = this.__name;
        nodeValue.innerHTML = `+${this.__value}`;

        let timeout = (obj) => {
            obj.disabled = true;
            setTimeout(function() {
                obj.disabled = false;
            }, 1000);
        }

        // Add event
        nodeAdd.addEventListener('click', e => {
            timeout(nodeAdd)

            // Alter values
            this.__recordEvent__();
        })

        // Remove event
        nodeRemove.addEventListener('click', e => {
            if (this.__count < 1) return 
            timeout(nodeRemove);
            this.__removeEvent__();
        })
    }

    __recordEvent__ () {
        // Change point values
        this.__count -=- 1;
        this.__penaltyBoard._addPoints_(this.__value);
        this._nodeCount.innerHTML = `${this.__count}`;

        // Add record object
        let record = new Record(this.__message);
        this.__target.insertBefore(record._node, this.__target.children[1]);
        this.__records.push(record);
    }

    __removeEvent__ (n=(this.__count-1)) {
        if (n < 0) return console.log(n)
        // Change point values
        this.__count -= 1;
        this.__penaltyBoard._addPoints_(-this.__value);
        this._nodeCount.innerHTML = `${this.__count}`;

        // Remove record object
        this.__target.removeChild(this.__records[n]._node);
        this.__records.splice(n, 1)
    }
}

class Record {
    // Contains a record node
    constructor (msg, classes=[]) {
        // Set time or recording
        this._msg = msg;
        this._time = (new Date()).getTime();

        // Clone node and seperate parts
        this._node = document.getElementById('penalty-record-template').content.cloneNode(true).children[0];
        this._nodeTime = this._node.children[0];
        this._nodeMsg = this._node.children[1];

        // Apply styling
        this._nodeTime.innerHTML = this._time;
        this._nodeMsg.innerHTML = this._msg;
    }
}

export {PenaltyBoard}