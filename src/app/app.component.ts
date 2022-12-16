import { Component } from '@angular/core';
import {
  EventRenderedArgs,
  EventSettingsModel, GroupModel, NavigatingEventArgs,
  ResourcesModel, TimeScaleModel
} from '@syncfusion/ej2-angular-schedule';
import { fifaEventsData } from './datasource';
import {of, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Test project';
  public resourceLoading: Subscription = null;
  public eventSettings: EventSettingsModel = { dataSource: fifaEventsData };
  public selectedDate: Date = new Date(2018, 5, 15);
  currentView: string = 'Month';
  groupByGroups: GroupModel = {resources: ['Resource1']};
  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 1 };
  resources: ResourcesModel[] = [
    {
      name: 'Resource1',
      field: 'GroupId',
      title: 'Group',
      textField: 'Subject',
      idField: 'Id',
      dataSource: []
    },
  ]

  constructor() {
    this.fillResources();
  }

  fillResources() {
    if (this.resourceLoading)
      this.resourceLoading.unsubscribe();

    of(fifaEventsData)
      .subscribe(data => {
        this.resourceLoading = null;
        this.resources = [{
          name: 'Resource1',
          field: 'GroupId',
          title: 'Group',
          textField: 'Subject',
          idField: 'Id',
          dataSource: data
          }]

        this.eventSettings = {
          dataSource: data
        };
      },() => {
        this.resourceLoading = null;
        this.resources = []
        this.eventSettings = {
          dataSource: []
        };
      })
  }

  eventRendered(args: EventRenderedArgs) {
    let color: string = args.data.color;
    if (!args.element || !color) {
      return;
    }
    args.element.style.backgroundColor = color;
  }

  navigating($event: NavigatingEventArgs) {
    switch ($event.action) {
      case "view":
        this.currentView = $event.currentView;
        break;
      case "date":
        this.fillResources();
        break;
    }
  }

  public getHeaderStyles(data: Record<string, any>): Record<string, any> {
    return {background: data.color, color: '#FFFFFF', fontWeight: 'bolder'};
  }

  public getHeaderDetails(data: { [key: string]: string }): string {
    return data.Subject;
  }

  click() {
    this.fillResources()
  }
}
