/**
 * Title: service-graph.component.ts
 *  Author: Richard Krasso
 *  Date: 9/25/2023
 *  Edited By: William Egge
 *  Description: service graph component
 */

// Import required Angular modules and custom services
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-service-graph',
  templateUrl: './service-graph.component.html',
  styleUrls: ['./service-graph.component.css'],
})
export class ServiceGraphComponent implements OnInit {
  constructor(private http: HttpClient) {}

  async fetchDataByServiceName(name: string): Promise<number> {
    const url = `/api/invoices/find-purchases-by-service?lineItems.name=${name}`;
    try {
      const response = await this.http.get<any[]>(url).toPromise();

      if (!response) {
        return 0;
      }

      const totalQuantity = response.reduce((acc, cur) => acc + cur.quantity, 0);
      return totalQuantity;
    } catch (error) {
      
      // Log the error
      console.error("API call failed: ", error);
      return 0;  // Return 0 if API call fails
    }
  }


  async ngOnInit(): Promise<void> {
    const labels = [
      'Password Reset',
      'Spyware Removal',
      'RAM Upgrade',
      'Software Installation',
      'PC Tune-up',
      'Keyboard Cleaning',
      'Disk Clean-up',
    ];

    // Fetch summed quantities for each service and store them in a new data array
    const data = await Promise.all(
      labels.map((label) => this.fetchDataByServiceName(label))
    );

    // Create the chart
    const serviceGraph = new Chart('bcrsServiceGraph', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              'hsla(300, 100%, 10%, 0.5)',
              'hsla(275, 100%, 20%, 0.5)',
              'hsla(250, 100%, 30%, 0.5)',
              'hsla(225, 100%, 40%, 0.5)',
              'hsla(200, 100%, 50%, 0.5)',
              'hsla(175, 90%, 60%, 0.5)',
              'hsla(150, 70%, 70%, 0.5)',
            ],
            hoverBackgroundColor: [
              'hsl(300, 100%, 10%)',
              'hsl(275, 100%, 20%)',
              'hsl(250, 100%, 30%)',
              'hsl(225, 100%, 40%)',
              'hsl(200, 100%, 50%)',
              'hsl(175, 90%, 60%)',
              'hsl(150, 70%, 70%)',
            ],
          },
        ],
      },
    });
  }
}
