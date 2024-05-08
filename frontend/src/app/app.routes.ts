import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { UsdaDataComponent } from './features/usda-data/usda-data.component';
import { UsdaDataByYearComponent } from './features/usda-data-by-year/usda-data-by-year.component';
import { UsaMapComponent } from './features/usa-map/usa-map.component';
import { WorldMapComponent } from './features/world-map/world-map.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'usda-data',
        component: UsdaDataComponent
    },
    {
        path: 'usda-data-by-year',
        component: UsdaDataByYearComponent
    },
    {
        path: 'usa-map',
        component: UsaMapComponent
    },
    {
        path: 'world-map',
        component: WorldMapComponent
    }
];
