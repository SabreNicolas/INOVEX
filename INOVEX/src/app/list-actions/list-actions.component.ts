import { Component, OnInit } from "@angular/core";
import { cahierQuartService } from "../services/cahierQuart.service";
import { ActivatedRoute } from "@angular/router";
import { addDays, format } from "date-fns";

@Component({
  selector: "app-list-actions",
  templateUrl: "./list-actions.component.html",
  styleUrls: ["./list-actions.component.scss"],
})
export class ListActionsComponent implements OnInit {
  public listAction: any[];
  public listEvenement: any[];
  public listZone: any[];
  public dateDebString: string;
  public dateFinString: string;
  public quart: number;

  constructor(
    public cahierQuartService: cahierQuartService,
    private route: ActivatedRoute,
  ) {
    this.listAction = [];
    this.listZone = [];
    this.listEvenement = [];
    this.dateDebString = "";
    this.dateFinString = "";
    this.quart = 0;

    this.route.queryParams.subscribe((params) => {
      if (params.quart != undefined) {
        this.quart = params.quart;
      } else {
        this.quart = 0;
      }
    });
  }

  ngOnInit(): void {
    this.cahierQuartService.getAllAction().subscribe((response) => {
      // @ts-ignore
      this.listAction = response.data;
    });
  }
}
