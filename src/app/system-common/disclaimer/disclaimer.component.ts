import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { SettingService } from '../services/setting.service';
import { BaseService } from '../services/base.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'sym-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DisclaimerComponent extends BaseComponent<BaseService> implements AfterViewInit {
  @Input() displayPopupOnly: boolean;
  @Output() acceptDisclaimerCLicked = new EventEmitter<void>();
  @Output() disagreeDisclaimerCLicked = new EventEmitter<void>();
  disclaimerVisible: boolean = true;

  constructor(
    public settingService: SettingService,
    public authService: AuthService,
    public service: BaseService,
    public router: Router,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    super(null);
    this.displayPopupOnly = false;
  }

  ngOnInit(): void {
    // if (this.settingService.getApplicationMode() === 'online') {
    const userdata = this.service.getUserLoginData();
    setTimeout(() => {
      let agentID = userdata?.['UserId'];
      this.service.getDisclaimerShow(agentID).subscribe((body) => {
        let response: any;
        response = JSON.parse(JSON.stringify(body));
        //Save MDRT flag to sessionStorage
        if (response.data.mdrtFlag == true) {
          sessionStorage.setItem('MDRT_USER', 'true');
        } else {
          sessionStorage.setItem('MDRT_USER', 'false');
        }
        if (this.settingService.getApplicationMode() === 'online') {
          if (response.data.disclaimerShowFlag == true) {
            this.disclaimerVisible = true;
            this.openPopup('disclaimerPopup');
          } else {
            this.disclaimerVisible = false;
            this.authService.setDisclaimerInSession();
            this.acceptDisclaimerCLicked.emit();
          }
        }
      });
    }, 100);
    // }
  }
  ngAfterViewInit(): void {
    // console.log('this.settingService.getApplicationMode()......', this.settingService.getApplicationMode());
    const userdata = this.service.getUserLoginData();
    const currentUser = userdata?.['UserName'];
    const alreadyAcceptedUser = localStorage.getItem('disclaimerAcceptedUser');
    const isOfflineMode = this.settingService.getApplicationMode() === 'offline';

    // If in OFFLINE mode AND same user already accepted disclaimer
    if (isOfflineMode && currentUser && currentUser === alreadyAcceptedUser) {
      this.disclaimerVisible = false; // Hide popup

      // Manually trigger what accept button does
      this.authService.setDisclaimerInSession();
      this.acceptDisclaimerCLicked.emit();

      console.log('Auto-accepted disclaimer for same user in OFFLINE mode:', currentUser);
    }
    // else {
    //   this.disclaimerVisible = true; // Show popup
    // }
    this.setFocus('disagreeClick');
    setTimeout(() => {
      // wait for DOM to fully update
      const links = this.elRef.nativeElement.querySelectorAll('a[href]');
      links.forEach((link: HTMLAnchorElement) => {
        const path = link.getAttribute('href');
        if (path?.startsWith('/')) {
          this.renderer.listen(link, 'click', (event: Event) => {
            event.preventDefault();
            this.router.navigateByUrl(path);
          });
        }
      });
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['displayPopupOnly'] && changes['displayPopupOnly'].currentValue) {
      this.openPopup('disclaimerPopup');
    }
  }

  // acceptDisclaimer($event: any) {
  //   this.authService.setDisclaimerInSession();
  //   this.acceptDisclaimerCLicked.emit();
  // }
  acceptDisclaimer($event: any) {
    // this.authService.setDisclaimerInSession();
    this.acceptDisclaimerCLicked.emit();
    const userdata = this.service.getUserLoginData();
    if (userdata?.['UserName']) {
      // Save accepted user to localStorage
      localStorage.setItem('disclaimerAcceptedUser', userdata['UserName']);
    }

    // Continue your logic after accepting
    this.disclaimerVisible = false;
  }

  disagreeDisclaimer($event: any) {
    // this.authService.logoutUser();
    this.disagreeDisclaimerCLicked.emit();
  }
}
