import { SPHttpClient } from "@microsoft/sp-http";
import { DisplayMode } from "@microsoft/sp-core-library";
import { WebPartContext } from "@microsoft/sp-webpart-base";


export interface ICountryWiseHolidaysProps {
  description: string;
  listName:string;
  spHttpClient:SPHttpClient;
  context:WebPartContext;
  siteUrl:string;
  title:string;
  country:string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
