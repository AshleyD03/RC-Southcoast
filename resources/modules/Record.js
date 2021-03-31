class Record {
    // Contains a record node
    constructor ({msg, classes=[], deleteMethod=null}) {
        // Set time or recording
        this._msg = msg;
        this._time = window.clock._visual.substring(0, 5);
        this.__classes = {classes};

        this._deleteMethod_ = () => {
            if (deleteMethod) deleteMethod();
        }

        // Clone node and seperate parts
        this._node = document.getElementById('penalty-record-template').content.cloneNode(true).children[0];
        this._nodeTime = this._node.children[0];
        this._nodeMsg = this._node.children[1];

        // Apply styling
        this._nodeTime.innerHTML = this._time;
        this._nodeMsg.innerHTML = this._msg;
    }

    _createAlert_ () {
        let target = document.getElementById('record-alert-target');

    }

    _removeNode_ () {
        if (this._node) this._node.remove();
    }
}

export {Record};