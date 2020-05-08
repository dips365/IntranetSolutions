import * as React from 'react';
import styles from './CountryWiseHolidays.module.scss';

import { IStackTokens, Stack  } from "office-ui-fabric-react/lib/Stack";
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IListItem } from "../models/IListItem";
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { MSGraphClient } from "@microsoft/sp-http";
import { ICountryWiseHolidaysProps } from './ICountryWiseHolidaysProps';
import { ICountryWiseHolidaysState } from "./ICountryWiseHolidaysState";
import { SPHttpClient,SPHttpClientResponse,ISPHttpClientOptions } from "@microsoft/sp-http";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const weekdayNames = ["Sunday" , "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const stackTokens: IStackTokens = { childrenGap: 20 };
export default class CountryWiseHolidays extends React.Component<ICountryWiseHolidaysProps, ICountryWiseHolidaysState> {
  constructor(props:ICountryWiseHolidaysProps,state:ICountryWiseHolidaysState){
    super(props);
    this.state = {
      status:"Please connect to SharePoint Server",
      isLoading:true,
      loaderMessage:"Loading...",
      selectedValue:"India",
      HolidayItems:[]
    };
    this._getMyCountry();
  }
  private _getMyCountry = ()=>{
    try {
      this.setState({
        isLoading:true
      });

        this.props.context.msGraphClientFactory.getClient().then((client:MSGraphClient):void=>{
          client.api("/me/country").version("v1.0").get((err,res)=>{
              if(err){
                console.log("CountryWiseHolidays._getMyCountry error : ",err);
              }
              if(res){
                console.log(res);
                this.getHolidaysBasedOnSelectedCountry(res.value);
              }
          });
      });
    } catch (error) {
      console.log("CountryWiseHolidays._getMyCountry error : ",error);
    }
  }
  public render(): React.ReactElement<ICountryWiseHolidaysProps> {
    return (
      <div className={ styles.countryWiseHolidays }>
        { this.state.isLoading && <Spinner label={this.state.loaderMessage} labelPosition="bottom"></Spinner> }
         {this.state.isLoading == false && 
                <div className={ styles.row }>
                <WebPartTitle displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateProperty}>
                   </WebPartTitle>
                 <ul className={styles.eventlist}>
                 
                    {this.state.HolidayItems.map((item,index) => {
                      return (
                        <li>
                            <div className={styles.time}>
                            <span className={styles.day}>{new Date(item.HolidayDate.toString()).getDate()}</span>
                              <span className={styles.month}>{monthShortNames[new Date(item.HolidayDate.toString()).getMonth()]}</span>
                            </div>

                            <div className={styles.info}>
                              <h2 className={styles.title}>{item.Title}</h2>
                              <span className={styles.weekday}>{weekdayNames[new Date(item.HolidayDate.toString()).getDay()]}</span>
                            </div>
                        </li>
                      );
                    })};
                </ul>
              </div>
              }      
          </div>
                  
    );
  }
  private getHolidaysBasedOnSelectedCountry(newValue:string):void {
    let getHolodayList = this.props.siteUrl + `/_api/web/Lists/
    GetByTitle('${this.props.listName}')/items?$select=Title,HolidayDate&$filter= Country eq '${newValue}'`;

    this.props.spHttpClient.get(
      getHolodayList,
      SPHttpClient.configurations.v1,
      {
        headers:{
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      }).then((response:SPHttpClientResponse):Promise<{value:IListItem[]}>=>{
        return response.json();
      }).then((response:{value:IListItem[]}):void=>{
        if(response.value.length !== 0){
          this.setState({
            isLoading:false,
            HolidayItems:response.value
          });
        }
        else{
          this.setState({
            HolidayItems:[]
          });
        }

      });
  }
}
