import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { Chart, ChartConfiguration, ChartOptions } from 'chart.js/auto';
import { faMinus, faPlus, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { states10m } from 'us-atlas/states-10m.json';
// import * as us from "us-atlas/states-10m.json";
import { Feature, topojson } from 'chartjs-chart-geo';
// import { Label } from "ng2-charts";
import { feature } from 'topojson-client';
// import * as ChartGeo from "chartjs-chart-geo";
// import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Observable, Subscription, map } from 'rxjs';
import { Datum } from '../models/usdainfo.model';
// const nation = (feature(us, us.objects.nation) as any).features[0];
// const states = (feature(us, us.objects.states) as any).features;
//const url = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

declare var google: any;
interface dataSet {
  year: number;
  value: number;
  reference_period_desc: string;
  state_alpha: string;
}

interface twoElements {
  state_alpha: string;
  value: number;
}

@Component({
  selector: 'app-usa-map',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    NgMultiSelectDropDownModule,
    FormsModule,
    FontAwesomeModule,
    CommonModule
  ],
  templateUrl: './usa-map.component.html',
  styleUrl: './usa-map.component.css'
})

export class UsaMapComponent {
  faScrewdriverWrench = faScrewdriverWrench;
  faPlus = faPlus;
  faMinus = faMinus;
  isLoading: boolean = false;

  dropdownList: any[] = [];
  dropdownList2: any[] = [];
  selectedItems: any[] = [];
  selectedItemsString: string = '';
  secondSelectedItems: any[] = [];
  secondSelectedItemsString: string = '';
  selectedWeek: string = '';
  selectedYear: string = '';
  selectedMetric: string = '';
  selectedCommodity: string = '';
  selectedShortDesc: string = '';

  usdaData$?: Observable<Datum[]>;
  usdaData5Year$?: Observable<Datum[]>;
  getUsdaSubscription?: Subscription;
  getUsda5YearSubscription?: Subscription;

  customColor: string = '';
  dropdownSettings: IDropdownSettings = {};
  smartChartData: dataSet[] = [];
  mapArray: twoElements[] = [];
  fiveYearArray: twoElements[] = [];

  variableColor:string = "green"
  testValue1:number = 5;
  testValue2:number = -5;

  stateData: dataSet = {
    year: 0,
    value: 0,
    reference_period_desc: '',
    state_alpha: ''
  };

  colorArray = ['red', 'green']

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onSelectCommodity(event: Event) {
    this.selectedCommodity = (event.target as HTMLSelectElement).value;
    console.log(this.selectedCommodity)
  }

  onSelectMetric(event: Event) {
    this.selectedMetric = (event.target as HTMLSelectElement).value;
    console.log(this.selectedMetric)
  }

  onSelectYear(event: Event) {
    this.selectedYear = (event.target as HTMLSelectElement).value;
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.selectedYear
        .concat(this.selectedItems[i].item_text.toString())
      this.selectedItemsString
        .concat(this.selectedItems[i].toString)
        .concat(',')
    }
    console.log(this.selectedItemsString)
    this.setSelectedYear();
  }

  onSelectWeek(event: Event) {
    this.selectedWeek = (event.target as HTMLSelectElement).value;
  }

  setSelectedYear() {
    this.selectedYear.concat(this.selectedItems[0].item_text.toString())
  }

loadData(selectedCommodity: string, selectedMetric: string, selectedYear: string, selectedWeek: string) {
  this.smartChartData = [];
  this.mapArray = [];
  this.fiveYearArray = [];
  this.isLoading = true;
  // Set Short Description
  debugger
  switch (this.selectedMetric.substring(0,9)) {
    case 'CONDITION':
    // case 'CONDITION, 5 YEAR AVG, MEASURED IN PCT EXCELLENT':
    if (selectedCommodity === 'WHEAT') {
      this.selectedShortDesc = `${this.selectedCommodity}, WINTER - ${this.selectedMetric}`;
    }
    else {
      this.selectedShortDesc = `${this.selectedCommodity} - ${this.selectedMetric}`;
    }
      // this.selectedShortDesc = `${this.selectedCommodity} - CONDITION, 5 YEAR AVG, MEASURED IN PCT EXCELLENT`;

      this.usdaData5Year$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetMetricVsAverage?Metric=${selectedMetric}&Commodity=${this.selectedCommodity}&Year=${this.selectedYear}&short_desc=${this.selectedShortDesc}&week=${this.selectedWeek}`)

      //api call is no good
      this.getUsda5YearSubscription = this.usdaData5Year$
        .subscribe({
          next: (response) => {
            debugger
            response.forEach(element => {
              this.fiveYearArray.push({
                state_alpha: element.state_alpha,
                value: parseInt(element.value)
              })
            })
          }
        })
        console.log(this.fiveYearArray)
        // this.selectedMetric = 'PROGRESS'
        break;
    
    // this.selectedShortDesc = `${this.selectedCommodity} - CONDITION, 5 YEAR AVG, MEASURED IN PCT EXCELLENT`;
    //   // make 2nd API for 5-year average?
    //   this.usdaData$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetUsdaDataStates?Metric=${this.selectedMetric}&Commodity=${this.selectedCommodity}&Year=2022&short_desc=${this.selectedShortDesc}`)

    // this.getUsdaSubscription = this.usdaData$
    // .subscribe({
    //   next: (response) => {
    //   }
    // })
    //   this.selectedMetric = 'CONDITION'
    //   break;
    // case 'PROGRESS, 5 YEAR AVG, MEASURED IN PCT PLANTED':
    case 'PROGRESS,':
      // this.selectedShortDesc = `${this.selectedCommodity} - PROGRESS, 5 YEAR AVG, MEASURED IN PCT PLANTED`;
      if (selectedCommodity === 'WHEAT') {
        this.selectedShortDesc = `${this.selectedCommodity} + ', WINTER' - ${this.selectedMetric}`;
      }
      else {
        this.selectedShortDesc = `${this.selectedCommodity} - ${this.selectedMetric}`;
      }
        // make 2nd API for 5-year average?
        // populate a similar array as mapArray
        // perform subtraction: normal api call - 5yearaverage api call
        // try coloring data
      // this.usdaData5Year$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetProgressVsAverage?Metric=${selectedMetric}&Commodity=${this.selectedCommodity}&Year=2022&short_desc=${this.selectedShortDesc}&week=WEEK%20%2323`)
      this.usdaData5Year$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetMetricVsAverage?Metric=${selectedMetric}&Commodity=${this.selectedCommodity}&Year=${this.selectedYear}&short_desc=${this.selectedShortDesc}&week=${this.selectedWeek}`)

      //api call is no good
      this.getUsda5YearSubscription = this.usdaData5Year$
        .subscribe({
          next: (response) => {
            debugger
            response.forEach(element => {
              this.fiveYearArray.push({
                state_alpha: element.state_alpha,
                value: parseInt(element.value)
              })
            })
          }
        })
        console.log(this.fiveYearArray)
        // this.selectedMetric = 'PROGRESS'
        break;
    case 'AREA PLANTED':
      this.selectedShortDesc = `${selectedCommodity} - ACRES PLANTED`
      console.log('selected commodity:' + this.selectedCommodity)
      break;
    case 'AREA HARVESTED':
      this.selectedShortDesc = `${this.selectedCommodity} - ACRES HARVESTED`;
      break;
    case 'CONDITION':
      this.selectedShortDesc = `${this.selectedCommodity} - CONDITION, MEASURED IN PCT EXCELLENT`;
      break;
    case 'ETHANOL USAGE':
      this.selectedShortDesc = `CORN, FOR FUEL ALCOHOL - USAGE, MEASURED IN BU`;
      break;
    case 'PRODUCTION':
      if (this.selectedCommodity == 'CORN') {
        this.selectedShortDesc = `CORN, GRAIN - PRODUCTION, MEASURED IN BU`;
      }
      else {
        this.selectedShortDesc = `${selectedCommodity} - PRODUCTION, MEASURED IN BU`;
      }
      break;
    case 'PROGRESS':
      this.selectedShortDesc = `${this.selectedCommodity} - PROGRESS, MEASURED IN PCT EMERGED`;
      break;
    case 'RESIDUAL USAGE':
      this.selectedShortDesc = `CORN, FOR OTHER PRODUCTS (EXCL ALCOHOL) - USAGE, MEASURED IN BU`;
      break;
    case 'STOCKS':
      if (this.selectedCommodity == 'CORN') {
        this.selectedShortDesc = `CORN, GRAIN - STOCKS, MEASURED IN BU`;
      }
      else {
        this.selectedShortDesc = `${selectedCommodity} - STOCKS, MEASURED IN BU`;
      }
      break;
    case 'CONDITION, 5 YEAR AVG, MEASURED IN PCT EXCELLENT':
      this.selectedShortDesc = `${selectedCommodity} - CONDITION, 5 YEAR AVG, MEASURED IN PCT EXCELLENT`;
      // selectedMetric = 'CONDITION'
      break;
    case 'PROGRESS, 5 YEAR AVG, MEASURED IN PCT PLANTED':
      this.selectedShortDesc = `${selectedCommodity} - PROGRESS, 5 YEAR AVG, MEASURED IN PCT PLANTED`;
      selectedMetric = 'PROGRESS'
      break;
    default:
      break;
  }
  debugger
  try {
    // this.usdaData$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetUsdaDataStates?Metric=PROGRESS&Commodity=${this.selectedCommodity}&Year=2022&short_desc=CORN%20-%20PROGRESS,%20MEASURED%20IN%20PCT%20EMERGED`)
    this.usdaData$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetUsdaDataStates?Metric=${selectedMetric}&Commodity=${this.selectedCommodity}&Year=2022&short_desc=${this.selectedShortDesc}`)

    this.getUsdaSubscription = this.usdaData$
      .subscribe({
        next: (response) => {
          debugger
          response.forEach(element => {
            if(element.reference_period_desc === this.selectedWeek) {
              this.mapArray.push({
                state_alpha: element.state_alpha,
                value: parseInt(element.value)
              })
            }
            this.PopulateData(element);
          }) 
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
            // this.isError = true;
            this.isLoading = false;
            // this.errorCode = err.statusText;
            // this.errorNumber = err.status
          }
        
        })      
    } catch (error) {
      // this.isError = true;
    }
    
    console.log("mapArray[0]: " + this.mapArray[0])
    console.log("fiveyeararray[0]: " + this.fiveYearArray[0])
    // document.getElementById("AL")?.classList.add("svg-change-color")
  }

PopulateData(element: Datum) {

  this.stateData = {
    year: element.year,
    value: parseInt((element.value).replace(/[^0-9.]/g, '')),
    reference_period_desc: element.reference_period_desc,
    state_alpha: element.state_alpha
  }
  this.smartChartData.push(this.stateData)
  if(element.reference_period_desc == this.selectedWeek) {
    // this.mapArray.push(this.stateData.state_alpha + ' - ' + parseInt(this.stateData.value))
    // this.mapArray.push({
    //   state_alpha: element.state_alpha,
    //   value: parseInt(element.value)
    // })
    
  }
  // console.log('stateData: ' + this.stateData.state_alpha)
  // console.log("smartChartData:" + this.smartChartData)
  //   console.log("mapArray:" + this.mapArray)
}

getDataForState(stateName: string) {
  // const result = this.fiveYearArray.find((value,index,array) => {
  //   value.state_alpha === stateName
  // })
  // return (result) ? result : (stateName + "N/A")
  
  // const result = this.fiveYearArray.find((value) => 
  //   value.state_alpha === stateName);
  // return result || "N/A";

  //THIS WORKS
  return this.fiveYearArray.find((value, index, array) => {
    return value.state_alpha === stateName;
  })
}

getDataForStateSingleYear(stateName: string) {
  return this.mapArray.find((value, index, array) => {
    return value.state_alpha === stateName;
  })
}

getColorForState(stateName:string) {
  var state = this.getDataForState(stateName);
  if (state) {
    return state.value < 0 ? "red" : "green";
  }
  return "";
}


}











// changeColor() {
//   var colorChangeAR = document.getElementById("AR");
//   colorChangeAR!.setAttribute("fill", (this.fiveYearArray[1].value > 1) ? "green" : "red");
//   // colorChangeMap.("fill").
//   document.getElementById("AL")?.setAttribute("fill", (this.fiveYearArray[0].value > 0) ? "green" : "red");
//   document.getElementById("AK")?.setAttribute("fill", (this.fiveYearArray[1].value > 0) ? "green" : "red");
//   document.getElementById("AR")?.setAttribute("fill", (this.fiveYearArray[2].value > 0) ? "green" : "red");
//   document.getElementById("AZ")?.setAttribute("fill", (this.fiveYearArray[3].value > 0) ? "green" : "red");
//   document.getElementById("CA")?.setAttribute("fill", (this.fiveYearArray[4].value > 0) ? "green" : "red");
//   document.getElementById("CO")?.setAttribute("fill", (this.fiveYearArray[5].value > 0) ? "green" : "red");
//   document.getElementById("CT")?.setAttribute("fill", (this.fiveYearArray[6].value > 0) ? "green" : "red");
//   document.getElementById("DE")?.setAttribute("fill", (this.fiveYearArray[7].value > 0) ? "green" : "red");
//   document.getElementById("FL")?.setAttribute("fill", (this.fiveYearArray[8].value > 0) ? "green" : "red");
//   document.getElementById("GA")?.setAttribute("fill", (this.fiveYearArray[9].value > 0) ? "green" : "red");
//   document.getElementById("HI")?.setAttribute("fill", (this.fiveYearArray[10].value > 0) ? "green" : "red");
//   document.getElementById("IA")?.setAttribute("fill", (this.fiveYearArray[11].value > 0) ? "green" : "red");
//   document.getElementById("ID")?.setAttribute("fill", (this.fiveYearArray[12].value > 0) ? "green" : "red");
//   document.getElementById("IL")?.setAttribute("fill", (this.fiveYearArray[13].value > 0) ? "green" : "red");
//   document.getElementById("IN")?.setAttribute("fill", (this.fiveYearArray[14].value > 0) ? "green" : "red");
//   document.getElementById("KS")?.setAttribute("fill", (this.fiveYearArray[15].value > 0) ? "green" : "red");
//   document.getElementById("KY")?.setAttribute("fill", (this.fiveYearArray[16].value > 0) ? "green" : "red");
//   document.getElementById("LA")?.setAttribute("fill", (this.fiveYearArray[17].value > 0) ? "green" : "red");
//   document.getElementById("MA")?.setAttribute("fill", (this.fiveYearArray[18].value > 0) ? "green" : "red");
//   document.getElementById("MD")?.setAttribute("fill", (this.fiveYearArray[19].value > 0) ? "green" : "red");
//   document.getElementById("ME")?.setAttribute("fill", (this.fiveYearArray[20].value > 0) ? "green" : "red");
//   document.getElementById("MI")?.setAttribute("fill", (this.fiveYearArray[21].value > 0) ? "green" : "red");
//   document.getElementById("MN")?.setAttribute("fill", (this.fiveYearArray[22].value > 0) ? "green" : "red");
//   document.getElementById("MO")?.setAttribute("fill", (this.fiveYearArray[23].value > 0) ? "green" : "red");
//   document.getElementById("MS")?.setAttribute("fill", (this.fiveYearArray[24].value > 0) ? "green" : "red");
//   document.getElementById("MT")?.setAttribute("fill", (this.fiveYearArray[25].value > 0) ? "green" : "red");
//   document.getElementById("NC")?.setAttribute("fill", (this.fiveYearArray[26].value > 0) ? "green" : "red");
//   document.getElementById("ND")?.setAttribute("fill", (this.fiveYearArray[27].value > 0) ? "green" : "red");
//   document.getElementById("NE")?.setAttribute("fill", (this.fiveYearArray[28].value > 0) ? "green" : "red");
//   document.getElementById("NH")?.setAttribute("fill", (this.fiveYearArray[29].value > 0) ? "green" : "red");
//   document.getElementById("NJ")?.setAttribute("fill", (this.fiveYearArray[30].value > 0) ? "green" : "red");
//   document.getElementById("NM")?.setAttribute("fill", (this.fiveYearArray[31].value > 0) ? "green" : "red");
//   document.getElementById("NV")?.setAttribute("fill", (this.fiveYearArray[32].value > 0) ? "green" : "red");
//   document.getElementById("NY")?.setAttribute("fill", (this.fiveYearArray[33].value > 0) ? "green" : "red");
//   document.getElementById("OH")?.setAttribute("fill", (this.fiveYearArray[34].value > 0) ? "green" : "red");
//   document.getElementById("OK")?.setAttribute("fill", (this.fiveYearArray[35].value > 0) ? "green" : "red");
//   document.getElementById("OR")?.setAttribute("fill", (this.fiveYearArray[36].value > 0) ? "green" : "red");
//   document.getElementById("PA")?.setAttribute("fill", (this.fiveYearArray[37].value > 0) ? "green" : "red");
//   document.getElementById("RI")?.setAttribute("fill", (this.fiveYearArray[38].value > 0) ? "green" : "red");
//   document.getElementById("SC")?.setAttribute("fill", (this.fiveYearArray[39].value > 0) ? "green" : "red");
//   document.getElementById("SD")?.setAttribute("fill", (this.fiveYearArray[40].value > 0) ? "green" : "red");
//   document.getElementById("TN")?.setAttribute("fill", (this.fiveYearArray[41].value > 0) ? "green" : "red");
//   document.getElementById("TX")?.setAttribute("fill", (this.fiveYearArray[42].value > 0) ? "green" : "red");
//   document.getElementById("UT")?.setAttribute("fill", (this.fiveYearArray[43].value > 0) ? "green" : "red");
//   document.getElementById("VA")?.setAttribute("fill", (this.fiveYearArray[44].value > 0) ? "green" : "red");
//   document.getElementById("VT")?.setAttribute("fill", (this.fiveYearArray[45].value > 0) ? "green" : "red");
//   document.getElementById("WA")?.setAttribute("fill", (this.fiveYearArray[46].value > 0) ? "green" : "red");
//   document.getElementById("WI")?.setAttribute("fill", (this.fiveYearArray[47].value > 0) ? "green" : "red");
//   document.getElementById("WV")?.setAttribute("fill", (this.fiveYearArray[48].value > 0) ? "green" : "red");
//   document.getElementById("WY")?.setAttribute("fill", (this.fiveYearArray[49].value > 0) ? "green" : "red");
  

// }

  // drawRegionsMap() {
  //   // Create the data table.
  //   var data = new google.visualization.DataTable();
  //   data.addColumn('string', 'Topping');
  //   data.addColumn('number', 'Data');
  //   data.addRows([
  //     ['US-AL', 200],
  //     ['US-AK', 300],
  //     ['US-AZ',400],
  //     ['US-AR', 500],
  //     ['US-CA', 100],
  //     ['US-CO', 500],
  //     ['US-CT', 200],
  //     ['US-DE', 300],
  //     ['US-FL', 400],
  //     ['US-GA', 500],
  //     ['US-HI', 600],
  //     ['US-ID', 700],
  //     ['US-IL', 100],
  //     // ['US-IN', 200],
  //     ['US-IN + 3.5%', 700],
  //     ['US-IA', 300],
  //     ['US-KS', 400],
  //     ['US-KY', 500],
  //     ['US-LA', 600],
  //     ['US-ME', 700],
  //     ['US-MD', 200],
  //     ['US-MA', 300],
  //     ['US-MI', 400],
  //     ['US-MN', 500],
  //     ['US-MS', 600],
  //     ['US-MO', 700],
  //     ['US-MT', 800],
  //     ['US-NE', 200],
  //     ['US-NV', 300],
  //     ['US-NH', 400],
  //     ['US-NJ', 500],
  //     ['US-NM', 600],
  //     ['US-NY', 700],
  //     ['US-NC', 800],
  //     ['US-ND', 200],
  //     ['US-OH', 300],
  //     ['US-OK', 400],
  //     ['US-OR', 500],
  //     ['PA - 1.9%', 100],
  //     ['US-RI', 700],
  //     ['US-SC', 800],
  //     ['US-SD', 200],
  //     ['US-TN', 300],
  //     ['US-TX', 400],
  //     ['US-UT', 500],
  //     ['US-VT', 600],
  //     ['US-VA', 700],
  //     ['US-WA', 800],
  //     ['US-WV', 200],
  //     ['US-WI', 300],
  //     ['US-WY', 700]
      
  //   ]);

  //   // Set chart options
  //   var options = {
  //     'title':'USDA Data',
  //     'region': 'US',
  //     'resolution': 'provinces',
  //     'displayMode': 'text',
  //     // displayMode: 'region',
  //     defaultColor: 'orange',
  //     backgroundColor: 'grey',
  //     toolTip: {
  //       textStyle: {
  //         color: '#FF0000'
  //       }, 
  //       showColorCode: true,
  //       trigger: 'focus'
  //     },
  //     showTooltip: true,
  //     showInfoWindow: true,
  //     // colorAxis: {colors: ['#e7711c', '#4374e0']},
  //     colorAxis: {colors: ['red', 'green']},
  //     legend: {
  //       textStyle: {
  //         // color: 'blue',
  //         fontSize: 16
  //       }
  //     }
  //   };

  //   // Instantiate and draw our chart, passing in some options.
  //   var chart = new google.visualization.GeoChart(document.getElementById('USDA-map'));
  //   chart.draw(data, options);
  // }

  // drawPizzaMap() {
  //   // Create the data table.
  //   var data = new google.visualization.DataTable();
  //   data.addColumn('string', 'Topping');
  //   data.addColumn('number', 'Slices');
  //   data.addRows([
  //     ['Mushrooms', 3],
  //     ['Onions', 1],
  //     ['Olives', 1], 
  //     ['Zucchini', 1],
  //     ['Pepperoni', 2]
      
  //   ]);

    // Set chart options
  //   var options = {'title':'How Much Pizza I Ate Last Night',
  //                  'width':400,
  //                  'height':300};

  //   // Instantiate and draw our chart, passing in some options.
  //   var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  //   chart.draw(data, options);
  // }

  // onItemSelect(item: any) {
  //   this.selectedItems.push(item);
    
  //   console.log(this.selectedItemsString)
  // }

//   onSelectAll(items: any) {
//     this.selectedItems.push(...items)
//   }

//   onDeselect(item: any) {
//     this.selectedItems.filter((value, index, arr) => {
//       if (value == item) {
//         arr.splice(index, 1);
//         return true;
//       }
//       return false;
//     })
//   }

//   onDeselectAll(items: any) {
//     this.selectedItems = [];
//   }

//   isPosOrNeg(stateNumber: number) {
//     if (this.labelData[stateNumber].charAt(3) == '+') {
//       this.customColor = 'green';
//     }
//     else {
//       this.customColor = 'red';
//     }
//   }

//   labelDataOld = [12, 14, 3, 19]
//   labelData = [
//     'AL - 2%',
//     'AK - 3%',
//     'AZ - 4.3%',
//     'AR + 5%',
//     'CA + 1%',
//     'CO + 5%',
//     'CT + 2%',
//     'DE - 3%',
//     'FL + 4%',
//     'GA + 5%',
//     'HI + 6%',
//     'ID + 7%',
//     'IL + 1%',
//     'IN + 2%',
//     'IA + 3%',
//     'KS + 4%',
//     'KY + 5%',
//     'LA + 6%',
//     'ME + 7%',
//     'MD + 2%',
//     'MA + 3%',
//     'MI + 4%',
//     'MN + 5%',
//     'MS + 6%',
//     'MO + 7%',
//     'MT + 8%',
//     'NE + 2%',
//     'NV + 3%',
//     'NH + 4%',
//     'NJ + 5%',
//     'NM + 6%',
//     'NY + 7%',
//     'NC + 8%',
//     'ND + 2%',
//     'OH + 3%',
//     'OK + 4%',
//     'OR + 5%',
//     'PA + 6%',
//     'RI + 7%',
//     'SC + 8%',
//     'SD + 2%',
//     'TN + 3%',
//     'TX 4 4%',
//     'UT + 5%',
//     'VT + 6%',
//     'VA + 7%',
//     'WA + 8%',
//     'WV - 2%',
//     'WI + 3%',
//     'WY + 7%'
//     ]
//   colorArray = ['red', 'green']
//   myChart: any = '';
//   countryChart!: Partial<ChartOptions>
//   geoData: any;

//   regions: any = {
//     "IL": 1,
//     "TX": 1
//   }
//   seriesData = {
//     'US-CA': 11100,   // Canada
//     'US-IL': 2510,    // Germany
//     'US-NY': 3710,    // France
//     'US-TX': 5710,    // Australia
//     'US-CO': 8310,    // Great Britain
//   };
//   readonly title = "Chart.js Geo + Angular";

//   readonly geoChartType = "choropleth";
//   readonly geoChartLegend = false;
//   readonly geoChartOptions = {
//     responsive: true,
//     // We use these empty structures as placeholders for dynamic theming.
//     scale: {
//       projection: "albersUsa"
//     } as any,
//     geo: {
//       colorScale: {
//         display: true,
//         position: "bottom",
//         quantize: 5,
//         legend: {
//           position: "bottom-right"
//         }
//       }
//     },
    
    
//   };

// }

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

  // public geoChartData = {
  //   chartType: 'GeoChart',
  //   data: [
  //     ['State', 'Index'],
  //     ['US-NJ', '600'],
  //     ['US-OK', '600'],
  //     ['US-CA', '600'],
  //     ['AL', 200],
  //     ['AK', 300],
  //     ['AZ',400],
  //     ['AR', 500],
  //     ['US-CA', 100],
  //     ['US-CO', '500'],
  //     ['US-CT', 100],
  //     ['US-DE', 100],
  //     ['US-FL', 100],
  //     ['US-GA', 100],
  //     ['US-HI', 100],
  //     ['US-ID', 100],
  //     ['US-IL', 100],
  //     ['US-IN', 100],
  //     ['US-IA', 100],
  //     ['US-KS', 100],
  //     ['US-KY', 100],
  //     ['US-LA', 100],
  //     ['US-ME', 100],
  //     ['US-MD', 100],
  //     ['US-MA', 100],
  //     ['US-MI', 100],
  //     ['US-MN', 100],
  //     ['US-MS', 100],
  //     ['US-MO', 100],
  //     ['US-MT', 100],
  //     ['US-NE', 100],
  //     ['US-NV', 100],
  //     ['US-NH', 100],
  //     ['US-NJ', 100],
  //     ['US-NM', 100],
  //     ['US-NY', 100],
  //     ['US-NC', 100],
  //     ['US-ND', 100],
  //     ['US-OH', 100],
  //     ['US-OK', 100],
  //     ['US-OR', 100],
  //     ['US-PA', 100],
  //     ['US-RI', 100],
  //     ['US-SC', 100],
  //     ['US-SD', 100],
  //     ['US-TN', 100],
  //     ['US-TX', 100],
  //     ['US-UT', 100],
  //     ['US-VT', 100],
  //     ['US-VA', 100],
  //     ['US-WA', 100],
  //     ['US-WV', 100],
  //     ['US-WI', 100],
  //     ['US-WY', 700]
  //   ],
  //   dataTable: [
  //     ['State', 'Index'],
  //     // ['Germany', 200],
  //     // ['Poland', 100],
  //     // ['Spain', 800],
  //     // ['UK', 500],
  //     // ['France', 600],
  //     // ['RU', 400],
  //     ['US-AL', 200],
  //     ['US-AK', 300],
  //     ['US-AZ',400],
  //     ['US-AR', 500],
  //     ['US-CA', 100],
  //     ['US-CO', 500],
  //     ['US-CT', 200],
  //     ['US-DE', 300],
  //     ['US-FL', 400],
  //     ['US-GA', 500],
  //     ['US-HI', 600],
  //     ['US-ID', 700],
  //     ['US-IL', 100],
  //     ['US-IN', 200],
  //     ['US-IA', 300],
  //     ['US-KS', 400],
  //     ['US-KY', 500],
  //     ['US-LA', 600],
  //     ['US-ME', 700],
  //     ['US-MD', 200],
  //     ['US-MA', 300],
  //     ['US-MI', 400],
  //     ['US-MN', 500],
  //     ['US-MS', 600],
  //     ['US-MO', 700],
  //     ['US-MT', 800],
  //     ['US-NE', 200],
  //     ['US-NV', 300],
  //     ['US-NH', 400],
  //     ['US-NJ', 500],
  //     ['US-NM', 600],
  //     ['US-NY', 700],
  //     ['US-NC', 800],
  //     ['US-ND', 200],
  //     ['US-OH', 300],
  //     ['US-OK', 400],
  //     ['US-OR', 500],
  //     ['US-PA', 600],
  //     ['US-RI', 700],
  //     ['US-SC', 800],
  //     ['US-SD', 200],
  //     ['US-TN', 300],
  //     ['US-TX', 400],
  //     ['US-UT', 500],
  //     ['US-VT', 600],
  //     ['US-VA', 700],
  //     ['US-WA', 800],
  //     ['US-WV', 200],
  //     ['US-WI', 300],
  //     ['US-WY', 700]
  //   ],
  //   options: {
  //     region: 'US',
  //     'colorAxis': { 'colors': ['#005F60', '#008083', '#249EA0', '#FAAB36', '#F78104', '#FD5901'] },
  //     // 'width': 700,
  //     // 'height': 600,
  //     resolution: 'provinces',
  //     displayMode: 'text'
  //   },
    
  // };