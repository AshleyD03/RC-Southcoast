import {debounce} from './util.js'

/*
    Basic container that has simple
    click href => activate moveto
*/
class HrefContainer {
    constructor ({panelID, hrefClass}) {
        // Panel container and array of trigger elements
        this.__container = document.getElementById(panelID);
        this.__hrefs = Array.from(document.getElementsByClassName(hrefClass));
        
        // Array of href with null destinations
        this.__dirtyHrefs = [];
        for (let i = 0; i < this.__hrefs.length; i++) {
            let href = this.__hrefs[i];
            if (document.getElementById(href.dataset.moveto) === null) {
                this.__hrefs.splice(i, 1);
                this.__dirtyHrefs.push(href);
                i--;
            }
        }

        // Moving properties
        this.__isMoving = false;
        this.__isMovingTimeouts = [];

        // Create changable onclick method
        this.__onHrefClick = (href) => {
            this.__moveTo__(href.dataset.moveto);
        }

        // Attach onclick method
        [...this.__hrefs, ...this.__dirtyHrefs].forEach(trigger => 
            trigger.addEventListener('click', e => {
                this.__onHrefClick(trigger)
            })
        )

        this._addHref_ = (ele, clean=true) => {
            if (clean === true) {
                this.__hrefs.push(ele)
            } else {
                this.__dirtyHrefs.push(ele)
            }
            ele.addEventListener('click', e => {
                this.__onHrefClick(ele)
            })
        }
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
                this.__isMoving = false;
            }
        }, 1000)

        // Append timout and move if target valid
        this.__isMovingTimeouts.push(timeout)
        if (target) return target.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    }
}

/*
    Extended container with active effect on hrefs
    and swipe sensitivity to hrefs
*/
class SwipeContainer extends HrefContainer {
    constructor ({panelID, hrefClass}) {
        super({panelID, hrefClass})

        // Change onHrefClick to add setActive
        this.__onHrefClick = (href) => {
            this.__moveTo__(href.dataset.moveto);
            this.__setActive__(href);
        }

        // Listen for scroll events to activate hrefs
        this.__onScroll__ = debounce(e => {
            if (this.__isMoving) return 
           
            let pos = this.__container.scrollLeft;
            let count = 0;
            for (let i = 0; i < this.__hrefs.length; i++) {

                let href = this.__hrefs[i];
                if (count < pos + 150 && count > pos - 150) return this.__setActive__(href)
                
                count += document.getElementById(href.dataset.moveto).clientWidth + 0.5;
            }
        }, 10)

        this.__container.addEventListener('scroll', this.__onScroll__)
        this.__hrefs[0].click()
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


/*
    A container with similar controls to a panel container,
    that has 1+n slides, where the first is the home page and 
    you can scope deeper into the book by going right into
    the next page.
*/
class BookContainer extends HrefContainer {
    constructor ({panelID, hrefClass}) {
        super({panelID, hrefClass})
        
        // Take apart container for pages
        this.__pages = this.__container.children;
        this.__visiblePages = [this.__pages[0]];
        this.__homePage = this.__pages[0];

        // Hide all pages beside homepage
        this.__subPages = [...this.__pages];
        this.__subPages.splice(0, 1);
        this.__subPages.forEach(page => page.style.display = 'none');

        this.__turnToId__ = (id) => {
            // Get target to moveto
            let target;
            if (id === 'pageback') {
                target = this.__visiblePages[(this.__visiblePages.length - 2)];
            }
            else {
                target = document.getElementById(id);
            }

            // Check if needs to be added to array & displayed
            let index = this.__visiblePages.indexOf(target);
            if (index === -1) {
                this.__visiblePages.push(target);
                target.style.display = 'inline-block'; 
            }       
            
            this.__moveTo__(target.id);
        }

        // Change onHrefClick to make page appear 
        this.__onHrefClick = (href) => {
            let id = href.dataset.moveto;
            this.__turnToId__(id);
        }

        // Listen for scroll events
        this.__onScroll__ = debounce(e => {
        
            let pos = this.__container.scrollLeft;
            let width = this.__homePage.clientWidth;

            // Remove right element
            if (pos % width === 0 && pos/width !== this.__visiblePages.length - 1 && this.__visiblePages.length !== 1) {


                let removed = this.__visiblePages.pop();
                removed.style.display = 'none';
                removed.dispatchEvent(new Event('pageReset'));
            }
        }, 50)
        this.__container.addEventListener('scroll', this.__onScroll__)

        // Attach method to close page on each page
        Array.from(this.__pages).forEach(page => {
            page._closePage_ = () => this.__turnToId__('pageback');
        })
    }
}

export {SwipeContainer, BookContainer};