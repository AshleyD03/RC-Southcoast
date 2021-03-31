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
        this._alertNode = null;

        // Apply styling
        this._nodeTime.innerHTML = this._time;
        this._nodeMsg.innerHTML = this._msg;

        this._createAlert_();
    }

    _createAlert_ () {
        let target = document.getElementById('record-alert-target');
        this._alertNode = document.getElementById('penalty-alert-template').cloneNode(true).content.children[0];
        let title = this._alertNode.children[0];
        let reset = this._alertNode.children[1];

        title.innerHTML = this._msg;
        Array.from(target).forEach(tar => tar.style.marginBottom = '1rem');
        this._alertNode.style.marginBottom = '4rem'
        target.appendChild(this._alertNode)
    }

    _removeNode_ () {
        if (this._node) this._node.remove();
    }
}

export {Record};