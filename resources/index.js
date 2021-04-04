import { SwipeContainer, BookContainer } from './modules/container.js'
import { PenaltyBoard } from './modules/penalties.js'
import { Clock } from './modules/clock.js'
import { CustomRecorder } from './modules/Record.js'

// Swipe containers 
window.mainContainer = new SwipeContainer ({
    panelID: 'record-panel',
    hrefClass: 'record-panel-button',
})
window.scoreBoardTop = new SwipeContainer ({
    panelID: 'scoreBoard-panel',
    hrefClass: 'scoreBoard-href'
})

// Book container
window.settingsContainer = new BookContainer ({
    panelID: 'settings-bottom',
    hrefClass: 'settings-moveto'
})

// Set up clock
window.clock = new Clock('time-counter');

// Link penalty board
window.penaltyBoard = new PenaltyBoard();

// Construct flag addition
window.flagRecorder = new CustomRecorder({
    onClickClass: 'add-flag',
    classes: ['flag'],
    message: 'Reached Flag 1',
    initMethod: (x) => {
        x.__flagVal = 0;
        x.__setFlagCounters__ = () => {
            Array.from(document.getElementsByClassName('flag-counter'))
            .forEach(ele => {
                ele.innerHTML = `Flag ${x.__flagVal}`
            })
        }
    }, 
    trigger: (x) => {
        x.__flagVal++
        x.__message = `Reached Flag ${x.__flagVal}`;
        x.__setFlagCounters__();
    },
    deleteTrigger: (x) => {
        x.__flagVal -= 1;
        x.__setFlagCounters__();
    }
})

// Command to move into yuri mode
window.yuri = () => {
    Array.from(document.getElementsByTagName('img')).forEach(img => {
        let src = img.getAttribute('src');
        if (src === "resources/images/PlayerIconSerious.webp") {
            img.setAttribute('src', "resources/images/Yuri.webp")
        }
    })
}

// Oh god...
window.nuke = () => {
    Array.from(document.querySelectorAll('body *')).forEach(ele => {
        ele.style.backgroundImage = 'url(resources/images/Yuri.webp)'
    })
}

// Preset commands (for testing)
mainContainer.__hrefs[2].click()
penaltyBoard._createController_('Penalty 1',12)
penaltyBoard._createController_('Penalty 2',3)
penaltyBoard._createController_('Penalty 3', 911)