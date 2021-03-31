import { Container } from './modules/container.js'
import { PenaltyBoard } from './modules/penalties.js'
import { Clock } from './modules/clock.js'

// Swipe containers 
window.mainContainer = new Container ({
    panelID: 'record-panel',
    hrefClass: 'record-panel-button',
})
window.scoreBoardTop = new Container ({
    panelID: 'scoreBoard-panel',
    hrefClass: 'scoreBoard-href'
})

// Set up clock
window.clock = new Clock('time-counter');

// Link penalty board
window.penaltyBoard = new PenaltyBoard();

// Preset commands (for testing)
mainContainer.__hrefs[1].click()
penaltyBoard._createController_('add',12)
penaltyBoard._createController_('nut',4)
penaltyBoard._createController_('nut',4)