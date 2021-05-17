class Form {
    constructor ({
        formMap,
        saveId,
        formId,
        containerId,
        onSave = () => {},
        onReset = () => {},
        isThisActive,
    }) {
        this._container = document.getElementById(containerId) ?? null;
        this._saveButton = document.getElementById(saveId) ?? null;
        this._formElement = document.getElementById(formId) ?? null;
        this.__dataURLs = {};
        this._formMap = formMap;

        if (isThisActive && typeof isThisActive === 'function') this.__isThisActive__ = isThisActive;
        else this.__isThisActive__ = () => {return true;}

        let inputs = [];
        Object.values(formMap).forEach(form => inputs.push(document.getElementById(form.id)));

        // Update form method
        this._updateForm_ = () => {    
            if (!this.__isThisActive__()) return

            // set form values to properties
            Object.values(this._formMap).forEach(field => {
                let ele = document.getElementById(field.id);
                let type = ele.getAttribute('type');
                console.log(type)
                try {
                    switch (type) {
                        case 'number':
                        case 'text':
                            ele.value = field.value;
                            ele.style.color = '';
                            break;
                        
                        case 'file':
                            let img = ele.nextElementSibling;
                            img.src = field.value || field.preset;
                            let text = img.nextElementSibling;
                            text.innerHTML = 'upload...'
                            text.style.color = '';
                            break;
    
                        case 'checkbox':
                            ele.checked = false; 
                            break;
    
                        case 'dropdown':
                            ele.value = field.value ?? field.preset;
                            ele.style.color = '';
                            break;
                    }
                    ele.dataset.value = field.value ?? field.preset;
                } catch {
                    console.log('error')
                }
            });
        }

        // Save form method
        if (onSave && typeof onSave === 'function') this._onSave_ = () => onSave(this) ?? null;
        else this._onSave_ = () => {return}

        // Submit function
        this._submit_ = e => {
            e.preventDefault()

            if (!this.__isThisActive__()) return
            this._saveButton.disabled = true;

            // set properties to form values
            Object.values(this._formMap).forEach(field => {
                let ele = document.getElementById(field.id);
                field.value = ele.dataset.value ?? field.value;
            })


            // Call onsave function and resolve by closing
            Promise.resolve(this._onSave_())
            .then(res => {
                this._container.dispatchEvent(new Event('pageReset'));
            })
            .catch(rej => {
                console.log(rej)
                return alert('Form not accepted')
            })

        }
        if (this._formElement) this._formElement.addEventListener('submit', e => {
            console.log('save')
            this._submit_(e)
        })

        // === EVENT LISTENERS ===
        // Attatch listeners to each input
        if (inputs && Array.isArray(inputs)) inputs.forEach(input => { 
            let type = input.getAttribute('type');
            input.addEventListener('change', e => {
                console.log('clunk')
                if (!type) return 

                // Type specific change
                switch (type) {
                    case 'number':
                    case 'text':
                        this.__InputTextEvent__(e);
                        break;
                    
                    case 'file':
                        this.__InputFileEvent__(e);
                        break;
                    case 'dropdown':
                        this.__InputDropdownEvent__(e);
                        break;
                    case 'checkbox':
                        this.__InputCheckboxEvent__(e);
                        break;
                }

                // Natural change
                this.__InputNeutralEvent__();
            })
        })

        // Attatch custom listeners to container * relating to container.js : BookContainer
        if (onReset && typeof onReset === 'function') this._onReset_ = () => onReset(this) ?? null;
        else this._onReset_ = () => {return}

        if (this._container) {
            
            this._container.addEventListener('pageReset', e => {
                Promise.resolve(this._onReset_())
                .then(res => {
                    this._updateForm_();
                })
                .catch(rej => {
                    return 
                })
                // Reset form
                this._saveButton.style.top = '100%';
                this._saveButton.style.opacity = 0;
                setTimeout(() => {
                    this._saveButton.style.display = 'none';
                }, 500)
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
        let dataURL;
        try {
            dataURL = URL.createObjectURL(file);
        } catch {
            return
        }

        // Clear storage for last URL & Instantuate new Object URL
        if (id in this.__dataURLs) try {
            if (this.__dataURLs[id].length > 2) this.__dataURLs[id].shift().revokeObjectURL()
        } catch {}
        else this.__dataURLs[id] = [];
        this.__dataURLs[id].push(dataURL);

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

    __InputCheckboxEvent__ (e) {
        let input = e.currentTarget;
        input.dataset.value = input.checked;
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
        this.Player = Player || {};
        this.Personalise = new Form ({
            formMap: {
                name: {value: this.Player.name ?? '', id: 'personalise-name', preset: ''},
                img: {value: '', id: 'personalise-img', preset: 'resources/images/PlayerIconSerious.webp'},
                tag: {value: this.Player._tag ?? '', id: 'personalise-tag', preset: ''},
                color: {value: 'Red', id: 'personalise-color', preset: ''},
                tiresize: {value: '', id: 'personalise-tiresize', preset: ''},
                bodyheight: {value: '', id: 'personalise-bodyheight', preset: ''}
            },
            saveId: 'personalise-save',
            formId: 'personalise-form',
            containerId: 'settings-personalise',
            onSave: (Form) => {
                return new Promise((res, rej) => {

                    // Change icon visuals
                    let iconSrc = Form._formMap.img.value || Form._formMap.img.preset;
                    Form._formMap.img.preset = iconSrc;
                    Array.from(document.getElementsByClassName('icon-counter'))
                    .forEach(ele => {
                        ele.src = iconSrc;
                    })

                    // Apply color change
                    let color = Form._formMap.color.value || Form._formMap.color.preset;
                    let fontColor;
                    switch (color) {
                        case 'Blue':
                        case 'Red':
                        case 'Black':
                        case 'Green':
                            fontColor = 'White';
                            break;
                        case 'Yellow':
                            fontColor = 'Black';
                            break;
                    }
                    Array.from(document.getElementsByClassName('color-counter'))
                    .forEach(ele => {
                        ele.style.backgroundColor = color;
                        Array.from(ele.querySelectorAll('*'))
                        .forEach(child => child.style.color = fontColor)
                    })
                    // Apply changes player 
                    this.Player.node = {
                        iconUrl: iconSrc,
                        name: Form._formMap.name.value
                    }
                    this.Player.node.tag.style.color = Form._formMap.color.value;
                    

                    res(Form)
                });
            },
            isThisActive: () => {
                return this.Player.isActive;
            }
        })
        this.DeleteMe = new Form ({
            formMap: {
                confirm: {value: false, id:'deleteplayer-check', preset: false}
            },
            saveId: 'deleteplayer-save',
            formId: 'deleteplayer-form',
            containerId: 'settings-deleteplayer',
            onSave: (Form) => {
                return new Promise((res, rej) => {
                    let confirm = Form._formMap.confirm.value
                    if (confirm === 'true') {
                        console.log(`delete confirm : ${confirm}`)
                        this.Player._delete_()
                        Form._container._closePage_ ();
                    }

                    res(Form)
                });
            },
            isThisActive: () => {
                return this.Player.isActive;
            }
        })
    }

    _SetActive_ () {
        // List of all onsave functions
        this.Personalise._updateForm_();
        this.Personalise._onSave_();
    }
}

class SessionSettings {
    constructor ({
        Session,
    }) {
        this.Session = Session;
        let playerCapacity = 10;
        if (this.Session.isMultiplayer === false) playerCapacity = 1;
        console.log(playerCapacity)
        // === Gamemode settings ===
        this.GameMode = new Form ({
            formMap: {
                eventType: {value: 'Fun', id: 'gamemode-eventtype', preset: 'Fun'},
                img: {value: 'Street', id: 'gamemode-ruleset', preset: 'Street'},
                playerCapacity: {value: playerCapacity, id: 'gamemode-playercapacity', preset: playerCapacity}
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
        this.GameMode._updateForm_();


        // Attach branch Form for Penalties
        this.GameMode._penalties = {};
        this.GameMode.PenaltyForm = new Form({
            formMap: {
                name: {value: '', id: 'penalty-name', preset: ''},
                value: {value: '', id: 'penalty-value', preset: ''},
                delete: {value: '', id: 'penalty-delete', preset: false}
            },
            saveId: 'penalty-save',
            formId: 'penalty-form',
            containerId: 'settings-gamemode-penalty',
        });
        
        // Alter opening sequence
        this.GameMode._openPenalty_ = (oldName) => {
            let Form = this.GameMode.PenaltyForm
            // Get values from old, if used
            let penalty = this.GameMode._penalties[oldName || ''];
            if (penalty) {
                document.getElementById('penalty-delete-container').style.display = 'block';
                Form._formMap.name.value = penalty.name;
                Form._formMap.value.value = penalty.value;
            } else {
                document.getElementById('penalty-delete-container').style.display = 'none';
                Form._formMap.name.value = Form._formMap.name.preset;
                Form._formMap.value.value = Form._formMap.value.preset;
            }
            Form._updateForm_();

            // Change onsave method to work with new penalty
            this.GameMode.PenaltyForm._onSave_ =  () => {
                return new Promise((res, rej) => {

                    // If opened from a created node, delete
                    if (oldName) {
                        // Delete old version
                        document.getElementById(`penalty-${oldName}`).remove();
                        delete this.GameMode._penalties[oldName]

                        // Leave without creating new version and apply changes
                        if (Form._formMap.delete.value === 'true') {
                            Form._container._closePage_ ();
                            this.Session.updateGameRules();
                            return res(Form)
                        } 
                    }

                    // Prevent name duplication
                    let newName = Form._formMap.name.value;
                    let i = 1;
                    while (this.GameMode._penalties[newName]) {
                        newName = `${Form._formMap.name.value}(${i})`;
                        i++; 
                    }
                    let newValue = Form._formMap.value.value;

                    // Create penalty obj
                    let newPenalty = {
                        name: newName,
                        value:  newValue,
                    }
 
                    let id = `penalty-${newPenalty.name}`;
                    let target = document.getElementById(id); 

                    // If no target already exists make a new one
                    if (!target) {
                        target = document.getElementById('penalty-settings-template').content.cloneNode(true).children[0];
                        target.id = id;
                        target.children[2].dataset.moveto = 'settings-gamemode-penalty';

                        target.children[2].addEventListener('click', e => {
                            let name = target.dataset.name;
                            this.GameMode._openPenalty_(name, id);
                        })

                        window.settingsContainer._addHref_(target.children[2])
                        document.getElementById('penalty-settings-target').appendChild(target)      
                    }

                    // Make new value have +/- styling
                    if (newValue > 0) newValue = `+${newValue}`;

                    // Apply styling
                    target.children[0].innerHTML = newName;
                    target.children[1].innerHTML = newValue;
                    target.dataset.name = newName;

                    // Add penalty to map
                    this.GameMode._penalties[newName] = newPenalty;

                    // Reset form map & close page
                    Form._formMap.name.value = Form._formMap.name.preset;
                    Form._formMap.value.value = Form._formMap.value.preset;
                    Form._container._closePage_ ();

                    // Update Game Rules
                    console.log('updating game rules')
                    this.Session.updateGameRules();

                    res(Form)
                })
            }
        }
        // Attach original open
        document.getElementById('add-penalty').addEventListener('click', e => {
            this.GameMode._openPenalty_(null)
        })


        // Add player form
        this.createPlayer = new Form ({
            formMap: {
                name: {value: '', id: 'create-player-name', preset: ''},
                img: {value: '', id: 'create-player-img', preset: 'resources/images/PlayerIconSerious.webp'},
                tag: {value: '', id: 'create-player-tag', preset: ''},
                color: {value: '', id: 'create-player-color', preset: 'Red'},
                tiresize: {value: '', id: 'create-player-tiresize', preset: ''},
                bodyheight: {value: '', id: 'create-player-bodyheight', preset: ''}
            },
            saveId: 'create-player-save',
            formId: 'create-player-form',
            containerId: 'pb-add',
            onSave: (Form) => {
                return new Promise((res, rej) => {
                    const map = Form._formMap

                    let player = this.Session.addPlayer({ name: map.name.value })
                    player.Settings.Personalise._formMap = map

                    this.Session.setPlayer(map.name.value)

                    Form._container._closePage_ ();
                    res(Form)
                });
            }
        })

    }
}

export {PlayerSettings, SessionSettings, Form};