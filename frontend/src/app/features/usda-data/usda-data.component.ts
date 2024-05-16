import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Datum } from '../models/usdainfo.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js/auto';
import { UsdaService } from '../services/usda.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface dataSet {
  year: number;
  value: number;
  reference_period_desc: string;
}

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
    newUsdaData$?: Observable<Datum[]>;
    isValidQuery: boolean = true;
    isLoading: boolean = false;
    isError: boolean = false;

    selectedMetric: string = '';
    selectedCommodity: string = '';
    selectedYear: string = '';
    selectedShortDesc: string = '';
    selectedChart: string = '';
  
    myChart: any = '';
    newChartData: any;
    period: any[] = [];
    value: number[] = [];
    unit: string = '';
    timeframe: string = '';
    xAxis: string[] = [];
    lineChartData: dataSet[] = [];
    chadData2020: dataSet[] = [];
    chadData2021: dataSet[] = [];
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
    tempDecimal: number = 1;

    getUsdaSubscription?: Subscription;
  
    dropdownList: any[] = [];
    selectedItems: any[] = [];
    dropdownSettings: IDropdownSettings = {};

    constructor(private usdaService: UsdaService,
      private http: HttpClient) { }
  
    ngOnInit() {
      // TODO: simplify this object lol
      this.dropdownList = [
        { item_id: 1, item_text: '2024' },
        { item_id: 2, item_text: '2023' },
        { item_id: 3, item_text: '2022' },
        { item_id: 4, item_text: '2021' },
        { item_id: 5, item_text: '2020' },
        { item_id: 6, item_text: '2019' },
        { item_id: 7, item_text: '2018' },
        { item_id: 8, item_text: '2017' },
        { item_id: 9, item_text: '2016' },
        { item_id: 10, item_text: '2015' },
        { item_id: 11, item_text: '2014' },
        { item_id: 12, item_text: '2013' },
        { item_id: 13, item_text: '2012' },
        { item_id: 14, item_text: '2010' },
        { item_id: 15, item_text: '2009' },
        { item_id: 16, item_text: '2008' },
        { item_id: 17, item_text: '2007' },
        { item_id: 18, item_text: '2006' },
        { item_id: 19, item_text: '2005' },
        { item_id: 20, item_text: '2004' },
        { item_id: 21, item_text: '2003' },
        { item_id: 22, item_text: '2002' },
        { item_id: 23, item_text: '2001' },
        { item_id: 24, item_text: '2000' },

      ];
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
      console.log(item);
      console.log(this.selectedItems[0].item_text)
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.selectedYear
          .concat(this.selectedItems[i].item_text.toString())      
      }
      console.log(this.selectedYear)
    }

    onSelectAll(items: any) {
      this.selectedItems.push(...items)
      console.log(items);
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
  
    loadDataWithParams(selectedMetric: string, selectedCommodity: string, selectedYear: string, selectedShortDesc: string): void {
      this.setSelectedYear();
      console.log('selectedYear:' + selectedYear);
      this.isLoading = true;
 
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

          this.getUsdaSubscription = this.newUsdaData$
            .subscribe({
              next: (response) => {
                response.forEach(element => {
                  if(this.selectedChart == 'barchart') {
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
                  }
                  else {
                    switch(selectedMetric) {
                      case 'AREA PLANTED':
                          var chadData: dataSet = {
                            year: element.year,
                            value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                            reference_period_desc: element.reference_period_desc
                          }
                          this.lineChartData.push(chadData)
                          console.log('chadData by year:' + this.chadData2020)
                          break;
                      case 'AREA HARVESTED':
                        if(element.domaincat_desc == 'NOT SPECIFIED' 
                          && element.statisticcat_desc == 'AREA HARVESTED'
                          && (element.short_desc == 'CORN, GRAIN - ACRES HARVESTED' 
                            || element.short_desc == 'SOYBEANS - ACRES HARVESTED')) {
                              var chadData: dataSet = {
                                year: element.year,
                                value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                                reference_period_desc: element.reference_period_desc
                              }
                              this.lineChartData.push(chadData)
                        }
                        break;
                      case 'CONDITION':
                        this.selectedShortDesc = `${selectedCommodity} - CONDITION, MEASURED IN PCT EXCELLENT`
                        var chadData: dataSet = {
                          year: element.year,
                          value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                          reference_period_desc: element.reference_period_desc
                        }
                        this.lineChartData.push(chadData)
                        break;
                      case 'ETHANOL USAGE':
                        if(element.domaincat_desc !== 'TYPE OF OPERATION: (DRY MILL PLANT)' 
                          && element.domaincat_desc !== 'TYPE OF OPERATION: (WET MILL PLANT)'
                          && element.reference_period_desc !== 'YEAR') {
                            var chadData: dataSet = {
                              year: element.year,
                              value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                              reference_period_desc: element.reference_period_desc
                            }
                            this.lineChartData.push(chadData)
                      }
                        break;
                      case 'PRODUCTION':
                        if(element.domaincat_desc == 'NOT SPECIFIED' && element.source_desc == 'SURVEY') {
                          var chadData: dataSet = {
                            year: element.year,
                            value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                            reference_period_desc: element.reference_period_desc
                          }
                          this.lineChartData.push(chadData)
                      }
                        break;
                      case 'PROGRESS':
                        if(element.domaincat_desc == 'NOT SPECIFIED') {
                          var chadData: dataSet = {
                            year: element.year,
                            value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                            reference_period_desc: element.reference_period_desc
                          }
                          this.lineChartData.push(chadData)
                        }
                        break;
                      case 'RESIDUAL USAGE':
                        var chadData: dataSet = {
                          year: element.year,
                          value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                          reference_period_desc: element.reference_period_desc
                        }
                        this.lineChartData.push(chadData)
                        break;
                      case 'STOCKS':
                        if(element.domaincat_desc == 'NOT SPECIFIED') {
                          var chadData: dataSet = {
                            year: element.year,
                            value: parseInt((element.value).replace(/[^0-9.]/g,'')),
                            reference_period_desc: element.reference_period_desc
                          }
                          this.lineChartData.push(chadData)
                        }
                        break;
                      default:
                        console.log('Bad query')
                        break;
                    }
                  }
                  this.unit = response[0].unit_desc;
                });
                
                console.log('x axis: ' + this.period)
                console.log('y axis: ' + this.value)
                if(this.selectedChart == 'barchart') {
                  this.RenderChart(this.period, this.value, 'bar', 'barchart');
                }
                else {
                console.log('lineChartData:' + this.lineChartData)
                this.RenderLineChart(this.lineChartData, 'line', 'linechart');
                }
              },
              error: (err: HttpErrorResponse) => {
                this.isError = true;
                this.isLoading = false;
              }
            })
   
        } catch (error) {
          this.isError = true;
        }
      }
    }

    RenderChart(labelData: any[], mainData: any[], type: string, id: string) {
      this.myChart = new Chart(this.selectedChart, {
        type: 'bar',
        data: {
          labels: labelData,
          datasets: [{
            label: this.unit,
            data: mainData,
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
        }
      });
      this.isLoading = false;
      this.RemoveSpinner();
    }

    RenderLineChart(chadChartData: dataSet[], type: string, id: string) {
      const chartLabels: string[] = chadChartData
        .map(chartData => chartData.reference_period_desc);
      const filteredChartLabels = chartLabels.filter((item, index) => {
        return(chartLabels.indexOf(item) == index);
      })

      const chartData: number[] = chadChartData.map(chartData => chartData.value);
      console.log('chadChartData:' + chadChartData)

      const chartYear: number[] = chadChartData.map(chartData => chartData.year);

      console.log('chartLabels:' + chartLabels)
      console.log('chartData:' + chartData)
      console.log('chartYear:' + chartYear)

      let TomDataSet: any[] = [];
      this.selectedItems.forEach(x => {
        console.log(x)
        TomDataSet.push({
          label: x.item_text, data: chadChartData.filter(y => y.year == x.item_text)
            .map(chartData => chartData.value)
        })
        console.log(TomDataSet)
      })

      this.myChart = new Chart(this.selectedChart, {
        type: 'line',
        data: {
          labels: filteredChartLabels,
          datasets: TomDataSet
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