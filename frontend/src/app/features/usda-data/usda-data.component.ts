import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Datum } from '../models/usdainfo.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, DatasetChartOptions, registerables } from 'chart.js/auto';
import { UsdaService } from '../services/usda.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMinus, faPlus, faSkating, faXmark, faFloppyDisk, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { DROPDOWN_YEARS, dropDownList } from '../../shared/dropdownList';

var bootstrap: any;

interface dataSet {
  year: number;
  value: number;
  reference_period_desc: string;
}

let FakeDataSet: any[] = [88000000, 91123456, 90654321, 87789789,90641000]


@Component({
  selector: 'app-usda-data',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterModule, 
    NgMultiSelectDropDownModule, 
    FormsModule,
    FontAwesomeModule
  ],
  templateUrl: './usda-data.component.html',
  styleUrl: './usda-data.component.css'
})

export class UsdaDataComponent implements OnInit, OnDestroy {

    faPlus = faPlus;
    faMinus = faMinus;
    faXmark = faXmark;
    faFloppyDisk = faFloppyDisk;
    faArrowsRotate = faArrowsRotate;
    newUsdaData$?: Observable<Datum[]>;
    secondUsdaData$?: Observable<Datum[]>;
    isValidQuery: boolean = true;
    isLoading: boolean = false;
    isError: boolean = false;
    hasSecondQuery:boolean = false;

    selectedMetric: string = '';
    selectedCommodity: string = '';
    selectedYear: string = '';
    selectedShortDesc: string = '';
    selectedChart: string = '';
    secondSelectedMetric: string = '';
    secondSelectedCommodity: string = '';
    secondSelectedYear: string = '';
    secondSelectedShortDesc: string = '';
    secondSelectedChart: string = '';
    TomDataSet: any[] = [];
    dougDataSet: any[] = [];
    myChart: any = '';
    secondChart: any = '';
    newChartData: any;
    chartYear: number[] = [];
    chartYear2: number[] = [];
    chartData: number[] = [];
    chartData2: number[] = [];
    period: any[] = [];
    value: number[] = [];
    period2: any[] = [];
    value2: number[] = [];
    unit: string = '';
    timeframe: string = '';
    xAxis: string[] = [];
    smartChartData: dataSet[] = [];
    smartChartData2: dataSet[] = [];
    barChartData: dataSet[] = [];
    lineChartData: dataSet[] = [];
    lineChartData2: dataSet[] = [];
    periodTwenty: any[] = [];
    periodTwentyOne: any[] = [];
    periodTwentyTwo: any[] = [];
    periodTwentyThree: any[] = [];
    periodTwentyFour: any[] = [];
    valueTwenty: any[] = [];
    valueTwentyOne: any[] = [];
    valueTwentyTwo: any[] = [];
    valueTwentyThree: any[] = [];
    valueTwentyFour: any[] = [];
    multiyearPeriod: any[] = [];
    multiyearValue: any[] = [];
    colorArray:any[] = [];
    chadData: dataSet = {
      year: 0,
      value: 0,
      reference_period_desc: ''
    };
    chadData2: dataSet = {
      year: 0,
      value: 0,
      reference_period_desc: ''
    };

    getUsdaSubscription?: Subscription;
    getSecondUsdaSubscription?: Subscription;
    errorCode: string = '404';
    errorNumber:number = 400;

    dropdownList: any[] = [];
    dropdownList2: any[] = [];
    selectedItems: any[] = [];
    secondSelectedItems: any[] = [];
    dropdownSettings: IDropdownSettings = {};

    constructor(private usdaService: UsdaService,
      private http: HttpClient) { }
  
    ngOnInit() {
      this.dropdownList2 = this.dropdownList = DROPDOWN_YEARS;
      
      this.selectedItems = [];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };
    }
  
    onItemSelect(item: any) {
      this.selectedItems.push(item);
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.selectedYear
          .concat(this.selectedItems[i].item_text.toString())      
      }
    }

    onSelectAll(items: any) {
      this.selectedItems.push(...items)
    }

    onDeselect(item:any) {
      this.selectedItems.filter((value,index,arr) => {
        if(value == item) {
          arr.splice(index, 1);
          return true;
        }
      return false;
      })
    }

    onDeselectAll(items:any) {
      this.selectedItems = [];
    }

    onSelectCommodity(event: Event) {
      this.selectedCommodity = (event.target as HTMLSelectElement).value;
    }

    onSelectMetric(event: Event) {
      this.selectedMetric = (event.target as HTMLSelectElement).value;
    }

    onSelectChart(event: Event) {
      this.selectedChart = (event.target as HTMLSelectElement).value;
    }

    setSelectedYear() {
      this.selectedYear.concat(this.selectedItems[0].item_text.toString())
    }
  
    onItemSelect2(item: any) {
      this.secondSelectedItems.push(item);
      console.log(item);
      console.log(this.secondSelectedItems[0].item_text)
      for (let i = 0; i < this.secondSelectedItems.length; i++) {
        this.secondSelectedYear
          .concat(this.secondSelectedItems[i].item_text.toString())      
      }
      console.log(this.secondSelectedYear)
    }

    onSelectAll2(items: any) {
      this.secondSelectedItems.push(...items)
      console.log(items);
    }

    onDeselect2(item:any) {
      this.secondSelectedItems.filter((value,index,arr) => {
        if(value == item) {
          arr.splice(index, 1);
          return true;
        }
      return false;
      })
    }

    onDeselectAll2(items:any) {
      this.secondSelectedItems = [];
    }

    onSelectCommodity2(event: Event) {
      this.secondSelectedCommodity = (event.target as HTMLSelectElement).value;
    }

    onSelectMetric2(event: Event) {
      this.secondSelectedMetric = (event.target as HTMLSelectElement).value;
    }

    onSelectChart2(event: Event) {
      this.secondSelectedChart = (event.target as HTMLSelectElement).value;
    }

    setSelectedYear2() {
      this.secondSelectedYear.concat(this.secondSelectedItems[0].item_text.toString())
    }

    addSecondQueryMenu() {
      this.hasSecondQuery = !this.hasSecondQuery;
      // document.getElementById("second-query-container")?.classList.add("second-query-open")
    }

    closeSecondQueryMenu() {
      this.hasSecondQuery = false;
      // document.getElementById("second-query-container")?.classList.remove("second-query-open")
    }

    loadDataWithParams(selectedMetric: string, selectedCommodity: string, selectedYear: string, selectedShortDesc: string): void {
      this.isLoading = true;
      //  debugger
      // Set Short Description
      switch (this.selectedMetric) {
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
        this.setSelectedYear();
        try {
          this.newUsdaData$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetUsdaDataRefactored?Metric=${selectedMetric}&Commodity=${selectedCommodity}&Year=${selectedYear}&short_desc=${this.selectedShortDesc}`)
          // debugger
          this.getUsdaSubscription = this.newUsdaData$
            .subscribe({
              next: (response) => {
                response.forEach(element => {
                    switch(selectedMetric) {
                      case 'AREA PLANTED':
                        this.PopulateData(element);
                        // this.chadData = {
                        //   year: element.year,
                        //   value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                        //   reference_period_desc: element.reference_period_desc
                        // }
                        // this.smartChartData.push(this.chadData)                       
                        break;
                      case 'AREA HARVESTED':
                        if(element.domaincat_desc == 'NOT SPECIFIED' 
                          && element.statisticcat_desc == 'AREA PLANTED') {
                            this.PopulateData(element);
                          }
                            break;
                      case 'CONDITION':
                        if(selectedCommodity = 'CORN') {
                          this.selectedShortDesc = 'CORN - CONDITION, MEASURED IN PCT EXCELLENT'
                        }
                        else {
                          this.selectedShortDesc = 'SOYBEANS - CONDITION, MEASURED IN PCT EXCELLENT'
                        }
                        this.PopulateData(element);
                        break;
                      case 'ETHANOL USAGE':
                        if(element.domaincat_desc !== 'TYPE OF OPERATION: (DRY MILL PLANT)' 
                          && element.domaincat_desc !== 'TYPE OF OPERATION: (WET MILL PLANT)') {
                            this.PopulateData(element);
                        }
                        break;
                      case 'PRODUCTION':
                        if(element.domaincat_desc == 'NOT SPECIFIED' && element.source_desc == 'SURVEY') {
                          this.PopulateData(element);
                        }
                        break;
                      case 'PROGRESS':
                        if(element.domaincat_desc == 'NOT SPECIFIED') {
                          this.PopulateData(element);
                        }
                        break;
                      case 'RESIDUAL USAGE':
                        this.PopulateData(element);
                        break;
                      case 'STOCKS':
                        if(element.domaincat_desc == 'NOT SPECIFIED') {
                          this.PopulateData(element);
                        }
                        break;
                      default:
                        console.log('Bad query')
                        break;
                    }                  
                  this.unit = response[0].unit_desc;
                });
                
                if(this.selectedChart == 'barchart') {
                  //THIS WORKS
                  // this.RenderChart(this.period, this.value, 'bar', 'barchart');
                  //NEW TRY 153PM Monday
                  debugger
                  this.RenderSmartChart(this.smartChartData, 'bar', this.selectedChart)
                }
                else {
                this.RenderSmartChart(this.smartChartData, 'line', this.selectedChart);
                }
              },
              error: (err: HttpErrorResponse) => {
                this.isError = true;
                this.isLoading = false;
                this.errorCode = err.statusText;
                this.errorNumber = err.status
              }
            })
        } catch (error) {
          this.isError = true;
        }
      }
    }

    loadDataWithParams2(secondSelectedMetric: string, secondSelectedCommodity: string, secondSelectedYear: string, secondSelectedShortDesc: string): void {
      this.isLoading = true;
      // Set Short Description
      // debugger
      switch (this.secondSelectedMetric) {
        case 'AREA PLANTED':
          this.secondSelectedShortDesc = `${secondSelectedCommodity} - ACRES PLANTED`
          console.log('selected commodity:' + this.secondSelectedCommodity)
          break;
        case 'AREA HARVESTED':
          this.secondSelectedShortDesc = `${secondSelectedCommodity} - ACRES HARVESTED`;
          break;
        case 'CONDITION':
          this.secondSelectedShortDesc = `${secondSelectedCommodity} - CONDITION, MEASURED IN PCT EXCELLENT`;
          break;
        case 'ETHANOL USAGE':
          this.secondSelectedShortDesc = `CORN, FOR FUEL ALCOHOL - USAGE, MEASURED IN BU`;
          break;
        case 'PRODUCTION':
          if (secondSelectedCommodity == 'CORN') {
            this.secondSelectedShortDesc = `CORN, GRAIN - PRODUCTION, MEASURED IN BU`;
          }
          else {
            this.secondSelectedShortDesc = `${secondSelectedCommodity} - PRODUCTION, MEASURED IN BU`;
          }
          break;
        case 'PROGRESS':
          this.secondSelectedShortDesc = `${secondSelectedCommodity} - PROGRESS, MEASURED IN PCT EMERGED`;
          break;
        case 'RESIDUAL USAGE':
          this.secondSelectedShortDesc = `CORN, FOR OTHER PRODUCTS (EXCL ALCOHOL) - USAGE, MEASURED IN BU`;
          break;
        case 'STOCKS':
          if (this.secondSelectedCommodity == 'CORN') {
            this.secondSelectedShortDesc = `CORN, GRAIN - STOCKS, MEASURED IN BU`;
          }
          else {
            this.secondSelectedShortDesc = `${secondSelectedCommodity} - STOCKS, MEASURED IN BU`;
          }
          break;
        default:
          break;
      }    
     
      if(this.isLoading) {
        this.DisplaySpinner();
      }
      if (secondSelectedMetric == 'RESIDUAL USAGE' && secondSelectedCommodity == 'SOYBEANS' || secondSelectedMetric == 'ETHANOL USAGE' && secondSelectedCommodity == 'SOYBEANS') {
        // TODO - display a pretty error display
        this.isValidQuery = false;
      }
      if (this.secondChart !== '') {
        this.secondChart.destroy();
        // this.value = [];
        // this.period = [];
      }
      console.log(secondSelectedMetric, secondSelectedCommodity, secondSelectedYear, secondSelectedShortDesc);
      if (this.isValidQuery) {        
        this.setSelectedYear2();
        try {
          this.secondUsdaData$ = this.http.get<Datum[]>(`${environment.backendUrl}/api/GetUsdaDataRefactored?Metric=${secondSelectedMetric}&Commodity=${secondSelectedCommodity}&Year=${secondSelectedYear}&short_desc=${this.secondSelectedShortDesc}`)
// debugger
          this.getSecondUsdaSubscription = this.secondUsdaData$
            .subscribe({
              next: (response) => {
                response.forEach(element => {               
                    switch(secondSelectedMetric) {
                      case 'AREA PLANTED':
                        this.PopulateData2(element);
                          break;
                      case 'AREA HARVESTED':
                        if(element.domaincat_desc == 'NOT SPECIFIED' 
                          && element.statisticcat_desc == 'AREA HARVESTED'
                          && (element.short_desc == 'CORN, GRAIN - ACRES HARVESTED' 
                            || element.short_desc == 'SOYBEANS - ACRES HARVESTED')) {
                              this.PopulateData2(element);
                        }
                        break;
                      case 'CONDITION':
                        this.selectedShortDesc = `${secondSelectedCommodity} - CONDITION, MEASURED IN PCT EXCELLENT`
                        this.PopulateData2(element);
                        break;
                      case 'ETHANOL USAGE':
                        if(element.domaincat_desc !== 'TYPE OF OPERATION: (DRY MILL PLANT)' 
                          && element.domaincat_desc !== 'TYPE OF OPERATION: (WET MILL PLANT)'
                          && element.reference_period_desc !== 'YEAR') {
                            this.PopulateData2(element);
                      }
                        break;
                      case 'PRODUCTION':
                        if(element.domaincat_desc == 'NOT SPECIFIED' && element.source_desc == 'SURVEY') {
                          this.PopulateData2(element);
                      }
                        break;
                      case 'PROGRESS':
                        if(element.domaincat_desc == 'NOT SPECIFIED') {
                          this.PopulateData2(element);
                        }
                        break;
                      case 'RESIDUAL USAGE':
                        this.PopulateData2(element);
                        break;
                      case 'STOCKS':
                        if(element.domaincat_desc == 'NOT SPECIFIED') {
                          this.PopulateData2(element);
                        }
                        break;
                      default:
                        console.log('Bad query')
                        break;
                    }
                  this.unit = response[0].unit_desc;
                });
                
                // debugger
                if(this.secondSelectedChart == 'barchart') {
                this.myChart.data.datasets.push(this.smartChartData2)

                  // this.myChart.data.datasets.push(this.period2, this.value2)
                  // this.RenderChart2(this.period2, this.value2, 'bar', 'barchart');
                }
                else {
                console.log('lineChartData:' + this.smartChartData2)
                debugger
                this.RenderSecondChart(this.smartChartData2, 'line', 'linechart');
                }
              },
              
              error: (err: HttpErrorResponse) => {
                this.isError = true;
                this.isLoading = false;
                this.errorCode = err.statusText;
                this.errorNumber = err.status
              }
            })
        } catch (error) {
          this.isError = true;
        }
      }
    }

    RenderSmartChart(smartChartData: dataSet[], type: string, id: string) {
      const chartLabels: string[] = smartChartData
        .map(chartData => chartData.reference_period_desc);
      const filteredChartLabels = chartLabels.filter((item, index) => {
        return(chartLabels.indexOf(item) == index);
      })

      const chartData: number[] = smartChartData.map(chartData => chartData.value);
      console.log('chadChartData:' + smartChartData)

      const chartYear: number[] = smartChartData.map(chartData => chartData.year);
      console.log('chartYear:' + chartYear)

      console.log('chartLabels:' + chartLabels)
      console.log('chartData:' + chartData)

      this.selectedItems.forEach(x => {
        this.TomDataSet.push({
          type: (this.selectedChart == 'barchart') ? 'bar' : 'line',
          label: x.item_text, 
          data: smartChartData.filter(y => y.year == x.item_text)
          // reference_period_desc: x.item_text, value: chadChartData.filter(y => y.year == x.item_text)
            .map(chartData => chartData.value)
        })
        console.log(this.TomDataSet)
      })
      debugger
      for(let i = 0; i < smartChartData.length; i++) {
        this.dougDataSet.push({
          type: (this.selectedChart == 'barchart') ? 'bar' : 'line',
          label: this.smartChartData[i].reference_period_desc,
          data: smartChartData.filter((y => y.year == chartYear[i]))
        })
      }
      this.myChart = new Chart(this.selectedChart, {
        // data: {
          // labels: filteredChartLabels,
          // datasets: this.dougDataSet,
          //  [
            // {
            //   type: 'bar',
            //   label: 'FakeDataSet',
            //   data: FakeDataSet
            // }, 
            // {
              // type: (this.selectedChart == 'barchart') ? 'bar' : 'line',
              // label: chartYear[0].toString(),
              // data: chartData
              // data: smartChartData.filter(y => y.year == chartYear[0])
              // data: smartChartData

            // },
            // {
            //   type: (this.selectedChart == 'barchart') ? 'bar' : 'line',
            //   label: chartYear[1].toString(),
            //   data: smartChartData.filter(y => y.year == chartYear[1])
            // }
          // ],
          // labels: filteredChartLabels
        // },
        // type: (this.selectedChart == 'barchart') ? 'bar' : 'line',
        data: {
          labels: filteredChartLabels,
          datasets: this.TomDataSet
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
            }
          },
          animation: {
            duration: 2000,
            easing: "linear",
          },
          plugins: {
          },
        }
      });
      this.isLoading = false;
      this.RemoveSpinner();
    }

    RenderChart2(labelData2: any[], mainData2: any[], type: string, id: string) {
      // debugger
      this.myChart = new Chart(this.secondSelectedChart, {
        type: 'bar',
        data: {
          labels: labelData2,
          datasets: [{
            label: this.unit,
            data: mainData2,
            backgroundColor: 'rgba(13,110,253,1.0)',
            borderColor: ['rgba(13,110,253,1.0)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            }
          },
          animation: {
            duration: 2000,
            easing: "linear",
          },
        }
      });
      this.isLoading = false;
      this.RemoveSpinner();
    }

    RenderSecondChart(chadChartData2: dataSet[], type: string, id: string) {
      // debugger
      const chartLabels: string[] = chadChartData2
        .map(chartData2 => chartData2.reference_period_desc);
      const filteredChartLabels = chartLabels.filter((item, index) => {
        return(chartLabels.indexOf(item) == index);
      })
      this.chartData2 = chadChartData2.map(chartData2 => chartData2.value);
      console.log('chadChartData:' + chadChartData2)
      const chartYear2: number[] = chadChartData2.map(chartData2 => chartData2.year);
      console.log('chartLabels:' + chartLabels)
      console.log('chartData:' + this.chartData2)
      console.log('chartYear:' + this.chartYear2)
debugger
      this.RandomColor();
      this.secondSelectedItems.forEach(x => {
        console.log(x)
        this.TomDataSet.push({
          type: (this.secondSelectedChart == 'barchart') ? 'bar' : 'line',
          label: x.item_text, 
          data: this.smartChartData2.filter(y => y.year == x.item_text)
          // data: chadChartData2.filter(y => y.year == x.item_text)
          // reference_period_desc: x.item_text, value: chadChartData.filter(y => y.year == x.item_text)
            .map(chartData2 => chartData2.value), backgroundColor: this.colorArray[0], borderColor: this.colorArray[0]
        })
        console.log(this.TomDataSet)
      })
      this.myChart.update();
      
      this.isLoading = false;
      this.RemoveSpinner();
    }

    PopulateData(element: Datum) {
        this.chadData = {
        year: element.year,
        value: parseInt((element.value).replace(/[^0-9.]/g,'')),
        reference_period_desc: element.reference_period_desc
      }
      this.smartChartData.push(this.chadData)
    }

    PopulateData2(element: Datum) {
      this.chadData2 = {
        year: element.year,
        value: parseInt((element.value).replace(/[^0-9.]/g,'')),
        reference_period_desc: element.reference_period_desc
      }
      this.smartChartData2.push(this.chadData2)
    }

    DisplaySpinner() {
      document.getElementById("load-usda-button")?.classList.add("spinner-border")
    }
  
    RemoveSpinner() {
      document.getElementById("load-usda-button")?.classList.remove("spinner-border")
    }

    RandomColor() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      var color = "rgb(" + r + "," + g + "," + b + ")";
      console.log(color);
      this.colorArray.push(color);
    }

    reload(){
      window.location.reload();
      this.ngOnInit()
      this.myChart.destroy();
      this.value = [];
      this.period = [];
    }

    ngOnDestroy(): void {
      this.getUsdaSubscription?.unsubscribe();
    }
  }