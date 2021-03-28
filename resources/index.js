import { Container } from './modules/container.js'
import { PenaltyBoard } from './modules/penalties.js'

// Swipe containers 
window.mainContainer = new Container ({
    panelID: 'record-panel',
    hrefClass: 'record-panel-button',
})
window.scoreBoardTop = new Container ({
    panelID: 'scoreBoard-panel',
    hrefClass: 'scoreBoard-href'
})

window.penaltyBoard = new PenaltyBoard();

// Preset commands (for testing)
mainContainer.__hrefs[1].click()
penaltyBoard._createController_('add',12)
penaltyBoard._createController_('nut',4)