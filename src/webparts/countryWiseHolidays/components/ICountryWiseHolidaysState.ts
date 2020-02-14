import { IHolidayListItem } from "../models/IHolidayListItem";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
export interface ICountryWiseHolidaysState{
    status:string;
    items:IDropdownOption[];
    isLoading:boolean;
    loaderMessage:string;
}
