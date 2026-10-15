import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-user-profile-component',
  templateUrl: './user-profile-component.component.html',
  styleUrls: ['./user-profile-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class UserProfileComponentComponent implements OnInit {
  public userKeys = [];
  public userData;
  constructor() {}

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('userLoginData'));
    Object.keys(this.userData).forEach((key) => {
      this.userKeys.push(key);
    });
  }
}
