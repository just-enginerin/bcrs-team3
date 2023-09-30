/**
 * Title: service-graph.component.ts
 *  Author: Richard Krasso
 *  Date: 9/25/2023
 *  Edited By: William Egge
 *  Description: service graph component
 */

// Import required Angular modules and custom services
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-service-graph',
  templateUrl: './service-graph.component.html',
  styleUrls: ['./service-graph.component.css'],
})
export class ServiceGraphComponent {
  constructor() {}

  ngOnInit(): void {
    const serviceGraph = new Chart('bcrsServiceGraph', {
      type: 'doughnut',
      data: {
        labels: [
          'Password Reset',
          'Spyware Removal',
          'RAM Upgrade',
          'Software Installation',
          'PC Tune-up',
          'Keyboard Cleaning',
          'Disk Clean-up'
        ],
        datasets: [
          {
            data: [8, 15, 12, 8, 10, 5, 5],
            backgroundColor: [
              'rgba(250, 250, 0, 0.5)',
              'rgba(250, 160, 0, 0.5)',
              'rgba(250, 0, 0, 0.5)',
              'rgba(130, 0, 130, 0.5)',
              'rgba(0, 0, 250, 0.5)',
              'rgba(0, 250, 0, 0.5)',
              'rgba(0, 0, 0, 0.5)',
            ],
            hoverBackgroundColor: [
              'yellow',
              'orange',
              'red',
              'purple',
              'blue',
              'lime',
              'black'
            ],
          },
        ],
      },
    });
  }
}
