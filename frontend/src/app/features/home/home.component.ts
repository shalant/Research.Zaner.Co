import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../core/components/sidebar/sidebar.component";
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { faMinus, faPlus, faSkating, faXmark, faFloppyDisk, faArrowsRotate, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        SidebarComponent,
        FontAwesomeModule
    ]
})

export class HomeComponent implements OnInit {

    faPlus = faPlus;
    faArrowUp = faArrowUp;
    faArrowDown = faArrowDown;
    myChart: any;
    rapidApiAgData$?: Observable<any[]>;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.rapidApiAgData$ = this.http.get<any[]>(`https://bloomberg-api.p.rapidapi.com/bloomberg/agriculture`)


        this.myChart = new Chart('myChart', {
            type: 'line',
            data: {
                labels: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                ],
                datasets: [{
                    data: [
                        15339,
                        21345,
                        18483,
                        24003,
                        23489,
                        24092,
                        12034
                    ],
                    backgroundColor: 'transparent',
                    borderColor: '#007bff',
                    borderWidth: 4,
                    pointBackgroundColor: '#007bff'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        boxPadding: 3
                    }
                }
            }
        })
    }

    // const axios = require('axios');

    // const options = {
    //     method: 'GET',
    //     url: 'https://bloomberg-api.p.rapidapi.com/bloomberg/agriculture',
    //     headers: {
    //         'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
    //         'X-RapidAPI-Host': 'bloomberg-api.p.rapidapi.com'
    //     }
    // };




    // try {
    //     const response = await axios.request(options);
    //     console.log(response.data);
    // } catch (error) {
    //     console.error(error);
    // }

}





