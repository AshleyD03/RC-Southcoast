import {debounce} from './util.js'

class Container {
    constructor ({panelID, hrefClass}) {
        // Panel container and array of trigger elements
        this.__panel = document.getElementById(panelID);
        this.__hrefs = Array.from(document.getElementsByClassName(hrefClass));

        this.__isMoving = false;
        this.__isMovingTimeouts = [];

        // Attach href triggers
        this.__hrefs.forEach(trigger => 
            trigger.addEventListener('click', e => {
                this.__moveTo__(trigger.dataset.moveto);
                this.__setActive__(trigger);
            })
        )


        // Listen for scroll events
        this.__onScroll__ = debounce(e => {
            if (this.__isMoving) return 
           
            let pos = this.__panel.scrollLeft;
            let count = 0;
            for (let i = 0; i < this.__hrefs.length; i++) {

                let href = this.__hrefs[i];
                if (count < pos + 150 && count > pos - 150) return this.__setActive__(href)
                
                count += document.getElementById(href.dataset.moveto).clientWidth + 0.5;
            }
        }, 10)

        this.__panel.addEventListener('scroll', this.__onScroll__)
        this.__hrefs[0].click()
    }

    __moveTo__ (id) {
        if (!id || typeof id !== 'string') return
        
        this.__isMoving = true;
        
        let timeout = setTimeout(function () {
            let index = this.__isMovingTimeouts.indexOf(timeout);
            this.__isMovingTimeouts.splice(index, 1);
            if (this.__isMovingTimeouts.length === 0 ) {
                this.__isMoving = false;
            }
        }.bind(this), 1000)

        this.__isMovingTimeouts.push(timeout)

        let target = document.getElementById(id);
        if (target) target.scrollIntoView({behavior: "smooth"})
    }

    __setActive__ (target) {
        // Set all Incative 
        this.__hrefs.forEach(trig => {
            trig.classList.remove('active')
            if (trig.children[0]) {
                trig.children[0].classList.add('material-icons-outlined')
                trig.children[0].classList.remove('material-icons')
            }
        })

        // Set target ID to active
        target.classList.add('active');
        if (target.children[0]) {
            target.children[0].classList.add('material-icons')
            target.children[0].classList.remove('material-icons-outlined')
        }
    }
}

export {Container};