const {
  BrowserWindow
} = require('electron').remote
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const d = require('diskinfo');
const {
  dir
} = require('console');

let main = {
  dom: {
    HEADER: $('#header'),
    MIN_BTN: $('.min-btn'),
    MAX_BTN: $('.max-btn'),
    CLOSE_BTN: $('.close-btn'),
    CATALOGUE_INPUT: $('.catalogue'),
    SEARCH_INPUT: $('.search'),
    SHOW_CONTENT: $('.show-content'),
    DEV_TOTAL: $('.dev-total'),
    DISK: $('.disk')
  },
  data: {
    basePath: '',
  },
  temp: {
    directory(param) {
      const {
        name,
        updateDate,
        type,
        size
      } = param
      return `
        <tr class="item" data-path="${name ? name : ''}/">
          <td><img class="name" src="./assets/img/directory.png" alt="">${name ? name : '未知名'}</td>
          <td class="update-date">${updateDate ? updateDate : ''}</td>
          <td class="type">${type ? type : ''}</td>
          <td class="size">${size ? size : ''}</td>
        </tr>
      `
    },
    disk(param) {
      const {
        diskName,
        usedRate,
        canUse,
        size
      } = param
      return `
      <li class="box" data-path="${diskName ? diskName : ''}/">
        <img src="./assets/img/disk.png" alt="">
        <div class="disk-info">
          <span class="disk-name">${diskName ? diskName : '未知盘名'}</span>
          <div class="disk-ram-bar">
            <div class="bar-content" style="width:${usedRate ? usedRate : 100}"></div>
          </div>
          <span class="disk-ram-text">${canUse ? canUse : 'xx'}GB可用，共${size ? size : 'xx'}GB</span>
        </div>
      </li>
      `
    }
  },
  init() {
    this.eventListener();
    this.getDiskInfo();
  },
  eventListener() {
    this.windowEvent();
    this.getInItemEvent();
    this.getInDirEvent();
  },
  //窗口按钮事件监听
  windowEvent() {
    this.dom.HEADER.on('click', 'li', function (evt) {
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
  //获取盘符信息
  getDiskInfo() {
    d.getDrives((err, aDrives) => {
      if (err) throw err;
      let diskListHtml = '';
      for (var i = 0; i < aDrives.length; i++) {
        // console.log('描述' + aDrives[i].filesystem);
        // console.log('总空间 ' + aDrives[i].blocks);
        // console.log('已使用' + aDrives[i].used);
        // console.log('可用' + aDrives[i].available);
        // console.log('已用百分比' + aDrives[i].capacity);
        // console.log('盘符' + aDrives[i].mounted);
        // console.log('-----------------------------------------');
        let obj = {
          diskName: aDrives[i].mounted,
          usedRate: aDrives[i].capacity,
          canUse: (aDrives[i].available / 1024 / 1024 / 1024).toFixed(2).slice(0, -1),
          size: (aDrives[i].blocks / 1024 / 1024 / 1024).toFixed(2).slice(0, -1)
        }
        diskListHtml += this.temp.disk(obj)
      }
      $(' DEV_TOTAL')
      this.dom.DEV_TOTAL.text(aDrives.length)
      this.dom.DISK.html(diskListHtml);
    })
  },
  getInItemEvent() {
    this.dom.SHOW_CONTENT.on('dblclick', 'li', (evt) => {
      console.log('evt', evt.currentTarget.dataset.path)
      const {
        path
      } = evt.currentTarget.dataset;
      this.data.basePath += path;
      this.showCurrentDir(this.data.basePath);
    })
  },
  getInDirEvent() {
    this.dom.SHOW_CONTENT.on('dblclick', 'tr', (evt) => {
      console.log('evt', evt.currentTarget.dataset.path)
      const {
        path
      } = evt.currentTarget.dataset;
      this.data.basePath += path;
      this.showCurrentDir(this.data.basePath);
    })
  },
  showCurrentDir(path) {
    fs.readdir(path, (err, files) => {
      if (err) throw err;
      console.log('showCurrentDir', files)
      this.renderCurrentDir(files)
    })
  },
  renderCurrentDir(dirArr) {
    let dirListHtml = `
      <table class="table">
        <thead class="thead">
          <tr>
            <th class="th">名称</th>
            <th class="th">修改日期</th>
            <th class="th">类型</th>
            <th class="th">大小</th>
          </tr>
        </thead>
        <tbody class="tbody">
    `;

    for (let i = 0, l = dirArr.length; i < l; i++) {
      let obj = {
        name: dirArr[i]
      }
      dirListHtml += this.temp.directory(obj)
    }
    dirListHtml += `
        </tbody>
      </table>
    `
    console.log('asx', dirListHtml)
    this.dom.SHOW_CONTENT.html(dirListHtml)

  }
}


$(function () {
  main.init();
})

try {
  let homedir = os.homedir()
  console.log(homedir)

  fs.readdir('D:/', (err, files) => {
    if (err) throw err;
    console.log('files', files)
  })


} catch (e) {
  console.log('读取文件发生错误')
}