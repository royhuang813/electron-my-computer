const { BrowserWindow } = require('electron').remote
const fs = require('fs');
const os = require('os');
const path = require('path');
const exec = require('child_process').exec;

let main = {
  dom: {
    HEADER: $('#header'),
    MIN_BTN: $('.min-btn'),
    MAX_BTN: $('.max-btn'),
    CLOSE_BTN: $('.close-btn'),
    CATALOGUE_INPUT: $('.catalogue'),
    SEARCH_INPUT: $('.search')
  },
  temp:{
    document(){

    },
    disk(){

    }
  },
  init() {
    this.eventListener();
  },
  eventListener() {
    this.windowEvent();
  },
  windowEvent() {
    this.dom.HEADER.on('click', 'li', function (evt) {
      console.log('ev', $(this).attr('class'))
      let className = $(this).attr('class'),
        win = BrowserWindow.getFocusedWindow()
      switch (className) {
        case 'min-btn': {
          win.minimize()
          break;
        }
        case 'max-btn': {
          win.isMaximized() ? win.unmaximize() : win.maximize()
          break;
        }
        case 'close-btn': {
          win.hide()
          break;
        }
      }
    })
    this.dom.HEADER.on('mousedown', 'li', function (evt) {
      let className = $(this).attr('class');
      $(`.${className}`).css('filter', 'contrast(0.8)')
    })
    this.dom.HEADER.on('mouseup', 'li', function (evt) {
      let className = $(this).attr('class');
      $(`.${className}`).css('filter', '')
    })
    this.dom.HEADER.on('mouseout', 'li', function (evt) {
      let className = $(this).attr('class');
      $(`.${className}`).css('filter', '')
    })
  },
  
}


$(function () {
  main.init();
})

try {
  let homedir = os.homedir()
  console.log(homedir)
  // getDir(homedir)
  console.log('x',showDisk());
  $('.disk').text(showDisk());

  // let data = fs.readFileSync('C:\\Users\\roy\\Desktop\\1.txt', 'utf8');
  let data = fs.readFileSync('C:\\Users\\roy\\Desktop\\1.txt', 'utf8');
  console.log(data)

} catch (e) {
  console.log('读取文件发生错误')
}

async function getDir(path) {
  const dir = await fs.promises.opendir(path);
  for await (const dirent of dir) {
    console.log(dirent.name);
  }
}

function showDisk(){
  exec('wmic logicaldisk get name,Description,filesystem,size,freespace  /format:list', (err, stdout, stderr)=>{
    if(err){
      console.error(`exec error: ${err}`)
      return;
    }
    console.log('r',stdout)
    $('.disk').text(stdout);
    return stdout
    let aLines = stdout.split('\r\r\n');
    console.log(`stdout: ${aLines}`);
    console.error(`stderr: ${stderr}`);
  })
}