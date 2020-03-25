// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

//window is lost when spawned on the bottom right corner of the secondary monitor.
document.querySelector('#btnSpawnLost').addEventListener('click', () => {
    window.ipcRenderer.send('spawn-window', {bounds: {x: -400, y: 550}});
})

//window is lost when spawned on the primary and moved to the bottom right corner of the secondary
document.querySelector('#btnMoveLost').addEventListener('click', () => {
    window.ipcRenderer.send('spawn-and-move-window', {initialBounds: {x: 100, y: 100}, bounds: {x: -400, y: 550}});
})

// window is moved to the wrong position when spawned on the primary and moved to the right side of the secondary.
// Doubled bounds are still on monitor, unlike the lost cases.
document.querySelector('#btnMoveDouble').addEventListener('click', () => {
    window.ipcRenderer.send('spawn-and-move-window', {initialBounds: {x: 100, y: 100}, bounds: {x: -400, y: 200}});
})

// window is spawned on the secondary and moved to the bottom right corner of the secondary. 
// In other cases window was lost in this position, but it is visible in this case.
document.querySelector('#btnMoveWorking').addEventListener('click', () => {
    window.ipcRenderer.send('spawn-and-move-window', {initialBounds: {x: -400, y: 0}, bounds: {x: -400, y: 550}});
})