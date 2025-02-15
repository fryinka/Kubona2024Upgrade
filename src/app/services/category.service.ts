import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private categoryId: string | null = null;

  setCategoryId(id: string): void {
    this.categoryId = id;
  }

  getCategoryId(): string | null {
    return this.categoryId;
  }
}