class Form {
    constructor ({
        inputs=[],
        saveId=null,
        containerId=null,
    }) {
        this._inputs = inputs;
        this._container = document.getElementById(containerId) ?? null;
        this._saveButton = document.getElementById(saveId) ?? null;
        this.__dataURLs = {};

        // Save function, that is changed in inherit
        this.__save__ = () => {}
        if (this._saveButton) this._saveButton.addEventListener('click', e => {
            this.__save__();
        })
        
        // === Initalisation functions ===
        this.__initFormUpdate__ = (map) => {
            delete this.__initFormUpdate__;
            return () => {    
                // set form values to properties
                map.forEach(field => {
                    let ele = document.getElementById(field.id);
                    ele.value = field.value;
                });
            }
        }
        this._updateForm_ = () => {};

        this.__initSave__ = (map) => () => {
            // set properties to form values
            map.forEach(field => {
                let ele = document.getElementById(field.id);
                field.value = ele.dataset.value;
            })
        }

        // === EVENT HANDLERS ==
        this.__InputTextEvent__ = ({e, input}) => {

        }

        this.__InputFileEvent__ = ({e, input}) => {
            let id = input.getAttribute('id');
            let file = e.target.files[0];
            let dataURL = URL.createObjectURL(file);

            // Clear storage for last URL & Instantuate new Object URL
            if (id in this.__dataURLs) try {
                this.__dataURLs[id].revokeObjectURL()
            } catch {}
            this.__dataURLs[id] = dataURL;

            // Apply url to next sibling & save in put dataset
            input.dataset.value = dataURL;
            let img = input.nextElementSibling;
            img.src = dataURL;
            let text = img.nextElementSibling;
            text.innerHTML = file.name;
        }

        this.__InputNeutralEvent__ = () => {
            this._saveButton.style.display = 'flex';
            setTimeout(() => {
                this._saveButton.style.top = 'calc(100% - 3rem)';
                this._saveButton.style.opacity = 1;
            }, 1)
        }

        // === EVENT LISTENERS ===
        // Attatch listeners to each input
        if (this._inputs && Array.isArray(this._inputs)) this._inputs.forEach(input => { 
            let type = input.getAttribute('type');
            input.addEventListener('change', e => {
                if (!type) return 

                // Type specific change
                switch (type) {
                    case 'text':
                        this.__InputTextEvent__({e, input});
                        break;
                    
                    case 'file':
                        this.__InputFileEvent__({e, input});
                        break;
                }

                // Natural change
                this.__InputNeutralEvent__();
            })

        })
        // Attatch custom listeners to container * relating to container.js : BookContainer
        if (this._container) this._container.addEventListener('pageClose', e => {
            // Reset form
            this._updateForm_();
            this._saveButton.style.top = '100%';
            this._saveButton.style.opacity = 0;
            setTimeout(() => {
                this._saveButton.style.display = 'none';
            }, 1000)
        })
    }
}

class Personalise extends Form {
    constructor () {
        super({
            inputs: Array.from(document.getElementsByClassName('personalise-inputs')),
            saveId: 'personalise-save',
            containerId: 'settings-personalise',
        });

        // Personalise Fields
        this._name = '';
        this._imgUrl = null;
        this._tireSize = '';
        this._bodyHeight = '';

        // create update form function with initialiser
        this._updateForm_ = this.__initFormUpdate__([
            {value: this._name, id: 'personalise-name'},
            {value: this._tireSize, id: 'personalise-tiresize'},
            {value: this._bodyHeight, id: 'personalise-bodyheight'}
        ])

        this.__save__ = () => {
            // Specifc save for Personalise
        }
    }
}

class GameMode extends Form {
    constructor () {
        super({
            inputs: null,
        });


    }
}

class Settings {
    constructor () {
        this.gameMode = new GameMode ();
        this.personalise = new Personalise ();
    }
}

export {Settings};