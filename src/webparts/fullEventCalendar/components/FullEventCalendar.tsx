import * as React from 'react';
import styles from './FullEventCalendar.module.scss';
import { IFullEventCalendarProps } from './IFullEventCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { HttpClient,HttpClientResponse } from "@microsoft/sp-http";
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as moment from 'moment-timezone';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { IFullEventCalendarState } from "./IFullEventCalendarState";


export default class FullEventCalendar extends React.Component<IFullEventCalendarProps, IFullEventCalendarState> {

  private calendar = createRef<FullCalendar>();

  constructor(props:IFullEventCalendarProps){
    super(props);
  }


  public componentDidMount():void{
    let startDate = this.calendar.value.getApi().view.activeStart;
    let endDate = this.calendar.value.getApi().view.activeEnd;
  }

  private _loadEvents(startDate:Date,endDate:Date) {
    try {

    } catch (error) {
      throw error;
    }
  }

  public render(): React.ReactElement<IFullEventCalendarProps> {
    return (
      <div className={ styles.fullEventCalendar }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
