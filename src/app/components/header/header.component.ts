import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  currentUser: string;
  data: any;
  refreshToken: string;
  // isAuthenticated: boolean;

  constructor(private service:SharedService) { }
// constructor(private service:SharedService) { }

  async ngOnInit(){
    this.service.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

}
