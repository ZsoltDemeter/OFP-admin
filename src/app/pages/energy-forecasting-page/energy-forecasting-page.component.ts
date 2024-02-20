import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-energy-forecasting-page',
  templateUrl: './energy-forecasting-page.component.html',
  styleUrls: ['./energy-forecasting-page.component.css']
})
export class EnergyForecastingPageComponent implements AfterViewInit{
  @ViewChild('chart3') private chartRef3: ElementRef;
  @ViewChild('chart4') private chartRef4: ElementRef;
  chart3: any;
  chart4: any;
  energyReport: any;
  productionForecast: any;
  consumptionForecast: any;
  selectedDate: any;
  dateOptions: string[] = [];

  constructor(public service: SharedService) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();
    this.selectedDate = `${day}-${month}-${year}`;
    // this.selectedDate = "01-01-2024";
    
    this.populateDateOptions();
   }

  ngAfterViewInit(): void {
    
    console.log(this.selectedDate)
    const productionForecast$ = this.service.getProductionForecast();
    const consumptionForecast$ = this.service.getConsumptionForecast();
    const energyReport$ = this.service.getReports();

    forkJoin({ production: productionForecast$, consumption: consumptionForecast$, report: energyReport$ }).subscribe({
      next: (responses: { production: any, consumption: any, report: any }) => {
        this.energyReport = responses.report;
        this.productionForecast = responses.production;
        this.consumptionForecast = responses.consumption;

        console.log("Prod Forecast",this.productionForecast);
        console.log("Cons Forecast",this.consumptionForecast);

        this.createChart();
      },
      error: (e) => {
        console.log(e);
      }
    });

  }

  customSort = (arr) => {
    const extractDateTime = (str) => {
      const [dateStr, timeStr] = str.split(' ');
      const [day, month, year] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      const timestamp = new Date(year, month - 1, day, hour, minute).getTime();
      return timestamp;
    };
  
    arr.sort((a, b) => {
      const dateA = extractDateTime(a);
      const dateB = extractDateTime(b);
      return dateA - dateB;
    });
  
    return arr;
  };

  sortByTime = (arr) => {
      const convertToDate = dateString => {
        const [dd, mm, yyyy, HH, MM] = dateString.match(/\d+/g).map(Number);
        return new Date(yyyy, mm - 1, dd, HH, MM);
    };

    arr.sort((a, b) => convertToDate(a.Data).getTime() - convertToDate(b.Data).getTime());

    return arr;
  }

  createChart(): void {

    // const filteredEnergyReportObj = this.energyReport.filter(item => item.Data.includes(this.selectedDate));
    const filteredProdForecastObj = this.productionForecast.filter(item => item.Data.includes(this.selectedDate));
    const filteredConsForecastObj = this.consumptionForecast.filter(item => item.Data.includes(this.selectedDate));

    // const prodForecastObjFiltered = this.sortByTime(filteredProdForecastObj)
    // const consForecastObjFiltered = this.sortByTime(filteredConsForecastObj)

    this.sortByTime(filteredProdForecastObj)
    this.sortByTime(filteredConsForecastObj)

    // const productionData = filteredEnergyReportObj.map(item => parseInt(item.ProductieMW));
    // const consumptionData = filteredEnergyReportObj.map(item => parseInt(item.ConsumMW));
    const prodForecastData = filteredProdForecastObj.map((item) => parseInt(item.ProductieMW))
    const consForecastData = filteredConsForecastObj.map((item) => parseInt(item.ConsumMW))
    const imbalanceForecastData = prodForecastData.map((value, index) => value - consForecastData[index])

    console.log("Filtered prod forecast obj \n",filteredProdForecastObj)
    console.log("Filtered cons forecast obj \n",filteredConsForecastObj)
    
    console.log("Imbalance Forecast Data \n",imbalanceForecastData)

    // filteredEnergyReportObj.forEach(item => {
    //   item.Data = item.Data.replace(' ora', '');
    // });

    filteredProdForecastObj.forEach(item => {
      item.Data = item.Data.replace(' ora', '');
    });

    filteredConsForecastObj.forEach(item => {
      item.Data = item.Data.replace(' ora', '');
    });

    const labels = filteredProdForecastObj.map(item => item.Data);
    const labelsSorted = this.customSort(labels);

    const ctx3 = this.chartRef3.nativeElement.getContext('2d');
    const ctx4 = this.chartRef4.nativeElement.getContext('2d');

    this.chart3 = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labelsSorted,
        datasets: [
          {
            label: 'Consumption Forecast',
            data: consForecastData,
            backgroundColor: 'rgba(101, 183, 65, 0.1)',
            borderColor: 'rgba(101, 183, 65, 0.8)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Production Forecast',
            data: prodForecastData,
            backgroundColor: 'rgba(255, 181, 52, 0.1)',
            borderColor: 'rgba(255, 181, 52, 0.8)',
            borderWidth: 1,
            fill: true
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'dd-MM-yyyy HH:mm',
              tooltipFormat: 'dd-MM-yyyy HH:mm',
            },
            title: {
              display: false,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: false,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip:{
            enabled: true
          }
        },
      }
      
    });

    this.chart4 = new Chart(ctx4, {
      type: 'line',
      data: {
        labels: labelsSorted,
        datasets: [
          {
            label: 'Imbalance Forecast',
            data: imbalanceForecastData,
            backgroundColor: 'rgba(101, 183, 65, 0.1)',
            borderColor: 'rgba(101, 183, 65, 0.8)',
            borderWidth: 1,
            fill: true
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'dd-MM-yyyy HH:mm',
              tooltipFormat: 'dd-MM-yyyy HH:mm',
            },
            title: {
              display: false,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: false,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip:{
            enabled: true
          }
        },
      }
    });
  }

  populateDateOptions(): void {
    const startDate = new Date(2024, 0, 1); // January 1, 2024
    const endDate = new Date(2024, 11, 31); // December 31, 2024

    while (startDate <= endDate) {
      const formattedDate = this.formatDate(startDate);
      this.dateOptions.push(formattedDate);
      startDate.setDate(startDate.getDate() + 1); // Move to the next day
    }
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  onDateChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedDate = selectedValue;
    this.updateChart();
  }

  updateChart(): void {
    if (this.chart3) {
      this.chart3.destroy();
    }
    if (this.chart4) {
      this.chart4.destroy();
    }

    // const filteredEnergyReportObj = this.energyReport.filter(item => item.Data.includes(this.selectedDate));
    const filteredProdForecastObj = this.productionForecast.filter(item => item.Data.includes(this.selectedDate));
    const filteredConsForecastObj = this.consumptionForecast.filter(item => item.Data.includes(this.selectedDate));

    this.sortByTime(filteredProdForecastObj)
    this.sortByTime(filteredConsForecastObj)

    // const productionData = filteredEnergyReportObj.map(item => parseInt(item.ProductieMW));
    // const consumptionData = filteredEnergyReportObj.map(item => parseInt(item.ConsumMW));
    const prodForecastData = filteredProdForecastObj.map((item) => parseInt(item.ProductieMW))
    const consForecastData = filteredConsForecastObj.map((item) => parseInt(item.ConsumMW))
    const imbalanceForecastData = prodForecastData.map((value, index) => value - consForecastData[index])

    const ctx3 = this.chartRef3.nativeElement.getContext('2d');
    const ctx4 = this.chartRef4.nativeElement.getContext('2d');

    // filteredEnergyReportObj.forEach(item => {
    //   item.Data = item.Data.replace(' ora', '');
    // });

    filteredProdForecastObj.forEach(item => {
      item.Data = item.Data.replace(' ora', '');
    });

    filteredConsForecastObj.forEach(item => {
      item.Data = item.Data.replace(' ora', '');
    });

    console.log("Filtered prod forecast obj \n",filteredProdForecastObj)
    console.log("Filtered cons forecast obj \n",filteredConsForecastObj)

    console.log("Imbalance Forecast Data \n",imbalanceForecastData)

    const labels = filteredProdForecastObj.map(item => item.Data);
    const labelsSorted = this.customSort(labels);

    this.chart3 = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labelsSorted,
        datasets: [
          {
            label: 'Consumption Forecast',
            data: consForecastData,
            backgroundColor: 'rgba(101, 183, 65, 0.1)',
            borderColor: 'rgba(101, 183, 65, 0.8)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Production Forecast',
            data: prodForecastData,
            backgroundColor: 'rgba(255, 181, 52, 0.1)',
            borderColor: 'rgba(255, 181, 52, 0.8)',
            borderWidth: 1,
            fill: true
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'dd-MM-yyyy HH:mm',
              tooltipFormat: 'dd-MM-yyyy HH:mm',
            },
            title: {
              display: false,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: false,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip:{
            enabled: true
          }
        },
      }
      
    });

    this.chart4 = new Chart(ctx4, {
      type: 'line',
      data: {
        labels: labelsSorted,
        datasets: [
          {
            label: ' Imbalance Forecast',
            data: imbalanceForecastData,
            backgroundColor: 'rgba(101, 183, 65, 0.1)',
            borderColor: 'rgba(101, 183, 65, 0.8)',
            borderWidth: 1,
            fill: true
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'dd-MM-yyyy HH:mm',
              tooltipFormat: 'dd-MM-yyyy HH:mm',
            },
            title: {
              display: false,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: false,
              text: 'Value'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip:{
            enabled: true
          }
        },
      }
    });

  }
}
