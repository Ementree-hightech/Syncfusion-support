import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  AgendaService,
  DayService, MonthAgendaService,
  MonthService,
  ScheduleModule, TimelineMonthService, TimelineViewsService,
  WeekService,
  WorkWeekService
} from "@syncfusion/ej2-angular-schedule";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        ScheduleModule
    ],
  providers: [
    DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService,
    TimelineViewsService, TimelineMonthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
