import {debounce} from './util.js'

class PanelContainer {
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

        // Set movement and get target
        this.__isMoving = true;
        let target = document.getElementById(id);

        // Create a timeout to change isMoving after transition
        let timeout = setTimeout(() => {

            // Remove the this timeout from array
            let index = this.__isMovingTimeouts.indexOf(timeout);
            this.__isMovingTimeouts.splice(index, 1);

            // If array empty change boolean and ensure destination
            if (this.__isMovingTimeouts.length === 0 ) {        
                if (target) target.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
                this.__isMoving = false;
            }
        }, 1000)

        // Append timout and move if target valid
        this.__isMovingTimeouts.push(timeout)
        if (target) target.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
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

class BookContainer {
    /*
        A container with similar controls to a panel container,
        that has 1+n slides, where the first is the home page and 
        you can scope deeper into the book by going right into
        the next page.
    */
    constructor ({bookID, hrefClass}) {
        this.__book = document.getElementById(panelID);
        this.__pages = this.__book.children;
        this.__visPages = [this.__pages[0]];
        this.__homePage = this.__pages[0];
        this.__hrefs = Array.from(document.getElementsByClassName(hrefClass));

    }
}

export {PanelContainer, BookContainer};