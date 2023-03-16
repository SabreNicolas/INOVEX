import {element} from "./element.model";

export interface elementsOfZone{
    zoneId : number;
    zone : string;
    commentaire : string;
    badge : string;
    elements : element[];
    four : number;
    modeOP : string[];
}