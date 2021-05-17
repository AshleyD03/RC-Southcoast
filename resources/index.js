import { SwipeContainer, BookContainer } from './modules/container.js'
import { Session } from './modules/Session.js'
import { Form } from './modules/Settings.js'

// Swipe containers 
window.mainContainer = new SwipeContainer ({
    panelID: 'record-panel',
    hrefClass: 'record-panel-button',
})
window.scoreBoardTop = new SwipeContainer ({
    panelID: 'scoreBoard-panel',
    hrefClass: 'scoreBoard-href'
})


// Book containers
window.settingsContainer = new BookContainer ({
    panelID: 'settings-bottom',
    hrefClass: 'settings-moveto'
})
window.playerBoardContainer = new BookContainer ({
    panelID: 'playerboard-bottom',
    hrefClass: 'pb-turnTo'
})

/*
// Add custom form to playerBardContainer Add Player Page
window.addPlayerForm = new Form ({
    formMap: {
        name: {value:'', id: 'personalise-name', preset: ''},
        img: {value: '', id: 'personalise-img', preset: 'resources/images/PlayerIconSerious.webp'},
        tag: {value: this.Player._tag ?? '', id: 'personalise-tag', preset: ''},
        color: {value: 'Red', id: 'personalise-color', preset: ''},
        tiresize: {value: '', id: 'personalise-tiresize', preset: ''},
        bodyheight: {value: '', id: 'personalise-bodyheight', preset: ''},
    },
    saveId: '',
    formId: '',
    containerId: '',
    onSave: (Form) => {
        return new Promise((res, rej) => {
            res(Form)
        });
    }
});
window.addPlayerForm;
*/

// Session 
window.Session = new Session({
    isMultiplayer: true,
});
window.Session.addPlayer({name: 'Ashley'});
window.Session.addPlayer({name: 'Xavier'});
window.Session.setPlayer('Ashley')

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

// Testing scripts
mainContainer.__hrefs[1].click()
