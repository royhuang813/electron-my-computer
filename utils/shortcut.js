const register = function (globalShortcut, app) {
  openAbout(globalShortcut, app);
}

function openAbout(globalShortcut, app) {
  globalShortcut.register('Ctrl+.', () => {
    console.log('about')
    app.showAboutPanel()
  })
}
module.exports = register