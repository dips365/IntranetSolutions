import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'FullEventCalendarWebPartStrings';
import FullEventCalendar from './components/FullEventCalendar';
import { IFullEventCalendarProps } from './components/IFullEventCalendarProps';
import { PropertyPaneSlider } from "@microsoft/sp-property-pane";
export interface IFullEventCalendarWebPartProps {
  description: string;
  listName:string;
}

export default class FullEventCalendarWebPart extends BaseClientSideWebPart<IFullEventCalendarWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFullEventCalendarProps > = React.createElement(
      FullEventCalendar,
      {
        description: this.properties.description,
        spHttpClient:this.context.spHttpClient
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
                  label:strings.listNameFieldLabel
                }),
                PropertyPaneSlider('Limit',{
                  max:500,
                  min:50
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
