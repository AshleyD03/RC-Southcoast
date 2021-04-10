class Form {
    constructor ({
        formMap,
        saveId,
        containerId,
        onSave,
    }) {
        this._container = document.getElementById(containerId) ?? null;
        this._saveButton = document.getElementById(saveId) ?? null;
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
                }
                ele.dataset.value = field.value ?? field.preset;
            });
        }

        // Save form method
        this._onSave_ = () => onSave(this);
        this._save_ = () => {
            this._saveButton.disabled = true;

            // set properties to form values
            Object.values(this._formMap).forEach(field => {
                let ele = document.getElementById(field.id);
                field.value = ele.dataset.value ?? field.value;
            })

            // Call onsave function and resolve by closing
            if (this._onSave_ && typeof this._onSave_ === 'function') {
                Promise.resolve(this._onSave_()).then(res => {
                    
                    console.log(res)

                    this._container.dispatchEvent(new Event('pageReset'));
                })
            } else this._container.dispatchEvent(new Event('pageReset'));

        }
        if (this._saveButton) this._saveButton.addEventListener('click', this._save_)

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
    __InputTextEvent__ = (e) => {
        let input = e.currentTarget;
        input.dataset.value = input.value;
        input.style.color = 'green';
    }

    __InputFileEvent__ = (e) => {
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

    __InputNeutralEvent__ = () => {
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
            containerId: 'settings-personalise',
            onSave: (Form) => {
                return new Promise((res, rej) => {
                    setTimeout(() => {
                        res(Form)
                    }, 2000)
                });
            }
        })
    }
}

class SessionSettings {
    constructor () {
        
    }
}

export {PlayerSettings, SessionSettings};