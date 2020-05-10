import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  opened = true;
  constructor() { }

  ngOnInit(): void {
  }

  getToggle(){
    this.opened = !this.opened;
    console.log(this.opened);
  }

}
