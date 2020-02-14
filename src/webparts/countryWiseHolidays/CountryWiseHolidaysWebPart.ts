import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
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
}

export default class CountryWiseHolidaysWebPart extends BaseClientSideWebPart<ICountryWiseHolidaysWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICountryWiseHolidaysProps > = React.createElement(
      CountryWiseHolidays,
      {
        description: this.properties.description
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
