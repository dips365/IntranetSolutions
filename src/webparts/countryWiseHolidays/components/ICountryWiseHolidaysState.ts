import { IHolidayListItem } from "../models/IHolidayListItem";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { IListItem } from "../models/IListItem";
export interface ICountryWiseHolidaysState{
    status:string;
    items:IDropdownOption[];
    isLoading:boolean;
    loaderMessage:string;
    selectedValue:string;
    HolidayItems:IListItem[];
}
