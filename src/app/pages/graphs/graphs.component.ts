import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})

export class GraphsComponent implements AfterViewInit {
  @ViewChild('chart1') private chartRef1: ElementRef;
  @ViewChild('chart2') private chartRef2: ElementRef;
  chart1: any;
  chart2: any;
  energyReport: any;

  constructor(public service: SharedService) { }

  ngAfterViewInit(): void {

    const energyReport$ = this.service.getReports();
    energyReport$.subscribe({
      next: (response: any) => {
        this.energyReport = response;
        this.createChart();
      },
      error: (e) => {
        console.log(e);
      }
    });

  }

  createChart(): void {

    const filteredEnergyReportObj = this.energyReport.filter(item => item.Data !== '').slice(-96);
 
    const consumData = filteredEnergyReportObj.map(item => parseInt(item.ConsumMW));
    const productieData = filteredEnergyReportObj.map(item => parseInt(item.ProductieMW));
    const imbalanceData = filteredEnergyReportObj.map((item) => parseInt(item.ProductieMW) - parseInt(item.ConsumMW))
    
    filteredEnergyReportObj.forEach(item => {
      item.Data = item.Data.replace(' ora', '');
    });
    console.log(filteredEnergyReportObj);

    const ctx1 = this.chartRef1.nativeElement.getContext('2d');
    const ctx2 = this.chartRef2.nativeElement.getContext('2d');

    const labels =filteredEnergyReportObj.map(item => item.Data);
    console.log("labels", labels)

    this.chart1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Consumption',
            data: consumData,
            backgroundColor: 'rgba(101, 183, 65, 0.1)',
            borderColor: 'rgba(101, 183, 65, 0.8)',
            borderWidth: 1,
            fill: true
          },
          {
            label: 'Production',
            data: productieData,
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
              parser: 'dd-MM-yyyy HH:mm:ss',
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

    this.chart2 = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: filteredEnergyReportObj.map(item => item.Data),
        datasets: [
          {
            label: 'Imbalance',
            data: imbalanceData,
            backgroundColor: 'rgba(101, 183, 65, 0.1)',
            // backgroundColor: 'rgba(41, 173, 178, 0.1)',
            // backgroundColor: 'rgba(27, 107, 147, 0.2)',
            borderColor: 'rgba(101, 183, 65, 0.8)',
            // borderColor: 'rgba(41, 173, 178, 0.8)',
            // borderColor: 'rgba(27, 107, 147, 0.8)',
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
              parser: 'dd-MM-yyyy HH:mm:ss',
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
            },
          },
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