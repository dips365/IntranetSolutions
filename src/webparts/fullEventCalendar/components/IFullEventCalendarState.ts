
import { EventInput } from '@fullcalendar/core';

export interface IFullEventCalendarState{
  events:EventInput[];
  height:number;
  currentActiveDateState:Date;
  currentActiveEndDate:Date;
  isEventDetailsOpen:boolean;
  currentSelectedEvent:EventInput;

}
