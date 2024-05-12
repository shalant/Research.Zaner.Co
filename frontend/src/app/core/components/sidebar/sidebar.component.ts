import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWheatAwn, faChartLine, faFlagUsa, faGlobe, faGear, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule,RouterOutlet, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  faWheatAwn = faWheatAwn;
  faChartLine = faChartLine;
  faFlagUsa = faFlagUsa;
  faGlobe = faGlobe;
  faGear = faGear;
  faUser = faUser;
  faBars = faBars;
}
