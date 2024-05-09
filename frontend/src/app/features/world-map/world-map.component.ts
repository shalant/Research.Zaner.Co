import { Component } from '@angular/core';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.css'
})

export class WorldMapComponent {
  faScrewdriverWrench = faScrewdriverWrench;

}
