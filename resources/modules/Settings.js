import { applyToClass } from "./util.js";

class Form {
    constructor ({
        formMap,
        saveId,
        formId,
        containerId,
        onSave,
    }) {
        this._container = document.getElementById(containerId) ?? null;
        this._saveButton = document.getElementById(saveId) ?? null;
        this._formElement = document.getElementById(formId) ?? null;
        this.__dataURLs = {};
        this._formMap = formMap;

        let inputs = [];
        Object.values(formMap).forEach(form => inputs.push(document.getElementById(form.id)));

        // Update form method
        this._updateForm_ = () => {    
            // set form values to properties
            Object.values(this._formMap).forEach(field => {
                let ele = document.getElementById(field.id);
                let type = ele.getAttribute('type');
                switch (type) {
                    case 'text':
                        ele.value = field.value;
                        ele.style.color = '#363636fd';
                        break;
                    
                    case 'file':
                        let img = ele.nextElementSibling;
                        img.src = field.value || field.preset;
                        let text = img.nextElementSibling;
                        text.innerHTML = 'upload...'
                        text.style.color = '#363636fd';
                        break;
                    case 'dropdown':
                        ele.value = field.value ?? field.preset;
                        ele.style.color = '#363636fd';
                        break;
                }
                ele.dataset.value = field.value ?? field.preset;
            });
        }

        // Save form method
        this._onSave_ = () => onSave(this);
        this._submit_ = e => {
            e.preventDefault()
            this._saveButton.disabled = true;

            // set properties to form values
            Object.values(this._formMap).forEach(field => {
                let ele = document.getElementById(field.id);
                field.value = ele.dataset.value ?? field.value;
            })

            Promise.resolve()

            // Call onsave function and resolve by closing
            if (this._onSave_ && typeof this._onSave_ === 'function') {
                Promise.resolve(this._onSave_()).then(res => {
                    
                    console.log(res)

                    this._container.dispatchEvent(new Event('pageReset'));
                })
            } else this._container.dispatchEvent(new Event('pageReset'));

        }
        if (this._formElement) this._formElement.addEventListener('submit', this._submit_)

        // === EVENT LISTENERS ===
        // Attatch listeners to each input
        if (inputs && Array.isArray(inputs)) inputs.forEach(input => { 
            let type = input.getAttribute('type');
            input.addEventListener('change', e => {
                if (!type) return 

                // Type specific change
                switch (type) {
                    case 'text':
                        this.__InputTextEvent__(e);
                        break;
                    
                    case 'file':
                        this.__InputFileEvent__(e);
                        break;
                    case 'dropdown':
                        this.__InputDropdownEvent__(e);
                        break;
                }

                // Natural change
                this.__InputNeutralEvent__();
            })
        })

        // Attatch custom listeners to container * relating to container.js : BookContainer
        if (this._container) {
            
            this._container.addEventListener('pageReset', e => {
                // Reset form
                this._updateForm_();
                this._saveButton.style.top = '100%';
                this._saveButton.style.opacity = 0;
                setTimeout(() => {
                    this._saveButton.style.display = 'none';
                }, 1500)
            })

        }
    }
    __InputTextEvent__ (e) {
        let input = e.currentTarget;
        input.dataset.value = input.value;
        input.style.color = 'green';
    }

    __InputFileEvent__ (e) {
        let input = e.currentTarget;
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
        text.innerHTML = 'Changed';
        text.style.color = 'green';
    }

    __InputDropdownEvent__ (e) {
        let input = e.currentTarget;
        let value = input.options[input.selectedIndex].value;
        input.dataset.value = value;
        input.style.color = 'green';
    }

    __InputNeutralEvent__  () {
        this._saveButton.style.display = 'flex';
        setTimeout(() => {
            this._saveButton.style.top = `calc(100% - ${this._saveButton.clientHeight}px)`;
            this._saveButton.style.opacity = 1;
            this._saveButton.disabled = false;
        }, 1)
    }
}


class PlayerSettings {
    constructor ({
        Player,
    }) {
        this.Player = Player;
        this.Personalise = new Form ({
            formMap: {
                name: {value: '', id: 'personalise-name', preset: ''},
                img: {value: '', id: 'personalise-img', preset: 'resources/images/PlayerIconSerious.webp'},
                tiresize: {value: '', id: 'personalise-tiresize', preset: ''},
                bodyheight: {value: '', id: 'personalise-bodyheight', preset: ''}
            },
            saveId: 'personalise-save',
            formId: 'personalise-form',
            containerId: 'settings-personalise',
            onSave: (Form) => {
                return new Promise((res, rej) => {

                    console.log(Form)
                    // Apply icon
                    let iconSrc = Form._formMap.img.value;
                    let apply = ele => ele.src = iconSrc;
                    applyToClass('icon-counter', apply);

                    res(Form)
                });
            }
        })
    }

    _SetActive_ () {
        // List of all onsave functions
        this.Personalise._onSave_();
    }
}

class SessionSettings {
    constructor ({
        Session,
    }) {
        this.Session = Session;

        // Gamemode settings
        this.GameMode = new Form ({
            formMap: {
                eventType: {value: 'Fun', id: 'gamemode-eventtype', preset: 'Fun'},
                img: {value: 'Street', id: 'gamemode-ruleset', preset: 'Street'}
            },
            saveId: 'gamemode-save',
            formId: 'gamemode-form',
            containerId: 'settings-gamemode',
            onSave: (Form) => {
                return new Promise((res, rej) => {
                    // Get values from custom penalty elements 
                    console.log('saved')
                    res(Form)
                })
            }
        })

        // Attach custom form for branched page to change penalty value
        this.GameMode._penalties = {};
        this.GameMode.PenaltyForm = new Form({
            formMap: {
                name: {value: '', id: 'penalty-name', preset: ''},
                value: {value: '', id: 'penalty-value', preset: ''}
            },
            saveId: 'penalty-save',
            formId: 'penalty-form',
            containerId: 'settings-gamemode-penalty',
            onSave: (Form) => {
                return console.log('nut')
            }
        });
        
        this.GameMode._openPenalty_ = (name) => {
            console.log('open penalty')
            let penalty = this.GameMode._penalties[name];
            let formMap = this.GameMode.PenaltyForm.formMap;
            if (penalty) {
                document.getElementById(formMap.name.id).value = penalty.value;
            }

            // Change onsave
            let Form = this.GameMode.PenaltyForm
            this.GameMode.PenaltyForm._onSave_ =  () => {
                return new Promise((res, rej) => {

                    let newPenalty = {
                        name: Form._formMap.name.value,
                        value:  Form._formMap.value.value,
                    }
                    let name = newPenalty.name;

                    this.GameMode._penalties[name] = newPenalty;
                    res(Form)
                })
            }
        }

        document.getElementById('add-penalty').addEventListener('click', this.GameMode._openPenalty_)

    }
}

export {PlayerSettings, SessionSettings};