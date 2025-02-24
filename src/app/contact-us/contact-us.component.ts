import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  afterNextRender,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms"; // Import ReactiveFormsModule
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from "@angular/common/http";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import * as AOS from "aos";
import "aos/dist/aos.css";
import { NavigationEnd, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FlowbiteService } from "../flowbite.service";

@Component({
    selector: "app-contact-us",
    imports: [FormsModule, CommonModule, HttpClientModule, ReactiveFormsModule], // Include ReactiveFormsModule
    templateUrl: "./contact-us.component.html",
    styleUrls: ["./contact-us.component.css"]
})
export class ContactUsComponent implements OnInit, AfterViewInit {
  dataLoaded = false;
  contactForm: FormGroup;
  newsletterForm: FormGroup;
  contactFormSuccess = "Message Sending";
  responseShow: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private flowbiteService: FlowbiteService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.contactForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      message: ["", Validators.required],
    });

    this.newsletterForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
      });

      const username = this.contactForm.get("username")?.value;
      const email = this.contactForm.get("email")?.value;

      const phone = this.contactForm.get("phone")?.value?.toString() || "";
      const message = this.contactForm.get("message")?.value;
      const formBody = {
        name: username,
        email: email,
        phoneNumber: phone,
        message: message,
      };
      this.http
        .post("https://friday.kubona.ng/api/Contact/Add/", formBody)
        .subscribe(
          (response) => {
            console.log("Form submitted successfully!", response);
            this.contactFormSuccess = "Message has been sent succesffully";
            if (response) {
              this.responseShow = true;
            }
            // Handle success, show a message, etc.
          },
          (error) => {
            console.error("Error submitting form", error);
            this.contactFormSuccess = "Message has been sent succesffully";
            this.responseShow = true;
            // Handle error, show a message, etc.
          }
        );
    } else {
      console.log("Form is not valid");
    }
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
