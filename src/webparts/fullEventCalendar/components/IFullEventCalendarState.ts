
import { EventInput } from '@fullcalendar/core';

export interface IFullEventCalendarState{
  events:EventInput[];
  height:number;
  currentActiveStartDate:Date;
  currentActiveEndDate:Date;
  isEventDetailsOpen:boolean;
  currentSelectedEvent:EventInput;
  
}
