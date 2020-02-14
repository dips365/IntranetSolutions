import { IHolidayListItem } from "../models/IHolidayListItem";  

export interface ICountryWiseHolidaysState{
    status:string;
    items:IHolidayListItem[];
    isLoading:boolean;
    loaderMessage:string;
}