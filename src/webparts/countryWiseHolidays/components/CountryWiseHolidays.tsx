import * as React from 'react';
import styles from './CountryWiseHolidays.module.scss';

import { IStackTokens, Stack  } from "office-ui-fabric-react/lib/Stack";
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { IHolidayListItem } from "../models/IHolidayListItem";
import { Environment,EnvironmentType } from "@microsoft/sp-core-library";
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 }
};

import { ICountryWiseHolidaysProps } from './ICountryWiseHolidaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICountryWiseHolidaysState } from "./ICountryWiseHolidaysState";
import { SPHttpClient,SPHttpClientResponse,ISPHttpClientOptions } from "@microsoft/sp-http";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
const options: IDropdownOption[] = [
  { key: 'fruitsHeader', text: 'Fruits'},
  { key: 'apple', text: 'Apple' },
  { key: 'banana', text: 'Banana' },
  { key: 'orange', text: 'Orange'},
  { key: 'grape', text: 'Grape' },
  { key: 'vegetablesHeader', text: 'Vegetables'},
  { key: 'broccoli', text: 'Broccoli' },
  { key: 'carrot', text: 'Carrot' },
  { key: 'lettuce', text: 'Lettuce' }
];

const stackTokens: IStackTokens = { childrenGap: 20 };

export default class CountryWiseHolidays extends React.Component<ICountryWiseHolidaysProps, ICountryWiseHolidaysState> {

  constructor(props:ICountryWiseHolidaysProps,state:ICountryWiseHolidaysState){
    super(props);
    this.state={
      status:"Getting Items",
      items:[],
      isLoading:false,
      loaderMessage:"Loading..."
    };

    if(Environment.type === EnvironmentType.SharePoint){
      this.GetCountryNames();
    }
    else{
      this.state = {
        status:"Please connect to SharePoint Server",
        items:options,
        isLoading:false,
        loaderMessage:"Loading..."
      };
    }

  }

  public render(): React.ReactElement<ICountryWiseHolidaysProps> {
    return (
      <div className={ styles.countryWiseHolidays }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <p className={styles.description}>{escape(this.props.listName)}</p>
              <p>{this.state.status}</p>

              <Stack tokens={stackTokens}>

                 <Dropdown placeholder="Select options"
                    label="Multi-select uncontrolled example"
                    options={this.state.items}
                    styles={dropdownStyles}
                    onChange={this.onChangeEvent}>
                 </Dropdown>

              </Stack>
             </div>
          </div>
        </div>
      </div>
    );
  }

  private onChangeEvent():void {
    alert("Sample");
  }

  private GetCountryNames():void {
    try {
      let getCountriesEndPoint = this.props.siteUrl + `/_api/web/Lists/GetByTitle('${this.props.listName}')/items?$select=Id,Title`;

      this.props.spHttpClient.get(
        getCountriesEndPoint,
        SPHttpClient.configurations.v1,
        {
          headers:{
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response:SPHttpClientResponse):Promise<{value:IHolidayListItem[]}>=>{
          return response.json();
        }).then((response:{value:IHolidayListItem[]}):void=>{

          let countries:IDropdownOption[];
          // var Options:Array<IDropdownOption> = new Array<IDropdownOption>();
          response.value.map((item:IHolidayListItem)=>{
            options.push({key:item.Title,text:item.Title});
          });

          this.state = {
            isLoading:false,
            items:options,
            loaderMessage:"",
            status :"Completed"
          };
          //let listItemCollection = [...response.value];

        });

    } catch (error) {
      throw error;
    }
  }
}
