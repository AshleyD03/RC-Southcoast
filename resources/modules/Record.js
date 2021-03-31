import { buttonTimeout } from "./util.js";

class Record {
    // Contains a record node
    constructor ({msg, classes=[], deleteMethod=null}) {
        // Set time or recording
        this._msg = msg;
        this._time = window.clock._visual.substring(0, 5);
        this.__classes = classes;

        this._deleteMethod_ = () => {
            if (deleteMethod) deleteMethod();
        }

        // Clone node and seperate parts
        this._node = document.getElementById('penalty-record-template').content.cloneNode(true).children[0];
        this._nodeTime = this._node.children[0];
        this._nodeMsg = this._node.children[1];
        this._alertNode = null;

        // Apply styling
        this._node.classList.add(...this.__classes);
        this._nodeTime.innerHTML = this._time;
        this._nodeMsg.innerHTML = this._msg;

        this._createAlert_();
    }

    _createAlert_ () {
        // Create main element references & store cloned alert node 
        let target = document.getElementById('record-alert-target');
        this._alertNode = document.getElementById('penalty-alert-template').cloneNode(true).content.children[0];
        let title = this._alertNode.children[0];
        let undo = this._alertNode.children[1];

        // Add styling 
        this._alertNode.classList.add(...this.__classes);
        this._alertNode.style.transition = 'margin 1000ms cubic-bezier(0.075, 0.82, 0.165, 1), opacity 500ms cubic-bezier(0.075, 0.82, 0.165, 1)';
        title.innerHTML = this._msg;
        Array.from(target.children).forEach(tar => tar.style.marginBottom = '1rem');
    
        // Delay to jump up
        setTimeout(() => {
            this._alertNode.style.marginBottom = '7rem';
        }, 10)

        let timeDip = setTimeout(() => { this._alertNode.style.opacity = 0;}, 2000)
        let timeDel = setTimeout(() => { this._alertNode.remove();}, 2500)

        // Click to undo
        undo.addEventListener('click', e => {
            this._deleteMethod_();
            this._alertNode.style.background = '#D0E495';
            this._alertNode.style.opacity = 1;
            undo.disabled = true;
            
            clearTimeout(timeDip);
            clearTimeout(timeDel);

            setTimeout(() => { this._alertNode.style.opacity = 0;}, 500)
            setTimeout(() => { this._alertNode.remove();}, 1000)
        })

        // Append child
        target.appendChild(this._alertNode);
    }

    _removeNode_ () {
        if (this._node) this._node.remove();
    }
}

class CustomRecorder {
    constructor ({onClickClass='', classes=[], message=null, initMethod, trigger, deleteTrigger}){
        this.__activators = Array.from(document.getElementsByClassName(onClickClass));
        this.__records = [];
        this.__message = message;
        this.__classes = classes;
        this.__target = document.getElementById('penalty-record-target');
        this.__trigger = () => {
            if (trigger) trigger(this);
        }
        this.__deleteTrigger = () => {
            if (deleteTrigger) deleteTrigger(this)
        }

        this.__activators.forEach(button => {
            button.addEventListener('click', e => {    
                buttonTimeout(button)
                this.__createEvent__();
            })
        })

        if (initMethod) initMethod(this);
    }

    __createEvent__ () {
        this.__trigger(this);
        let record = new Record({
            msg: this.__message,
            classes: this.__classes,
            deleteMethod: () => this.__removeEvent__(this.__records.length - 1)
        })
        this.__records.push(record)
        this.__target.insertBefore(record._node, this.__target.children[1]);
    }

    __removeEvent__ (n=this.__records.length-1) {
        if (n < 0 || n > this.__records.length) return
        this.__records[n]._removeNode_();
        this.__records.splice(n, 1);
        this.__deleteTrigger();
    }
}

export {Record, CustomRecorder};