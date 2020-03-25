/**
 * Test Module to show ways scaling bug presents.
 * Test requires two monitors that are aligned on the top with Primary on the right
 * Primary: scaling 200%, Resolution: 2560x1440
 * Secondary: scaling 100%, Resolution 1920x1080
 * Other resolutions may produce the bug, but since results suggest bounds are getting incorrectly scaled,
 * test bounds may need to be adjusted so that the value doubled is off monitor
 * 
 * The first two test cases show the window getting lost when positioned on the bottom right corner of the secondary in different ways.
 * Case 1: Window is lost when directly spawned on bottom right corner of secondary.
 * Case 2: Window is lost when spawned on the primary and moved to the bottom right corner of the secondary
 * 
 * The next cases show the window not getting lost when moved differently
 * Case 3: Window ends up in the wrong location when spawned on the primary and moved the the middle right of the secondary (bounds are doubled)
 * Case 4: Window is not lost and ends up in the correct position when it is spawned on the secondary and moved to the bottom right corner of the secondary
 * 
 * For each case the window bounds and the monitor information is logged to the main process to show that the window's bounds should be on a monitor
 */

// Modules to control application life and create native browser window
const {app, BrowserWindow, screen} = require('electron')
const ipc = require('electron').ipcMain;
const path = require('path')

let mainWindow

function createWindow (page, bounds) {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 400,
	height: 500,
	x: bounds.x,
	y: bounds.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  win.loadFile(page)
	
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=> {
	mainWindow = createWindow('index.html', {x: 0, y: 0, height: 500, width: 400});
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

//spawn a window
ipc.on('spawn-window', function(event, data) {
	let win = createWindow('spawn.html', data.bounds);
	console.log("Monitor Info", screen.getAllDisplays())
	console.log("Bounds after spawn:", win.getBounds())
})

//spawn a window in one position and immediately move it to another position
ipc.on('spawn-and-move-window', function(event, data) {
	let win = createWindow('spawn.html', data.initialBounds);
	console.log("Monitor Info", screen.getAllDisplays())
	console.log("Bounds after spawn:", win.getBounds())
	win.setBounds(data.bounds)
	console.log("Expected Bounds after move:", data.bounds)
	console.log("Actual Bounds after move:", win.getBounds())
	
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
