import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Datum } from '../models/usdainfo.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js/auto';
import { UsdaService } from '../services/usda.service';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usda-data',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterModule],
  templateUrl: './usda-data.component.html',
  styleUrl: './usda-data.component.css'
})

export class UsdaDataComponent implements OnInit, OnDestroy {

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
    value: number[] = [];
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
      debugger
      this.selectedCommodity = (event.target as HTMLSelectElement).value;
    }
  
    onSelectMetric(event: Event) {
      this.selectedMetric = (event.target as HTMLSelectElement).value;
      // switch (this.selectedMetric) {
      //   case 'AREA PLANTED':
      //     if (this.selectedCommodity == 'CORN') {
      //       this.selectedShortDesc = `CORN - ACRES PLANTED`;
      //     }
      //     else {
      //       this.selectedShortDesc = `SOYBEANS - ACRES PLANTED`;
      //     }
      //     console.log('selected commodity:' + this.selectedCommodity)
      //     break;
      //   case 'AREA HARVESTED':
      //     this.selectedShortDesc = `${this.selectedCommodity} - ACRES HARVESTED`;
      //     break;
      //   case 'CONDITION':
      //     debugger
      //     this.selectedShortDesc = `${this.selectedCommodity} - CONDITION, MEASURED IN PCT EXCELLENT`;
      //     break;
      //   case 'ETHANOL USAGE':
      //     this.selectedShortDesc = `CORN, FOR FUEL ALCOHOL - USAGE, MEASURED IN BU`;
      //     break;
      //   case 'PRODUCTION':
      //     if (this.selectedCommodity == 'CORN') {
      //       this.selectedShortDesc = `CORN, GRAIN - PRODUCTION, MEASURED IN BU`;
      //     }
      //     else {
      //       this.selectedShortDesc = `SOYBEANS - PRODUCTION, MEASURED IN BU`;
      //     }
      //     break;
      //   case 'PROGRESS':
      //     this.selectedShortDesc = `${this.selectedCommodity} - PROGRESS, MEASURED IN PCT EMERGED`;
      //     break;
      //   case 'RESIDUAL USAGE':
      //     this.selectedShortDesc = `CORN, FOR OTHER PRODUCTS (EXCL ALCOHOL) - USAGE, MEASURED IN BU`;
      //     break;
      //   case 'STOCKS':
      //     debugger
      //     if (this.selectedCommodity == 'CORN') {
      //       this.selectedShortDesc = `CORN, GRAIN - STOCKS, MEASURED IN BU`;
      //     }
      //     else {
      //       this.selectedShortDesc = 'SOYBEANS - STOCKS, MEASURED IN BU';
      //     }
      //     break;
      //   default:
      //     break;
      // }
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
      // if(!this.value) {
      //   this.isLoading = true;
      // }
      // if(this.isLoading) {
      //   document.getElementById("load-usda-button")?.classList.add("spinner-border")
      // }
      debugger
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
      // console.log(`https://localhost:7281/api/UsdaInfo?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)
      
      if (this.isValidQuery) {
        
        // this.newUsdaData$ = this.http.get<Datum[]>(`https://localhost:7281/api/UsdaInfo?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)
        this.newUsdaData$ = this.http.get<Datum[]>(`https://localhost:7281/api/GetUsdaDataRefactored?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)

        this.getUsdaSubscription = this.newUsdaData$
          .subscribe({
            next: (response) => {
              response.forEach(element => {
                
                switch(selectedMetric) {
                  case 'AREA PLANTED':
                      this.period.push(element.year + ' ' + element.reference_period_desc)
                      this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                      break;
                  case 'AREA HARVESTED':
                    
                    if(element.domaincat_desc == 'NOT SPECIFIED' 
                      && element.statisticcat_desc == 'AREA PLANTED') {
                      // && (element.short_desc == 'CORN - ACRES HARVESTED' 
                      //   || element.short_desc == 'SOYBEANS - ACRES HARVESTED')) {
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
                      && element.domaincat_desc !== 'TYPE OF OPERATION: (WET MILL PLANT)') {
                      this.period.push(element.year + ' ' + element.reference_period_desc)
                      this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
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
                      this.period.push(element.year + ' ' + element.reference_period_desc)
                      this.value.push(parseInt((element.value).replace(/[^0-9.]/g,'')))
                    }
                    break;
                  default:
                    console.log('Bad query')
                    break;
                }
                // this.newRealData.push(parseInt(element.value))
                this.unit = response[0].unit_desc;
              });
              
              console.log('x axis: ' + this.period)
              console.log('y axis: ' + this.value)
              this.RenderChart(this.period, this.value, 'bar', 'barchart');
            }
  
          })
          // document.getElementById("load-usda-button")?.classList.remove("spinner-border")
          this.isLoading = false;
      }
    }
  
    RenderChart(labelData: any[], mainData: any[], type: any, id: any) {
      this.myChart = new Chart('barchart', {
        type: type,
        data: {
          labels: labelData,
          datasets: [{
            label: this.unit,
            data: mainData,
            // backgroundColor: '$8d830a',
            backgroundColor: 'rgba(13,110,253,1.0)',

            borderColor: ['rgba(13,110,253,1.0)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              // ticks: {
              //   stepSize: 1,          
              //   suggestedMin: 'min-int-value',      
              //   suggestedMax: 'max-int-value'       
              // }
            }
          },
          plugins: {
            title: {
              display: true,
              text: this.selectedShortDesc,
              font: {
                size: 25,
                family: "Roboto",
              },
              align: 'center'
            }
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

    reload(){
      // any other execution
      this.ngOnInit()
      this.myChart.destroy();
      this.value = [];
      this.period = [];
      // this.multiyearPeriod = [];
      // this.multiyearValue = [];
      console.log('click')
    }

    ngOnDestroy(): void {
      this.getUsdaSubscription?.unsubscribe();
    }
  
  }
  

