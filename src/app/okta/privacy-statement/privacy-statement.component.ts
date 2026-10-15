import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
declare const PrivacyStatementClose: any;

@Component({
  selector: 'sym-privacy-statement.component',
  templateUrl: './privacy-statement.component.html',
  styleUrls: ['./privacy-statement.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrivacyStatementComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {
    const currentDate = Date.now();
    window.localStorage.setItem('APP-REFRESHED', currentDate.toString());
    setTimeout(function () {
      PrivacyStatementClose();
    }, 100);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
