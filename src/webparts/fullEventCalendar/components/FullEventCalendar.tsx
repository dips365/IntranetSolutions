import * as React from 'react';
import styles from './FullEventCalendar.module.scss';
import { IFullEventCalendarProps } from './IFullEventCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { createRef } from "office-ui-fabric-react/lib/Utilities";
import { SPHttpClient,HttpClient,SPHttpClientResponse } from "@microsoft/sp-http";
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
    this.state = {
      events: [],
      height: this._calculateHeight(),
      currentActiveStartDate:null,
      currentActiveEndDate: null,
      isEventDetailsOpen: false,
      currentSelectedEvent: null,
    };
  }
  public componentDidMount():void{
    // let startDate = this.calendar.value.getApi().view.activeStart;
    // let endDate = this.calendar.value.getApi().view.activeEnd;

    //this._loadEvents(startDate,endDate);
  }
  private _calculateHeight(): number {
      return 600;
  }

  private _loadEvents(startDate:Date,endDate:Date) {
    try {
      let getEventList = this.props.siteURL + `/_api/web/Lists/GetByTitle('EventsCalendar')/items?$select=*&$filter=EventDate ge datetime'${startDate.toISOString()}' and EndDate le datetime'${endDate.toISOString()}'`;
      this.props.spHttpClient.get(getEventList,
        SPHttpClient.configurations.v1,
        {
          headers:{
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response:SPHttpClientResponse):Promise<{value:any}>=>{
          return response.json();
        })
        .then((response:{value:any}):void=>{
          var events:Array<EventInput> = new Array<EventInput>();
            if(response.value.length!=0){
             response.value.map((item:any)=>{

              //let currentStartDate = moment.tz(item.EventDate.dateTime, item.EventDate.timeZone);
              // let currentEndDate = moment.tz(item.EndDate.dateTime, item.EndDate.timeZone);

              let currentStartDate = moment.tz(item.EventDate,item.EventDate);
              let currentEndDate = moment.tz(item.EndDate, item.EndDate);

              var t = "";
              events.push({
                title:item.Title,
                start: !item.fAllDayEvent ? currentStartDate.clone().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format() : moment(currentStartDate).add(1, 'd').toISOString(),
                end: !item.fAllDayEvent ? currentEndDate.clone().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format() : moment(currentEndDate).add(1, 'd').toISOString(),
                allDay: item.fAllDayEvent,
                location:item.Location.toString(),
                body:item.Description
              });
            });
          }

          this.setState({
            events:events,
            currentActiveStartDate:startDate,
            currentActiveEndDate:endDate,
            currentSelectedEvent:null
          });

        });
    } catch (error) {
      throw error;
    }
  }

  private _datesRender(info: any) {
    if(this.calendar.value) {

      // If the active view has changed
      if((this.state.currentActiveStartDate && this.state.currentActiveEndDate) && this.state.currentActiveStartDate.toString() != info.view.activeStart.toString() && this.state.currentActiveEndDate.toString() != info.view.activeEnd.toString()) {
        this._loadEvents(info.view.activeStart, info.view.activeEnd);
      }
    }
  }

  private _closeEventPanel() {
    this.setState({
      isEventDetailsOpen: false,
      currentSelectedEvent: null
    });
  }

  private _openEventPanel(eventClickInfo: any) {
    this.setState({
      isEventDetailsOpen: true,
      currentSelectedEvent: eventClickInfo.event
    });
  }

  public render(): React.ReactElement<IFullEventCalendarProps> {


    return(
      <div className={styles.fullEventCalendar}>
	  <div className={styles.event}>
	  <div className={styles.titlecontainer}>
		<div className={styles.col}>
		  <h5 className={styles.titlehead}>Title</h5>
		  <p className={styles.maintitle}>Test Event Title</p>
		</div>
	  </div>
	  <div className={styles.colcontainer}>
		<div className={styles.col}>
		  <span>Created By - </span>
		  <div className={styles.chip}>
			<img src="/../sites/Home/PublishingImages/userimage.png" alt="" width="96" height="96" />
			Test User
			  </div>
		</div>
	  </div>
	</div>
	<div className={styles.hoveron}>
	  <div className={styles.colcontainer}>
		<div className={styles.col}>
		  <h5>Start Date</h5>
		  <p className={styles.dates}>22 February 2020</p>
		  <p className={styles.times}>9:00 AM</p>
		</div>
		<div className={styles.col}>
		  <h5>End Date</h5>
		  <p className={styles.dates}>26 February 2020</p>
		  <p className={styles.times}>7:45 PM</p>
		</div>
	  </div>
	  <div className={styles.colcontainer}>
		<div className={styles.col}>
		  <h5>Description</h5>
		  <p className={styles.desc}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
		classical Latin literature from 45 BC, making it over 2000 years old</p>
		</div>
	  </div>
	</div>

	<div className={styles.event}>
	  <div className={styles.titlecontainer}>
		<div className={styles.col}>
		  <h5 className={styles.titlehead}>Title</h5>
		  <p className={styles.maintitle}>Test Event Title</p>
		</div>
	  </div>
	  <div className={styles.colcontainer}>
		<div className={styles.col}>
		  <span>Created By - </span>
		  <div className={styles.chip}>
			<img src="/../sites/Home/PublishingImages/userimage.png" alt="" width="96" height="96" />
			Test User
			  </div>
		</div>
	  </div>
	</div>
	<div className={styles.hoveron}>
	  <div className={styles.colcontainer}>
		<div className={styles.col}>
		  <h5>Start Date</h5>
		  <p className={styles.dates}>22 February 2020</p>
		  <p className={styles.times}>9:00 AM</p>
		</div>
		<div className={styles.col}>
		  <h5>End Date</h5>
		  <p className={styles.dates}>26 February 2020</p>
		  <p className={styles.times}>7:45 PM</p>
		</div>
	  </div>
	  <div className={styles.colcontainer}>
		<div className={styles.col}>
		  <h5>Description</h5>
		  <p className={styles.desc}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
		classical Latin literature from 45 BC, making it over 2000 years old</p>
		</div>
	  </div>
	</div>
  </div>
      // <div className={ styles.fullEventCalendar }>
      //   <FullCalendar
      //     ref={this.calendar}
      //     defaultView="dayGridMonth"
      //     plugins={[ dayGridPlugin ]}
      //     datesRender={this._datesRender.bind(this)}
      //     eventClick={this._openEventPanel.bind(this)}
      //     height={this.state.height}
      //     events={this.state.events} />
      //   {this.state.currentSelectedEvent &&
      //     <Panel
      //       isOpen={this.state.isEventDetailsOpen}
      //       type={ PanelType.smallFixedFar }
      //       headerText={this.state.currentSelectedEvent ? this.state.currentSelectedEvent.title : ""}
      //       onDismiss={this._closeEventPanel.bind(this)}
      //       isLightDismiss={true}
      //       closeButtonAriaLabel='Close'>
      //       <h3>Start Time</h3>
      //       <span>{moment(this.state.currentSelectedEvent.start).format('MMMM Do YYYY [at] h:mm:ss a')}</span>
      //       <h3>End Time</h3>
      //       <span>{moment(this.state.currentSelectedEvent.end).format('MMMM Do YYYY [at] h:mm:ss a')}</span>
      //       {this.state.currentSelectedEvent.extendedProps["location"] &&
      //         <div>
      //           <h3>Location</h3>
      //           <span>{this.state.currentSelectedEvent.extendedProps["location"]}</span>
      //         </div>
      //       }
      //       {this.state.currentSelectedEvent.extendedProps["body"] &&
      //         <div>
      //           <h3>Body</h3>
      //           <span>{this.state.currentSelectedEvent.extendedProps["body"]}</span>
      //         </div>
      //       }
      //     </Panel>
      //   }
      // </div>
    );
  }
}
