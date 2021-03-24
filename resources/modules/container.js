class container {
    constructor ({panelID, hrefClass}) {
        // Panel container and array of trigger elements
        this.__panel = document.getElementById(panelID);
        this.__hrefs = Array.from(document.getElementsByClassName(hrefClass));
        
        // Attach href triggers
        this.__hrefs.forEach(trigger => 
            trigger.addEventListener('click', e => {
                // Move to elements id
                let id = trigger.dataset.moveto;
                
                this.moveTo(id)

                // Set all Incative 
                this.__hrefs.forEach(trig => {
                    trig.classList.remove('active')
                    trig.children[0].classList.add('material-icons-outlined')
                    trig.children[0].classList.remove('material-icons')
                })

                // Set specific Active
                trigger.classList.add('active');
                trigger.children[0].classList.add('material-icons')
                trigger.children[0].classList.remove('material-icons-outlined')
            })
        )

    }

    moveTo (id) {
        if (!id || typeof id !== 'string') return
        
        let target = document.getElementById(id);
        if (target) target.scrollIntoView({behavior: "smooth"})
    }
}

export const Container = container;