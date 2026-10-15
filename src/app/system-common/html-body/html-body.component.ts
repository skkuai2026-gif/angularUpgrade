import { SettingService } from 'src/app/system-common/services/setting.service';
import { Component, OnInit, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
declare const hideLoader: any;

@Component({
  selector: 'sym-html-body',
  templateUrl: './html-body.component.html',
  styleUrls: ['./html-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HtmlBodyComponent implements OnInit {
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  constructor(public authService: AuthService, public settingService: SettingService) {
    if (
      (this.settingService.urlList == undefined || this.settingService.isLabelLoaded == false) &&
      this.settingService.getApplicationMode() === 'online'
    ) {
      this.settingService.load();
    }
  }
  ngOnInit() {
    setTimeout(() => {
      $(document).on('click', '.block .btnToggleBlock', function () {
        $(this).closest('.block').toggleClass('blockCollapse');
      });
      setTimeout(() => {
        hideLoader();
      }, 50);
    }, 15);
  }
  /**
   * HostListener Decorator that declares a DOM event to listen for,
   * and provides a handler method to run when that event occurs.
   * The onresize event occurs when the browser window has been resized
   * @returns numeric value.
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    if (event.target != undefined) {
      this.settingService.setWindowWidth(window);
      this.settingService.setWindowHeight(event.target.innerHeight);
    }
  }
}
