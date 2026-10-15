import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
declare const TermsAndConditionsClose: any;

@Component({
  selector: 'sym-terms-and-conditions.component',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {
    const currentDate = Date.now();
    window.localStorage.setItem('APP-REFRESHED', currentDate.toString());
    setTimeout(function () {
      TermsAndConditionsClose();
    }, 100);
  }
  backToLogin() {
    this.router.navigate(['/login']);
  }
}
