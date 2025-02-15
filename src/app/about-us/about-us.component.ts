import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  afterNextRender,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms"; // Import ReactiveFormsModule
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
declare var $: any;
import * as AOS from "aos";
import "aos/dist/aos.css";
import { NavigationEnd, Router } from "@angular/router";
import { platformBrowser } from "@angular/platform-browser";
import { FlowbiteService } from "../flowbite.service";

@Component({
  selector: "app-about-us",
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, ReactiveFormsModule], // Include ReactiveFormsModule
  templateUrl: "./about-us.component.html",
  styleUrl: "./about-us.component.css",
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  dataLoaded = false;
  newsletterForm: FormGroup;
  newsletterSuccess: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private flowbiteService: FlowbiteService
  ) {
    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      // Your custom code here
      console.log("Flowbite loaded", flowbite);
    });
    setTimeout(() => {
      this.dataLoaded = true;
      AOS.refresh(); // Refresh AOS after data is loaded
    }, 1000); // Adjust timeout as necessary
  }

  onSubscribe() {
    if (this.newsletterForm.valid) {
      const email = this.newsletterForm.get("email")?.value;
      const formBody = { email: email };

      this.http
        .post("https://friday.kubona.ng/api/Contact/Subscribe/", formBody)
        .subscribe(
          (response) => {
            console.log(JSON.stringify(response));
            this.newsletterSuccess = true;
          },
          (error) => {
            console.error("Error submitting form", error);
            this.newsletterSuccess = false;
          }
        );
    } else {
      console.log("Form is not valid");
    }
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1200, // Adjust animation duration if needed
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        AOS.refresh();
      }
    });
  }
}
