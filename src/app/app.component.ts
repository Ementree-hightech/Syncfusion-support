import { Component, ViewChild } from '@angular/core';
import {
  EventRenderedArgs,
  ScheduleComponent,
  EventSettingsModel,
  GroupModel,
  NavigatingEventArgs, TimeScaleModel
} from '@syncfusion/ej2-angular-schedule';
import {fifaEventsData, resourceData} from './datasource';
import {of, Subscription} from "rxjs";
import {delay} from "rxjs/operators";

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
  groupByGroups: GroupModel = { resources: ['Resource1'] };
  groupByRoom: GroupModel = { resources: ['Resource2'] };
  public fifaDataSource = [];
  public resourceDataSource = [];
  @ViewChild('scheduleObj', { static: true })
  public scheduleObj: ScheduleComponent;
  public byHourTimeScale: TimeScaleModel = {enable: true, interval: 60, slotCount: 1};
  serverData: any[];
  currentViewIndex: number = 0;

  constructor() {
    this.fillResources();
  }

  flag: boolean = true;
  refreshSchedule() {
    setTimeout(() => {
      this.flag = false;
      this.scheduleObj.changeCurrentView(
        this.currentView as any,
        this.currentViewIndex
      );
      this.flag = true;
    }, 1);
  }

   fillResources() {
    if (this.resourceLoading) this.resourceLoading.unsubscribe();


    if (this.scheduleObj) {
      this.scheduleObj.showSpinner()
    }
    of([fifaEventsData, resourceData])
      // imitation of http request
      .pipe(delay(2000))
      .subscribe(
      (data) => {
        if (this.scheduleObj) {
          this.resourceLoading = null;
          this.fifaDataSource = data[0]
          this.resourceDataSource = data[1]
          this.scheduleObj.resources[0].dataSource = data[0];
          this.scheduleObj.resources[1].dataSource = data[1];
          this.serverData = data;
          this.scheduleObj.eventSettings.dataSource = data;
          this.scheduleObj.hideSpinner()
          this.refreshSchedule();
        } else {
          // Initial loading
          this.eventSettings = {
            dataSource: data,
          };
        }
      },
      () => {
        this.resourceLoading = null;
        this.eventSettings = {
          dataSource: [],
        };
      }
    );
  }

  eventRendered(args: EventRenderedArgs) {
    let color: string = args.data.color;
    if (!args.element || !color) {
      return;
    }
    args.element.style.backgroundColor = color;
  }

  navigating($event: NavigatingEventArgs) {
    if (this.flag) {
      switch ($event.action) {
        case "view":
          this.currentView = $event.currentView;
          this.currentViewIndex = $event.viewIndex;
          this.prepareDataToView()
          break;
        case 'date':
          this.fillResources();
          break;
      }
    }
  }

  prepareDataToView() {
    this.fillResources()
  }

  public getHeaderStyles(data: Record<string, any>): Record<string, any> {
    return { background: data.color, color: '#FFFFFF', fontWeight: 'bolder' };
  }

  public getHeaderDetails(data: { [key: string]: string }): string {
    return data.Subject;
  }

  click() {
    this.fillResources();
  }
}
