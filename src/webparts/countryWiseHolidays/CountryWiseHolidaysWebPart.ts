import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { Environment,EnvironmentType } from "@microsoft/sp-core-library";
import { SPHttpClient,SPHttpClientResponse } from "@microsoft/sp-http";
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
        country:this.context.pageContext.cultureInfo.currentCultureName,
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

  private validateListName(value: string): Promise<string> {
    return new Promise<string>((resolve: (validationErrorMessage: string) => void, reject: (error: any) => void): void => {
      if (value === null ||
        value.length === 0) {
        resolve('Provide the list name');
        return;
      }

      this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('${escape(value)}')?$select=Id`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse): void => {
          if (response.ok) {
            resolve('');
            return;
          }
          else if (response.status === 404) {
            resolve(`List '${escape(value)}' doesn't exist in the current site`);
            return;
          }
          else {
            resolve(`Error: ${response.statusText}. Please try again`);
            return;
          }
        })
        .catch((error: any): void => {
          resolve(error);
        });
    });
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
                  label:strings.ListFieldLabel,
                  onGetErrorMessage:this.validateListName.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
