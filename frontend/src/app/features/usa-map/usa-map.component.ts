import { Component, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js/auto';
import { faMinus, faPlus, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { states10m } from 'us-atlas/states-10m.json';
// import * as us from "us-atlas/states-10m.json";
import { Feature, topojson } from 'chartjs-chart-geo';
// import { Label } from "ng2-charts";
import { feature } from 'topojson-client';
import * as ChartGeo from "chartjs-chart-geo";
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
// const nation = (feature(us, us.objects.nation) as any).features[0];
// const states = (feature(us, us.objects.states) as any).features;
//const url = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

declare var google: any;

@Component({
  selector: 'app-usa-map',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    Ng2GoogleChartsModule, 
    NgMultiSelectDropDownModule,
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './usa-map.component.html',
  styleUrl: './usa-map.component.css'
})


export class UsaMapComponent {
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
    data: [
      ['State', 'Index'],
      ['US-NJ', '600'],
      ['US-OK', '600'],
      ['US-CA', '600'],
      ['AL', 200],
      ['AK', 300],
      ['AZ',400],
      ['AR', 500],
      ['US-CA', 100],
      ['US-CO', '500'],
      ['US-CT', 100],
      ['US-DE', 100],
      ['US-FL', 100],
      ['US-GA', 100],
      ['US-HI', 100],
      ['US-ID', 100],
      ['US-IL', 100],
      ['US-IN', 100],
      ['US-IA', 100],
      ['US-KS', 100],
      ['US-KY', 100],
      ['US-LA', 100],
      ['US-ME', 100],
      ['US-MD', 100],
      ['US-MA', 100],
      ['US-MI', 100],
      ['US-MN', 100],
      ['US-MS', 100],
      ['US-MO', 100],
      ['US-MT', 100],
      ['US-NE', 100],
      ['US-NV', 100],
      ['US-NH', 100],
      ['US-NJ', 100],
      ['US-NM', 100],
      ['US-NY', 100],
      ['US-NC', 100],
      ['US-ND', 100],
      ['US-OH', 100],
      ['US-OK', 100],
      ['US-OR', 100],
      ['US-PA', 100],
      ['US-RI', 100],
      ['US-SC', 100],
      ['US-SD', 100],
      ['US-TN', 100],
      ['US-TX', 100],
      ['US-UT', 100],
      ['US-VT', 100],
      ['US-VA', 100],
      ['US-WA', 100],
      ['US-WV', 100],
      ['US-WI', 100],
      ['US-WY', 700]
    ],
    dataTable: [
      ['State', 'Index'],
      // ['Germany', 200],
      // ['Poland', 100],
      // ['Spain', 800],
      // ['UK', 500],
      // ['France', 600],
      // ['RU', 400],
      ['US-AL', 200],
      ['US-AK', 300],
      ['US-AZ',400],
      ['US-AR', 500],
      ['US-CA', 100],
      ['US-CO', 500],
      ['US-CT', 200],
      ['US-DE', 300],
      ['US-FL', 400],
      ['US-GA', 500],
      ['US-HI', 600],
      ['US-ID', 700],
      ['US-IL', 100],
      ['US-IN', 200],
      ['US-IA', 300],
      ['US-KS', 400],
      ['US-KY', 500],
      ['US-LA', 600],
      ['US-ME', 700],
      ['US-MD', 200],
      ['US-MA', 300],
      ['US-MI', 400],
      ['US-MN', 500],
      ['US-MS', 600],
      ['US-MO', 700],
      ['US-MT', 800],
      ['US-NE', 200],
      ['US-NV', 300],
      ['US-NH', 400],
      ['US-NJ', 500],
      ['US-NM', 600],
      ['US-NY', 700],
      ['US-NC', 800],
      ['US-ND', 200],
      ['US-OH', 300],
      ['US-OK', 400],
      ['US-OR', 500],
      ['US-PA', 600],
      ['US-RI', 700],
      ['US-SC', 800],
      ['US-SD', 200],
      ['US-TN', 300],
      ['US-TX', 400],
      ['US-UT', 500],
      ['US-VT', 600],
      ['US-VA', 700],
      ['US-WA', 800],
      ['US-WV', 200],
      ['US-WI', 300],
      ['US-WY', 700]
    ],
    options: {
      region: 'US',
      'colorAxis': { 'colors': ['#005F60', '#008083', '#249EA0', '#FAAB36', '#F78104', '#FD5901'] },
      // 'width': 700,
      // 'height': 600,
      resolution: 'provinces',
      // displayMode: 'text'
    }
  };

  ngOnInit(): void {
    google.charts.load('current', {
      // 'packages': ['geochart'],
      'packages': ['corechart'],

      'mapsApiKey': `${environment.googleApiKey}`
    });
    google.charts.setOnLoadCallback(this.drawRegionsMap);
  }

  drawRegionsMap() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1], 
      ['Zucchini', 1],
      ['Pepperoni', 2]
      
    ]);

    // Set chart options
    var options = {'title':'How Much Pizza I Ate Last Night',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
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





  labelData = [12, 14, 3, 19]
  myChart: any = '';
  countryChart!: Partial<ChartOptions>
  geoData: any;

  regions: any = {
    "IL": 1,
    "TX": 1
  }
  seriesData = {
    'US-CA': 11100,   // Canada
    'US-IL': 2510,    // Germany
    'US-NY': 3710,    // France
    'US-TX': 5710,    // Australia
    'US-CO': 8310,    // Great Britain
  };
  readonly title = "Chart.js Geo + Angular";

  readonly geoChartType = "choropleth";
  readonly geoChartLegend = false;
  readonly geoChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scale: {
      projection: "albersUsa"
    } as any,
    geo: {
      colorScale: {
        display: true,
        position: "bottom",
        quantize: 5,
        legend: {
          position: "bottom-right"
        }
      }
    }
  };
  // readonly geoChartLabels: Label[] = states.map(d => d.properties.name);
  // readonly geoColors = states.map(() => ({}));
  // readonly geoChartData = [
  //   {
  //     label: "States",
  //     outline: nation,
      // data: states.map(d => ({
      //   feature: d,
      //   value: Math.random() * 10
      // }))
    }
  // ];



  


  // data = {
  //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   datasets: [{
  //     label: 'Weekly Sales',
  //     data: [18, 12, 6, 9, 12, 3, 9],
  //     backgroundColor: [
  //       'rgba(255, 26, 104, 0.2)',
  //       'rgba(54, 162, 235, 0.2)',
  //       'rgba(255, 206, 86, 0.2)',
  //       'rgba(75, 192, 192, 0.2)',
  //       'rgba(153, 102, 255, 0.2)',
  //       'rgba(255, 159, 64, 0.2)',
  //       'rgba(0, 0, 0, 0.2)'
  //     ],
  //     borderColor: [
  //       'rgba(255, 26, 104, 1)',
  //       'rgba(54, 162, 235, 1)',
  //       'rgba(255, 206, 86, 1)',
  //       'rgba(75, 192, 192, 1)',
  //       'rgba(153, 102, 255, 1)',
  //       'rgba(255, 159, 64, 1)',
  //       'rgba(0, 0, 0, 1)'
  //     ],
  //     borderWidth: 1
  //   }]
  // };

  // ngOnInit() {
  //   this.RenderChart(this.geoData)

  //   fetch(url).then((result) => result.json()).then((datapoint) => {
  //     const countries = ChartGeo.topojson.feature(datapoint, datapoint.objects.countries);
  //     //.features; @8.43
  //     console.log(countries)

  //     this.geoData = {
  //       labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //       datasets: [{
  //         label: 'Weekly Sales',
  //         data: [18, 12, 6, 9, 12, 3, 9],
  //         backgroundColor: [
  //           'rgba(255, 26, 104, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)',
  //           'rgba(0, 0, 0, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgba(255, 26, 104, 1)',
  //           'rgba(54, 162, 235, 1)',
  //           'rgba(255, 206, 86, 1)',
  //           'rgba(75, 192, 192, 1)',
  //           'rgba(153, 102, 255, 1)',
  //           'rgba(255, 159, 64, 1)',
  //           'rgba(0, 0, 0, 1)'
  //         ],
  //         borderWidth: 1
  //       }]
  //     }
  //   })
  // }

  // RenderChart(geoData: any) {
  // this.myChart = new Chart('myChart',
  //   {
  //     type: 'bar',
  //     data: this.geoData,
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   }
  // );
  // }
  
  //CHARTJS-GEO attempt #2
  // readonly title = "Chart.js Geo + Angular";

  // readonly geoChartType = "choropleth";
  // readonly geoChartLegend = false;
  // readonly geoChartOptions = {
  //   responsive: true,
  //   // We use these empty structures as placeholders for dynamic theming.
  //   scale: {
  //     projection: "albersUsa"
  //   } as any,
  //   geo: {
  //     colorScale: {
  //       display: true,
  //       position: "bottom",
  //       quantize: 5,
  //       legend: {
  //         position: "bottom-right"
  //       }
  //     }
  //   }
  // };
  // readonly geoChartLabels: Label[] = states.map(d => d.properties.name);
  // readonly geoColors = states.map(() => ({}));
  // readonly geoChartData = [
  //   {
  //     label: "States",
  //     outline: nation,
  //     data: states.map(d => ({
  //       feature: d,
  //       value: Math.random() * 10
  //     }))
  //   }
  // ];

  //CHARTJS-GEO attempt #1
  // nation: Feature = topojson.feature(states10m as any, states10m.objects.nation as any).features[0];
  // states: Feature = topojson.feature(states10m as any, states10m.objects.states as any).features;

  // data: ChartConfiguration<'choropleth'>['data'] = {
  //   labels: this.states.map((d:any) => d.properties.name),
  //   datasets: [
  //     {
  //       label: 'States',
  //       outline: this.nation,
  //       data: this.states.map((d:any) => ({
  //         feature: d,
  //         value: Math.random() * 11,
  //       })),
  //     },
  //   ],
  // };

  // config: ChartConfiguration<'choropleth'> = {
  //   type: 'choropleth',
  //   this.data,
  //   options: {
  //     scales: {
  //       projection: {
  //         axis: 'x',
  //         projection: 'albersUsa',
  //       },
  //       color: {
  //         axis: 'x',
  //         quantize: 5,
  //         legend: {
  //           position: 'bottom-right',
  //           align: 'right',
  //         },
  //       },
  //     },
  //   },
  // };

  // @ViewChild('regionLabels') regionLabels: any;

  // usaMapConfig = {
  //   series: {
  //     regions: [{
  //       attribute: "fill",
  //       legend: {
  //         title: "2023 production",
  //       },
  //       scale: {
  //         myScaleOne: "#c79efd",
  //         myScaleTwo: "#ffc371",
  //         myScaleThree: "#08d191",
  //       },
  //       values: {
  //         "US-IL": "myScaleOne",
  //         "US-CA": "myScaleTwo",
  //         "US-TX": "myScaleThree"
  //       },
  //       regionLabelStyle: {
  //         initial: {
  //           fill: '#B90E32'
  //         },
  //         hover: {
  //           fill: 'black'
  //         }
  //       },
  //       regionStyle: {
  //         initial: {
  //           stroke: "#9599ad",
  //           fill: "blue"
  //         },
  //         hover: {
  //           cursor: 'pointer'
  //         }
  //       },
  //       labels: {
  //         regions:
  //           [{
  //             values: this.seriesData,
  //             scale: ['#C8EEFF', '#0071A4'],
  //             normalizeFunction: 'polynomial',
  //             // "US-IL": "test"

  //           }],

  //         // regions: {
  //         // render: function(code: string){
  //         //   var doNotShow = ['US-RI', 'US-DC', 'US-DE', 'US-MD'];

  //         //   if (doNotShow.indexOf(code) === -1) {
  //         //     return code.split('-')[1];
  //         //   }
  //         // },
  //         // offsets: function(code: string){
  //         //   return {
  //         //     'CA': [-10, 10],
  //         //     'ID': [0, 40],
  //         //     'OK': [25, 0],
  //         //     'LA': [-20, 0],
  //         //     'FL': [45, 0],
  //         //     'KY': [10, 5],
  //         //     'VA': [15, 5],
  //         //     'MI': [30, 30],
  //         //     'AK': [50, -25],
  //         //     'HI': [25, 50]
  //         //   }[code.split('-')[1]];
  //         // }
  //       },

  //     },

  //     ],
  //   },

  // }

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

