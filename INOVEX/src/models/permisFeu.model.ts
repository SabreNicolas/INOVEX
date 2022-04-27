export interface permisFeu{
    Id : number;
    dateHeureDeb : string;
    dateHeureFin : string;
    badgeId : number;
    zone : string;
    //si 0 alors zone de consignation
    isPermisFeu : boolean;
}