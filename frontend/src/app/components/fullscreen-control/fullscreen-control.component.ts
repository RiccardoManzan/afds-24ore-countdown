import { Component } from '@angular/core';

@Component({
  selector: 'app-fullscreen-control',
  templateUrl: './fullscreen-control.component.html',
  styleUrl: './fullscreen-control.component.scss',
})
export class FullscreenControlComponent {
  constructor() {}

  isFullScreen = this.checkIsFullScreen()

  checkIsFullScreen() {
    return document.fullscreenElement !== null;
  }

  maximize() {
    var docElm = document.documentElement;
    docElm.requestFullscreen();
    setTimeout(() => {
      this.isFullScreen = this.checkIsFullScreen()
    }, 100)
  }

  minimize() {
    document.exitFullscreen();
    setTimeout(() => {
      this.isFullScreen = this.checkIsFullScreen()
    }, 200)
  }
}
