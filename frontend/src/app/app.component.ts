import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { HeaderComponent } from "./core/components/header/header.component";
import { DarkToggleComponent } from "./core/components/dark-toggle/dark-toggle.component";
import { SidebarComponent } from "./core/components/sidebar/sidebar.component";
import { faBars, faChartLine, faFlagUsa, faGear, faGlobe, faUser, faWheatAwn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        NavbarComponent,
        HeaderComponent,
        DarkToggleComponent,
        SidebarComponent,
        FontAwesomeModule
    ]
})
export class AppComponent {
  title = 'frontend';

  faWheatAwn = faWheatAwn;
  faChartLine = faChartLine;
  faFlagUsa = faFlagUsa;
  faGlobe = faGlobe;
  faGear = faGear;
  faUser = faUser;
  faBars = faBars;
}
