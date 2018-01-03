import {Component} from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: '../templates/navbar.html',
  providers: []
})
export class NavbarComponent {
  items = []; // ToDo: Dynamically populate the navbar
  screenWidth: number;

  constructor() {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }
}
