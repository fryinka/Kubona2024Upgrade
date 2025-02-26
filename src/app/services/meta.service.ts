import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateMetaTags());
  }

  private updateMetaTags(): void {
    const route = this.route.root; 
    let title = 'Default Title'; 
    let description = 'Default Description'; 

    this.findMetaData(route);
    
    // Update the meta tags after finding the data
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
  }

  private findMetaData(route: ActivatedRoute): void {
    // Check for title and description in the current route
    const data = route.snapshot.data;
    
    if (data) {
      // Use optional chaining to safely access title and description
      if (data['title']) {
        this.titleService.setTitle(data['title']);
      }
      if (data['description']) {
        this.metaService.updateTag({ name: 'description', content: data['description'] });
      }
    }

    // Recur for each child route
    for (const child of route.children) {
      this.findMetaData(child);
    }
  }
}