import { Component, OnInit } from '@angular/core';
import { faMinus, faPlus, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    Ng2GoogleChartsModule, 
    NgMultiSelectDropDownModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.css'
})

export class WorldMapComponent implements OnInit {
  faScrewdriverWrench = faScrewdriverWrench;
  faPlus = faPlus;
  faMinus = faMinus;
  
  dropdownList: any[] = [];
  dropdownList2: any[] = [];
  selectedItems: any[] = [];
  selectedItemsString: string = '';
  secondSelectedItems: any[] = [];
  secondSelectedItemsString: string = '';
  dropdownSettings: IDropdownSettings = {};
  constructor() { }

  public geoChartData = {
    chartType: 'GeoChart',
    dataTable: [
      ['Country', 'Index'],
      ['Germany', 200],
      ['Poland', 100],
      ['Spain', 800],
      ['UK', 500],
      ['France', 600],
      ['RU', 400],

    ],
    options: {
      // 'region': 150,
      'colorAxis': { 'colors': ['#005F60', '#008083', '#249EA0', '#FAAB36', '#F78104', '#FD5901'] },
      // 'width': 700,
      // 'height': 600,
      // 'resolution': 'provinces'
      // displayMode: 'text'
    }
  };

  ngOnInit(): void {
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    
    console.log(this.selectedItemsString)
  }

  onSelectAll(items: any) {
    this.selectedItems.push(...items)
  }

  onDeselect(item: any) {
    this.selectedItems.filter((value, index, arr) => {
      if (value == item) {
        arr.splice(index, 1);
        return true;
      }
      return false;
    })
  }

  onDeselectAll(items: any) {
    this.selectedItems = [];
  }
}
