import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-energy-production-page',
  templateUrl: './energy-production-page.component.html',
  styleUrls: ['./energy-production-page.component.css']
})
export class EnergyProductionPageComponent implements AfterViewInit{
  @ViewChild('pieChart') private pieChartRef: ElementRef;
  pieChart: any;
  energyReport: any;

  constructor(public service: SharedService) { }

  ngAfterViewInit(): void {
    const energyReport$ = this.service.getReports();
    energyReport$.subscribe({
      next: (response: any) => {
        this.energyReport = response;
        this.generatePieChart();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  generatePieChart(): void {
    
    const filteredEnergyReportObj = this.energyReport.filter(item => item.Data !== '').slice(-96);
    const data = this.prepareDataForPieChart(filteredEnergyReportObj);
    console.log(filteredEnergyReportObj)

    const colors = [
      'rgba(255, 99, 132, 0.7)', // CarbuneMW
      'rgba(54, 162, 235, 0.7)', // HidrocarburiMW
      'rgba(255, 206, 86, 0.7)', // ApeMW
      'rgba(75, 192, 192, 0.7)', // NuclearMW
      'rgba(153, 102, 255, 0.7)', // EolianMW
      'rgba(255, 159, 64, 0.7)', // FotoMW
      'rgba(75, 75, 75, 0.7)', // BiomasaMW
    ];

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Energy Consumption',
          data: data.values,
          backgroundColor: colors
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: function(chart) {
                const data = chart.data as { labels: string[], datasets: { data: number[] }[] };
                if (data.labels && data.labels.length && data.datasets.length) {
                  return data.labels.map(function(label, index) {
                    const dataset = data.datasets[0];
                    const value = dataset.data[index] || 0;
                    const percentage = Math.round((value / (dataset.data.reduce((acc, cur) => acc + cur, 0) || 1)) * 100);
                    return {
                      text: `${label}: ${value} (${percentage}%)`,
                      fontColor: 'white',
                      fillStyle: colors[index],
                    };
                  });
                }
                return [];
              }
            },
          },

          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label ?? '';
                const value = context.formattedValue ?? 0;
                const dataset = context.dataset;
                const total = dataset.data.reduce((acc, currentValue) => acc + currentValue, 0);
                const currentValue = dataset.data[context.dataIndex];
                const percentage = Math.round((currentValue / (total || 1)) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          }
        }
      }
    });

  }

  prepareDataForPieChart(data): { labels: string[], values: number[] } {
    const labels = ['CarbuneMW', 'HidrocarburiMW', 'ApeMW', 'NuclearMW', 'EolianMW', 'FotoMW', 'BiomasaMW'];
    const values = labels.map(label => {
      let sum = 0;
      data.forEach(item => {
        if (item[label]) {
          sum += parseFloat(item[label]);
        }
      });
      return sum;
    });

    return { labels, values };
  }

}

