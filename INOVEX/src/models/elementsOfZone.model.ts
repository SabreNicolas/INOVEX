import {element} from "./element.model";

export interface elementsOfZone{
    zoneId : number;
    zone : string;
    commentaire : string;
    badge : string;
    elements : element[];
    four1 : number;
    four2 : number;
    modeOP : Blob[];
}