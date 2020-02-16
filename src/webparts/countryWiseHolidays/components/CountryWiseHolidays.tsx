import * as React from 'react';
import styles from './CountryWiseHolidays.module.scss';

import { IStackTokens, Stack  } from "office-ui-fabric-react/lib/Stack";
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { IHolidayListItem } from "../models/IHolidayListItem";
import { Environment,EnvironmentType, DisplayMode } from "@microsoft/sp-core-library";
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 }
};

import { ICountryWiseHolidaysProps } from './ICountryWiseHolidaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICountryWiseHolidaysState } from "./ICountryWiseHolidaysState";
import { SPHttpClient,SPHttpClientResponse,ISPHttpClientOptions } from "@microsoft/sp-http";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
const options: IDropdownOption[] = [
  { key: 'India', text: 'India'},
  { key: 'US', text: 'US' },
  { key: 'Geremany', text: 'Geremany' }
];

const stackTokens: IStackTokens = { childrenGap: 20 };

export default class CountryWiseHolidays extends React.Component<ICountryWiseHolidaysProps, ICountryWiseHolidaysState> {

  constructor(props:ICountryWiseHolidaysProps,state:ICountryWiseHolidaysState){
    super(props);
    this.state = {
      status:"Please connect to SharePoint Server",
      items:options,
      isLoading:false,
      loaderMessage:"Loading...",
      selectedValue:""
    };
 }

  public render(): React.ReactElement<ICountryWiseHolidaysProps> {
    return (
      <div className={ styles.countryWiseHolidays }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <p className={styles.description}>{escape(this.props.listName)}</p>
              <p>{this.state.status}</p>
              <p>{this.state.selectedValue}</p>
              |<Stack tokens={stackTokens}>

                 <Dropdown placeholder="Select options"
                    label="Multi-select uncontrolled example"
                    options={this.state.items}
                    styles={dropdownStyles}
                    onChange={this.onChange}>
                 </Dropdown>

              </Stack>
             </div>
          </div>
        </div>
      </div>
    );
  }

  private onChange=(ev:any,selectedOption:IDropdownOption | undefined):void=>{
    const selectedKey: string = selectedOption ? (selectedOption.key as string):"";
    this.setState({
      selectedValue:selectedKey
    });

    this.getHolidaysBasedOnSelectedCountry();
  }

  private getHolidaysBasedOnSelectedCountry():void {
    let getHolodayList = this.props.siteUrl + `/_api/web/Lists/
    GetByTitle('${this.props.listName}')/items?$select=Id,Title,HolidayDate&$filter= Country eq '${this.state.selectedValue}'`;

    this.props.spHttpClient.get(
      getHolodayList,
      SPHttpClient.configurations.v1,
      {
        headers:{
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      }).then((response:SPHttpClientResponse):Promise<{value:IHolidayListItem[]}>=>{
        return response.json();
      }).then((response:{value:IHolidayListItem[]}):void=>{
        console.log(response);
      });
  }


  // private GetCountryNames():void {
  //   try {
  //     let getCountriesEndPoint = this.props.siteUrl + `/_api/web/Lists/GetByTitle('${this.props.listName}')/items?$select=Id,Title`;

  //     this.props.spHttpClient.get(
  //       getCountriesEndPoint,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers:{
  //           'Accept': 'application/json;odata=nometadata',
  //           'odata-version': ''
  //         }
  //       })
  //       .then((response:SPHttpClientResponse):Promise<{value:IHolidayListItem[]}>=>{
  //         return response.json();
  //       }).then((response:{value:IHolidayListItem[]}):void=>{

  //         let countries:IDropdownOption[]=[];
  //         // var Options:Array<IDropdownOption> = new Array<IDropdownOption>();
  //         response.value.map((item:IHolidayListItem)=>{
  //           countries.push({key:item.Title,text:item.Title});
  //         });

  //         // const distinct = (value,index,self)=>{
  //         //   return self.indexOf(value)===index;
  //         // };

  //         // const distinctCountirs = countries.filter(distinct);

  //         this.setState({
  //           isLoading:false,
  //           items:countries,
  //           loaderMessage:"",
  //           status :"Completed"
  //         });


  //         //let listItemCollection = [...response.value];

  //       });

  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
