import { SPHttpClient } from "@microsoft/sp-http";
import { DisplayMode } from "@microsoft/sp-core-library";


export interface ICountryWiseHolidaysProps {
  description: string;
  listName:string;
  spHttpClient:SPHttpClient;
  siteUrl:string;
  title:string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
