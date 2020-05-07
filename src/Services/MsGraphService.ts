import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient,MSGraphClient,MSGraphClientFactory } from "@microsoft/sp-http";

export class MSGraphService{
    public static async GetMyCountry(context:WebPartContext):Promise<any[]>{
        let countryName :string[] = [];
        try {   

            await context.msGraphClientFactory.getClient().then((client:MSGraphClient):void=>{
                client.api("/me/country").version("v1.0").select("*").get((err,res)=>{
                    if(err){
                        console.log("MsGraphService.GetMyCountry Error: ",err);
                    }
                    if(res){
                        res.value.map((item: any) => {
                            countryName.push(item);
                        });
                    }
                });
            });



            // let client:MSGraphClient = await context.msGraphClientFactory.getClient().then();
            // let response = await client.api('/me/country').version('v1.0').select("*").get();
            // response.value.map((item: any) => {
            //     countryName.push(item);
            //   });
        } catch (error) {   
            console.log("MsGraphService.GetMyCountry Error: ",error);
        }
        console.log("MsGraphService.GetMyUserGroups  CountryName: " ,countryName);
        return countryName;
    }
}