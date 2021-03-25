import { Container } from './modules/container.js'

window.mainContainer = new Container ({
    panelID: 'record-panel',
    hrefClass: 'record-panel-button',
})

window.scoreBoardTop = new Container ({
    panelID: 'scoreBoard-panel',
    hrefClass: 'scoreBoard-href'
})