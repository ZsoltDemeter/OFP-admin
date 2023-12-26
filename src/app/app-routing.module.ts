import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphsComponent } from './pages/graphs/graphs.component';
import { EnergyProductionPageComponent } from './pages/energy-production-page/energy-production-page.component';
import { EnergyForecastingPageComponent } from './pages/energy-forecasting-page/energy-forecasting-page.component';

const routes: Routes = [

    {path: "", component: GraphsComponent},
    // {path: "energy-production", component: GraphsComponent},
    {path: "energy-report", component: EnergyProductionPageComponent},
    {path: "energy-forecast", component: EnergyForecastingPageComponent},
    
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { useHash: true })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
