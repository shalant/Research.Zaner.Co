import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Datum } from '../models/usdainfo.model';
import { UsdaService } from '../services/usda.service';
import { Chart } from 'chart.js/auto';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-usda-data-by-year',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usda-data-by-year.component.html',
  styleUrl: './usda-data-by-year.component.css'
})
export class UsdaDataByYearComponent {

  
  newUsdaData$?: Observable<Datum[]>;
  isValidQuery: boolean = true;
  isLoading: boolean = false;

  selectedMetric: string = '';
  selectedCommodity: string = '';
  selectedYear: string = '';
  selectedShortDesc: string = '';

  myChart: any = '';
  newChartData: any;
  period: any[] = [];
  periodTwenty: any[] = [];
  periodTwentyOne: any[] = [];
  periodTwentyTwo: any[] = [];
  periodTwentyThree: any[] = [];
  periodTwentyFour: any[] = [];
  value: number[] = [];
  valueTwenty: any[] = [];
  valueTwentyOne: any[] = [];
  valueTwentyTwo: any[] = [];
  valueTwentyThree: any[] = [];
  valueTwentyFour: any[] = [];
  multiyearPeriod: any[] = [];
  multiyearValue: any[] = [];
  // value: bigint[] = [];
  unit: string = '';
  timeframe: string = '';
  xAxis: string[] = [];

  tempDecimal: number = 1;

  getUsdaSubscription?: Subscription;
  
  constructor(private usdaService: UsdaService,
    private http: HttpClient) { }

  ngOnInit(): void { }
  
  onSelectCommodity(event: Event) {
    this.selectedCommodity = (event.target as HTMLSelectElement).value;
  }

  onSelectMetric(event: Event) {
    this.selectedMetric = (event.target as HTMLSelectElement).value;
  }

  onSelectYear(event: Event) {
    this.selectedYear = (event.target as HTMLSelectElement).value;
  }

  loadDataWithParams(selectedMetric: string, selectedCommodity: string, selectedYear: string, selectedShortDesc: string): void {
    this.isLoading = true;

    debugger
    switch (this.selectedMetric) {
      case 'AREA PLANTED':
        if (this.selectedCommodity == 'CORN') {
          this.selectedShortDesc = `CORN - ACRES PLANTED`;
        }
        else {
          this.selectedShortDesc = `SOYBEANS - ACRES PLANTED`;
        }
        console.log('selected commodity:' + this.selectedCommodity)
        break;
      case 'AREA HARVESTED':
        this.selectedShortDesc = `${this.selectedCommodity} - ACRES HARVESTED`;
        break;
      case 'CONDITION':
        debugger
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
          this.selectedShortDesc = `SOYBEANS - PRODUCTION, MEASURED IN BU`;
        }
        break;
      case 'PROGRESS':
        this.selectedShortDesc = `${this.selectedCommodity} - PROGRESS, MEASURED IN PCT EMERGED`;
        break;
      case 'RESIDUAL USAGE':
        this.selectedShortDesc = `CORN, FOR OTHER PRODUCTS (EXCL ALCOHOL) - USAGE, MEASURED IN BU`;
        break;
      case 'STOCKS':
        debugger
        if (this.selectedCommodity == 'CORN') {
          this.selectedShortDesc = `CORN, GRAIN - STOCKS, MEASURED IN BU`;
        }
        else {
          this.selectedShortDesc = 'SOYBEANS - STOCKS, MEASURED IN BU';
        }
        break;
      default:
        break;
    }    
    if(this.isLoading) {
      this.DisplaySpinner();
    }

    if (selectedMetric == 'RESIDUAL USAGE' && selectedCommodity == 'SOYBEANS' || selectedMetric == 'ETHANOL USAGE' && selectedCommodity == 'SOYBEANS') {
      // TODO - display a pretty error display
      this.isValidQuery = false;
    }

    if (this.myChart !== '') {
      this.myChart.destroy();
      this.value = [];
      this.period = [];
    }
    console.log(selectedMetric, selectedCommodity, selectedYear, selectedShortDesc);
    
    if (this.isValidQuery) {
      debugger
        // LOCAL DEVELOPMENT
        // this.newUsdaData$ = this.http.get<Datum[]>(`https://localhost:7281/api/GetUsdaDataRefactored?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)
        
        // PROD
        // this.newUsdaData$ = this.http.get<Datum[]>(`https://azuretest20240509141311.azurewebsites.net/api/GetUsdaDataRefactored?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)
        this.newUsdaData$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetUsdaDataRefactoredMultiyear?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)

      this.getUsdaSubscription = this.newUsdaData$
        .subscribe({
          next: (response) => {
            response.forEach(element => {
              
              switch(selectedMetric) {
                case 'AREA PLANTED':
                  // monday 12:17 1st attempt to break data down by year
                  if(element.year == 2020) {
                    // this.periodTwenty.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwenty.push(element.reference_period_desc)
                    this.valueTwenty.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else if(element.year == 2021) {
                    // this.periodTwentyOne.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyOne.push(element.reference_period_desc)
                    this.valueTwentyOne.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else if(element.year == 2022) {
                    // this.periodTwentyTwo.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyTwo.push(element.reference_period_desc)
                    this.valueTwentyTwo.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else if(element.year == 2023) {
                    // this.periodTwentyThree.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyThree.push(element.reference_period_desc)
                    this.valueTwentyThree.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else {
                    // this.periodTwentyFour.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyFour.push(element.reference_period_desc)
                    this.valueTwentyFour.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                    break;
                case 'AREA HARVESTED':
                  if(element.domaincat_desc == 'NOT SPECIFIED' 
                    && element.statisticcat_desc == 'AREA HARVESTED'
                    && (element.short_desc == 'CORN, GRAIN - ACRES HARVESTED' 
                      || element.short_desc == 'SOYBEANS - ACRES HARVESTED')) {
                    this.period.push(element.year + ' ' + element.reference_period_desc)
                    this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  break;
                case 'CONDITION':
                  if(selectedCommodity = 'CORN') {
                    this.selectedShortDesc = 'CORN - CONDITION, MEASURED IN PCT EXCELLENT'
                  }
                  else {
                    this.selectedShortDesc = 'SOYBEANS - CONDITION, MEASURED IN PCT EXCELLENT'
                  }
                  this.period.push(element.year + ' ' + element.reference_period_desc)
                  this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  break;
                case 'ETHANOL USAGE':
                  if(element.domaincat_desc !== 'TYPE OF OPERATION: (DRY MILL PLANT)' 
                    && element.domaincat_desc !== 'TYPE OF OPERATION: (WET MILL PLANT)'
                    && element.reference_period_desc !== 'YEAR') {
                  if(element.year == 2020) {
                    // this.periodTwenty.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwenty.push(element.reference_period_desc)
                    this.valueTwenty.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else if(element.year == 2021) {
                    // this.periodTwentyOne.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyOne.push(element.reference_period_desc)
                    this.valueTwentyOne.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else if(element.year == 2022) {
                    // this.periodTwentyTwo.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyTwo.push(element.reference_period_desc)
                    this.valueTwentyTwo.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else if(element.year == 2023) {
                    // this.periodTwentyThree.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyThree.push(element.reference_period_desc)
                    this.valueTwentyThree.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  else {
                    // this.periodTwentyFour.push(element.year + ' ' + element.reference_period_desc)
                    this.periodTwentyFour.push(element.reference_period_desc)
                    this.valueTwentyFour.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                }
                  break;
                case 'PRODUCTION':
                  if(element.domaincat_desc == 'NOT SPECIFIED' && element.source_desc == 'SURVEY') {
                  this.period.push(element.year + ' ' + element.reference_period_desc)
                  this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                }
                  break;
                case 'PROGRESS':
                  if(element.domaincat_desc == 'NOT SPECIFIED') {
                    this.period.push(element.year + ' ' + element.reference_period_desc)
                    this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  }
                  break;
                case 'RESIDUAL USAGE':
                  this.period.push(element.year + ' ' + element.reference_period_desc)
                  this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                  break;
                case 'STOCKS':
                  if(element.domaincat_desc == 'NOT SPECIFIED') {
                    // this.period.push(element.year + ' ' + element.reference_period_desc)
                    // this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    if(element.year == 2020) {
                      // this.periodTwenty.push(element.year + ' ' + element.reference_period_desc)
                      this.periodTwenty.push(element.reference_period_desc)
                      this.valueTwenty.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    }
                    else if(element.year == 2021) {
                      // this.periodTwentyOne.push(element.year + ' ' + element.reference_period_desc)
                      this.periodTwentyOne.push(element.reference_period_desc)
                      this.valueTwentyOne.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    }
                    else if(element.year == 2022) {
                      // this.periodTwentyTwo.push(element.year + ' ' + element.reference_period_desc)
                      this.periodTwentyTwo.push(element.reference_period_desc)
                      this.valueTwentyTwo.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    }
                    else if(element.year == 2023) {
                      // this.periodTwentyThree.push(element.year + ' ' + element.reference_period_desc)
                      this.periodTwentyThree.push(element.reference_period_desc)
                      this.valueTwentyThree.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    }
                    else {
                      // this.periodTwentyFour.push(element.year + ' ' + element.reference_period_desc)
                      this.periodTwentyFour.push(element.reference_period_desc)
                      this.valueTwentyFour.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    }
                  }
                  break;
                default:
                  console.log('Bad query')
                  break;
              }
              this.unit = response[0].unit_desc;
            });
            debugger
            // var newPeriods = [this.periodTwenty, this.periodTwentyOne, this.periodTwentyTwo, this.periodTwentyThree, this.periodTwentyFour]
            var newPeriods = this.periodTwenty
            this.multiyearPeriod.push(...newPeriods);
            // var newValues = [this.valueTwenty, this.valueTwentyOne, this.valueTwentyTwo, this.valueTwentyThree, this.valueTwentyFour]
            var newValues = this.valueTwenty
            this.multiyearValue.push(...newValues);
            console.log('x axis: ' + this.period)
            console.log('y axis: ' + this.value)
            console.log('labeldata[2]:' +  this.multiyearPeriod[2])
            this.RenderChart(this.multiyearPeriod, this.multiyearValue, 'line', 'linechart');
          }
        })
    }
  }

  RenderChart(labelData: any[], mainData: any[], type: any, id: any) {
    this.myChart = new Chart('linechart', {
      type: type,
      data: {
        labels: labelData[2],
        datasets: [
          {
            label: '2020',
            data: mainData[0],
            backgroundColor: 'red',
            borderColor: ['red'],
            borderWidth: 1
          },
          {
            label: '2021',
            data: mainData[1],
            backgroundColor: 'blue',
            borderColor: ['blue'],
            borderWidth: 1
          },
          {
            label: '2022',
            data: mainData[2],
            backgroundColor: '#6B911B',
            borderColor: ['#6B911B'],
            borderWidth: 1
          },
          {
            label: '2023',
            data: mainData[3],
            backgroundColor: 'pink',
            borderColor: ['pink'],
            borderWidth: 1
          },
          {
            label: '2024',
            data: mainData[4],
            backgroundColor: 'orange',
            borderColor: ['orange'],
            borderWidth: 1
            }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          }
        },
        plugins: {
        },
      }
    });
    this.isLoading = false;
    this.RemoveSpinner();
  }

  DisplaySpinner() {
    document.getElementById("load-usda-button")?.classList.add("spinner-border")
  }

  RemoveSpinner() {
    document.getElementById("load-usda-button")?.classList.remove("spinner-border")
  }

  reload() {
    window.location.reload();
    this.ngOnInit()
    this.myChart.destroy();
    this.value = [];
    this.period = [];
    this.multiyearPeriod = [];
    this.multiyearValue = [];
  }

  ngOnDestroy(): void {
    this.getUsdaSubscription?.unsubscribe();
  }

}
