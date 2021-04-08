class Form {
    constructor ({
        formMap,
        saveId,
        containerId,
        onSave,
    }) {
        this._inputs = [];
        formMap.forEach(form => this._inputs.push(document.getElementById(form.id)));
        this._container = document.getElementById(containerId) ?? null;
        this._saveButton = document.getElementById(saveId) ?? null;
        this.__dataURLs = {};
        this._formMap = formMap;

        // Update form method
        this._updateForm_ = () => {    
            // set form values to properties
            this._formMap.forEach(field => {
                let ele = document.getElementById(field.id);
                let type = ele.getAttribute('type');
                switch (type) {
                    case 'text':
                        ele.value = field.value ?? field.preset;
                        break;
                    
                    case 'file':
                        let img = ele.nextElementSibling;
                        img.src = field.value ?? img.src;
                        let text = img.nextElementSibling;
                        text.innerHTML = 'upload...'
                        break;
                }
                ele.dataset.value = field.value ?? field.preset;
            });
        }

        // Save form method
        this._onSave_ = onSave;
        this._save_ = () => {
            // set properties to form values
            this._formMap.forEach(field => {
                let ele = document.getElementById(field.id);
                field.value = ele.dataset.value ?? field.value;
            })

            if (this._onSave_ && typeof this._onSave_ === 'function') this._onSave_()
        }
        if (this._saveButton) this._saveButton.addEventListener('click', this._save_)


        // === EVENT HANDLERS ==
        this.__InputTextEvent__ = (e) => {
            let input = e.currentTarget;
            input.dataset.value = input.value;
        }

        this.__InputFileEvent__ = (e) => {
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

class Settings {
    constructor () {
        this.test = new Form ({
            formMap: [
                {value: this._name, id: 'personalise-name', preset: ''},
                {value: this._imgUrl, id: 'personalise-img', preset: ''},
                {value: this._tireSize, id: 'personalise-tiresize', preset: ''},
                {value: this._bodyHeight, id: 'personalise-bodyheight', preset: ''}
            ],
            saveId: 'personalise-save',
            containerId: 'settings-personalise',
            onSave: () => console.log('saved'),
        })
    }
}

export {Settings};