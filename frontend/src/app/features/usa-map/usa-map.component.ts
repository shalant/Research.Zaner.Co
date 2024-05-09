import { Component, ViewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-usa-map',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './usa-map.component.html',
  styleUrl: './usa-map.component.css'
})

export class UsaMapComponent {
  faScrewdriverWrench = faScrewdriverWrench;

  countryChart!: Partial<ChartOptions>
  regions:any = {
    "IL":1,
    "TX":1
  }
  seriesData = {
    'US-CA': 11100,   // Canada
    'US-IL': 2510,    // Germany
    'US-NY': 3710,    // France
    'US-TX': 5710,    // Australia
    'US-CO': 8310,    // Great Britain
  };

  labelData = [
    12, 14,3,19
  ]

  @ViewChild('regionLabels') regionLabels: any;

  

  usaMapConfig = {
    series: {
      regions: [{
        attribute: "fill",
        legend: {
          title: "2023 production",
        },
        scale: {
          myScaleOne: "#c79efd",
          myScaleTwo: "#ffc371",
          myScaleThree: "#08d191",
        },
        values :{
          "US-IL": "myScaleOne",
          "US-CA": "myScaleTwo",
          "US-TX": "myScaleThree"
        },
        regionLabelStyle: {
          initial: {
            fill: '#B90E32'
          },
          hover: {
            fill: 'black'
          }
        },
        regionStyle: {
          initial: {
            stroke: "#9599ad",
            fill: "blue"
          },
          hover: {
            cursor: 'pointer'
          }
        },
        labels: {
          regions: 
          [{
            values: this.seriesData,
            scale: ['#C8EEFF', '#0071A4'],
            normalizeFunction: 'polynomial',
            // "US-IL": "test"
            
          }],
          
          // regions: {
          // render: function(code: string){
          //   var doNotShow = ['US-RI', 'US-DC', 'US-DE', 'US-MD'];
  
          //   if (doNotShow.indexOf(code) === -1) {
          //     return code.split('-')[1];
          //   }
          // },
          // offsets: function(code: string){
          //   return {
          //     'CA': [-10, 10],
          //     'ID': [0, 40],
          //     'OK': [25, 0],
          //     'LA': [-20, 0],
          //     'FL': [45, 0],
          //     'KY': [10, 5],
          //     'VA': [15, 5],
          //     'MI': [30, 30],
          //     'AK': [50, -25],
          //     'HI': [25, 50]
          //   }[code.split('-')[1]];
          // }
        },
        
        },
        
      ],
    },
      
    }

    // ngOnInit(): void {
    //   this.countryChart = {
    //     chart: {
    //       height: 320,
    //       type: 'bar',
    //       toolbar: {
    //         show: false,
    //       },
    //     },
    //     plotOptions: {
    //       bar: {
    //         horizontal: true,
    //       },
    //     },
    //     colors: ['#727cf5'],
    //     dataLabels: {
    //       enabled: false,
    //     },
    //     series: [
    //       {
    //         name: 'Sessions',
    //         data: [90, 75, 60, 50, 45, 36, 28, 20, 15, 12],
    //       },
    //     ],
    //     xaxis: {
    //       categories: [
    //         'Illinois',
    //         'Mississippi',
    //         'Florida',
    //         'Maine',
    //         'Oregon',
    //         'Washington',
    //         'Maryland',
    //         'South Carolina',
    //         'Nebraska',
    //         'Wisconsin',
    //       ],
    //       axisBorder: {
    //         show: false,
    //       },
    //       labels: {
    //         formatter: function (val: string) {
    //           return val + '%'
    //         },
    //       },
    //     },
    //   }
    // }
}
