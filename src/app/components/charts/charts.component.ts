import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as d3 from 'd3';
import { EmployeeService } from 'src/app/services/employee/employee.service';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  private employees: any;
  private svg: any;
  private margin = 25;
  private width = 700 - this.margin * 3;
  private height = 400 - this.margin * 3;

  private x: any;
  private y: any;
  ngOnInit() {
    this.getData();
    this.createSvg();
  }

  constructor(
    public employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  public getData() {
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        this.employees = response
          .filter((item: any) => item.recruitmentDate !== undefined)
          .map((item: any) => {
            return {
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
              recruitmentDate: item.recruitmentDate,
            };
          });

        this.employees.sort(
          (a: any, b: any) =>
            new Date(a.recruitmentDate).getTime() -
            new Date(b.recruitmentDate).getTime()
        );
        this.initAxis(this.employees);
      },
      error: message => {
        this.snackBar.open(message, 'OK', { duration: 5000 });
      },
    });
  }

  private getMinDate() {
    const oldestWorker = this.employees.reduce((prev: any, curr: any) => {
      return Date.parse(prev.recruitmentDate) < Date.parse(curr.recruitmentDate)
        ? prev
        : curr;
    });
    return oldestWorker.recruitmentDate;
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#fig')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .attr('viewBox', [0, 0, this.width, this.height])
      .attr(
        'style',
        'max-width: 100%; height: auto; height: intrinsic; overflow: visible;'
      )
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private initAxis(data: any) {
    this.x = d3
      .scaleTime()
      .range([0, this.width])
      .domain([new Date(this.getMinDate()), new Date()]);

    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.x))
      .append('text')
      .attr('fill', '#1c1c1c')
      .attr('x', this.width / 2)
      .attr('y', this.margin + 10)
      .text('Fecha');

    this.y = d3.scaleLinear().domain([0, data.length]).range([this.height, 0]);
    this.svg
      .append('g')
      .call(d3.axisLeft(this.y))
      .append('text')
      .attr('fill', '#1c1c1c')
      .attr('y', this.margin / 2 - 50)
      .attr('x', -this.height / 2 + 55)
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('transform', 'rotate(-90)')
      .text('Cantidad de empleados');

    this.draw(data);
  }

  private draw(data: any) {
    const dataByDate = d3.group(data, (d: any) =>
      d.recruitmentDate.slice(0, 10)
    );

    const points = Array.from(dataByDate, ([key, value]) => ({
      date: new Date(key),
      count: value.length,
    }));

    const line = d3
      .line()
      .curve(d3.curveLinear)
      .x((d: any) => this.x(new Date(d.date)))
      .y((d: any) => this.y(d.count));

    this.svg
      .append('path')
      .datum(points)
      .attr('fill', 'none')
      .attr('stroke', '#6ec1da')
      .attr('stroke-width', 1.5)
      .attr('r', 5)
      .transition()
      .duration(1000)
      .transition()
      .attr('r', 10)
      .attr('d', line);
  }
}
