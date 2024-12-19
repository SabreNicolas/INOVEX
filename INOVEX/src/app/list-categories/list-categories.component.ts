import { Component, OnInit } from "@angular/core";
import { category } from "../../models/categories.model";
import { categoriesService } from "../services/categories.service";

@Component({
  selector: "app-list-categories",
  templateUrl: "./list-categories.component.html",
  styleUrls: ["./list-categories.component.scss"],
})
export class ListCategoriesComponent implements OnInit {
  public listCategories: category[];

  constructor(private categoriesService: categoriesService) {
    this.listCategories = [];
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((response) => {
      // @ts-ignore
      this.listCategories = response.data;
    });
  }
}
