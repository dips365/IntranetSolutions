import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CountryWiseHolidaysWebPartStrings';
import CountryWiseHolidays from './components/CountryWiseHolidays';
import { ICountryWiseHolidaysProps } from './components/ICountryWiseHolidaysProps';

export interface ICountryWiseHolidaysWebPartProps {
  description: string;
  listName:string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}

export default class CountryWiseHolidaysWebPart extends BaseClientSideWebPart<ICountryWiseHolidaysWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICountryWiseHolidaysProps > = React.createElement(
      CountryWiseHolidays,
      {
        description: this.properties.description,
        listName:this.properties.listName,
        spHttpClient:this.context.spHttpClient,
        siteUrl:this.context.pageContext.site.absoluteUrl,
        title:"Country Wise Holidays",
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        }
      }

    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listName',{
                  label:strings.ListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
