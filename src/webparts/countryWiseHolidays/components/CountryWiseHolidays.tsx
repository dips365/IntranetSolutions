import * as React from 'react';
import styles from './CountryWiseHolidays.module.scss';

import { IStackTokens, Stack  } from "office-ui-fabric-react/lib/Stack";
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { IListItem } from "../models/IListItem";
import { IHolidayListItem } from "../models/IHolidayListItem";
import { List } from "office-ui-fabric-react/lib/List";
import { Environment,EnvironmentType, DisplayMode } from "@microsoft/sp-core-library";
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {}
};
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { ICountryWiseHolidaysProps } from './ICountryWiseHolidaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICountryWiseHolidaysState } from "./ICountryWiseHolidaysState";
import { SPHttpClient,SPHttpClientResponse,ISPHttpClientOptions } from "@microsoft/sp-http";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
const options: IDropdownOption[] = [
  { key: 'India', text: 'India',isSelected:true},
  { key: 'US', text: 'US' },
  { key: 'Geremany', text: 'Geremany' }
];

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
      items:options,
      isLoading:false,
      loaderMessage:"Loading...",
      selectedValue:"India",
      HolidayItems:[]
    };
    this.GetCurrentCountryFromUserProfile();
    this.getHolidaysBasedOnSelectedCountry(this.state.selectedValue.toString());
  }
  public render(): React.ReactElement<ICountryWiseHolidaysProps> {
    return (
      <div className={ styles.countryWiseHolidays }>
          <div className={ styles.row }>
              {/* <Stack tokens={stackTokens}> */}
                <WebPartTitle displayMode={this.props.displayMode}
                title={this.props.title}
                updateProperty={this.props.updateProperty}>
                   </WebPartTitle>
                 <Dropdown placeholder="Select options"
                    label="Select Country"
                    options={this.state.items}
                    styles={dropdownStyles}
                    onChanged={this.onChanged.bind(this)}>
                 </Dropdown>
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
      </div>
    );
  }


  private onChanged(event){
    var newValue = event.key;
    this.getHolidaysBasedOnSelectedCountry(newValue);
  }

  private onChange=(ev:any,selectedOption:IDropdownOption | undefined):void=>{
    const selectedKey: string = selectedOption ? (selectedOption.key as string):"";
    this.setState({
      selectedValue:selectedKey
    });

  //  this.getHolidaysBasedOnSelectedCountry(newva);
  }

  private GetCurrentCountryFromUserProfile():void {
    try {
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/SP.UserProfiles.PeopleManager/GetUserProfileProperty(accountName=@v,propertyName='Country')?@v='i:0%23.f|membership|dipen@techinsider.onmicrosoft.com`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'odata-version': ''
            }
          }).then((response: SPHttpClientResponse): Promise<{ value: any }> => {
            return response.json();
          }) .then((response: { value: any }): void => {
            //resolve(response.value);
            var output: any = JSON.stringify(response);

          }, (error: any): void => {

          });
    } catch (error) {
      console.log(error);
    }
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
