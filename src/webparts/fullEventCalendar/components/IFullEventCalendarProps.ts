import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";
export interface IFullEventCalendarProps {
  description: string;
  spHttpClient:SPHttpClient;
  siteURL:string;
  listName:string;
}
