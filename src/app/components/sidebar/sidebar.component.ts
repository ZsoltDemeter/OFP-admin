import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  filepath = './assets/Help.pdf'

  openPDF(){
    window.open(this.filepath, '_blank');
  }
  
}
