import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { AuthService } from 'src/app/auth.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { OfflineService } from 'src/app/offline/offline.service';
import { OktaService } from '../service/okta.service';
import data from '../../../assets/config/url-config.json';

import { CapacitorHttp } from '@capacitor/core';

@Component({
  selector: 'sym-okta-login',
  templateUrl: './okta-login.component.html',
  styleUrls: ['./okta-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OktaLoginComponent implements OnInit {
  isAuthenticated!: boolean;
  showPassword = false;
  proposalVersion: any;
  company: any;
  companySUNPH: any;
  public loginForm: UntypedFormGroup;
  freshInstallRequired: string = '';
  public useCaseList;
  public submitted: boolean;
  public isLoginFailed: boolean;
  public error: any;
  public appVersion: any;
  public dbVersion: any;
  showLoginTemplate: boolean = false;
  showLoader: any;
  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public settingService: SettingService,
    protected offlineService: OfflineService,
    public authService: AuthService,
    protected loginService: OktaService,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected activatedRoute: ActivatedRoute
  ) {
    // super(settingService, authService, loginService, router, formBuilder, activatedRoute)
    // Subscribe to the network status observable from the service
    if (this.settingService.getApplicationMode() === 'offline') {
      this.offlineService.networkStatus$.subscribe((status) => {
        this.settingService.isConnected = status; // Update the local variable when status changes
      });
    }
    this.submitted = false;
    this.isLoginFailed = false;
    let url = data;
    this.companySUNPH = url[1]?.companySUNPH;
  }
  getPropMatrix() {
    this.loginService.getProposalVersion().subscribe((lookupList): any => {
      console.log('Languages: ' + JSON.stringify(lookupList['data'].proposalVersion));
      this.useCaseList = JSON.parse(JSON.stringify(lookupList['data']['proposalVersion']));
      this.proposalVersion = this.useCaseList[0]['cd'];
      localStorage.setItem('proposalVersion', this.proposalVersion);
      if (this.settingService.getApplicationMode() === 'offline') {
        this.appVersion = JSON.parse(JSON.stringify(lookupList['data']['appVersion']));
        this.dbVersion = JSON.parse(JSON.stringify(lookupList['data']['dbVersion']));
        // console.log('appVersion6888888:', this.appVersion);
        console.log('dbVersion:', this.dbVersion);
        localStorage.setItem('appVersion', this.appVersion);
        localStorage.setItem('dbVersion', this.dbVersion);
      }
      this.showLoginTemplate = true;
    });
  }

  public async signIn(): Promise<void> {
    if (this.freshInstallRequired === 'YES') {
      confirm(
        this.settingService.getLabelValue(
          'Fresh installation required. You cannot continue to login until the app is reinstalled.'
        )
      );
      return;
    }
    // console.log('this.settingService.isConnected==222==' + this.settingService.isConnected);
    if (this.settingService.getApplicationMode() === 'offline' && !this.settingService.isConnected) {
      alert(this.settingService.getLabelValue('NEEDNETWORKACCESS'));
    } else {
      sessionStorage.setItem('skipBiometricPrompt', 'true');
      await this.oktaAuth.signInWithRedirect().then((_) => this.router.navigate(['/oktacallback']));
    }
  }

  ngAfterViewInit(): void {
    console.log(this.settingService.getApplicationMode());

    if (this.settingService.getApplicationMode() === 'offline') {
      this.checkAndCloseApplication();
    }
  }

  checkAndCloseApplication() {
    this.loginService.getResponseAndAppClose().subscribe((res): any => {
      console.log('inside check and close application*****', +res);
      this.freshInstallRequired = (res as any).fresh_install_required;
      console.log('freshInstallRequired*****', +this.freshInstallRequired);
      if (this.freshInstallRequired === 'YES') {
        confirm(
          this.settingService.getLabelValue(
            'Fresh installation required. You cannot continue to login until the app is reinstalled.'
          )
        );
      }
    });
  }
  private loadCompanyConfig(): void {
    const config: any = data;
    if (Array.isArray(config)) {
      this.companySUNPH = config[1]?.companySUNPH;
    } else if (Array.isArray(config?.default)) {
      this.companySUNPH = config.default[1]?.companySUNPH;
    }
  }

  async ngOnInit() {
    this.loadCompanyConfig();
    this.proposalVersion = localStorage.getItem('proposalVersion');
    this.dbVersion = localStorage.getItem('dbVersion');
    this.appVersion = localStorage.getItem('appVersion');
    this.showLoginTemplate = true;
    // console.log('Loaded from localStorage:', this.appVersion, this.dbVersion);
    this.getPropMatrix();
    // console.log('inside ngOnInit oktalogoncomp====');
    // alert("inside ngOnInit oktalogoncomp====" );
    // console.log('this.settingService.isConnected==111==' + this.settingService.isConnected);

    // this.signIn();
    var errorMsg = window.localStorage.getItem('ERRORMESSAGE');
    if (errorMsg != null || errorMsg != undefined) this.error = errorMsg;
    console.log('errorMsg', errorMsg);
    if (this.error != undefined && this.error != null && this.error != '') {
      window.localStorage.clear();
      return;
    }

    const skipBiometric = sessionStorage.getItem('skipBiometricPrompt') === 'true';
    sessionStorage.removeItem('skipBiometricPrompt');

    sessionStorage.clear();

    let bioMetricResult: {
      success: boolean;
      cancelled: boolean;
    } = {
      success: false,
      cancelled: false,
    };

    if (!skipBiometric) {
      setTimeout(async () => {
        try {
          if (this.settingService.getApplicationMode() == 'offline' && this.settingService.urlList != undefined) {
            this.settingService.message = undefined;
            this.loginService.isBiometricsDone = false;
            const userCredentials = this.settingService.getURLValue('USERCREDENTIALS');
            // alert('userCredentials-------'+ JSON.stringify(userCredentials));

            if (userCredentials != undefined && this.settingService.urlList != undefined) {
              if (
                userCredentials['enableFingerprintAuth'] != undefined &&
                userCredentials['enableFingerprintAuth'] == 'YES'
              ) {
                this.isAuthenticated = await this.oktaAuth.isAuthenticated();
                if (this.isAuthenticated) {
                  this.router.navigate(['/oktacallback']);
                } else {
                  bioMetricResult = await this.offlineService.performBiometricVerification();

                  if (bioMetricResult.success) {
                    this.loginService.isBiometricsDone = true;
                    const agentId = userCredentials['agentId'];
                    const accessToken = userCredentials['accessToken'];
                    const refreshToken = userCredentials['refreshToken'];
                    const clientId = this.oktaAuth.options.clientId;
                    const redirectUri = this.oktaAuth.options.redirectUri;
                    const issuer = this.oktaAuth.options.issuer;

                    const introspectEndpoint = issuer + '/v1/introspect';

                    /*
                     * ============================================================
                     * STEP 1: INTROSPECT THE STORED REFRESH TOKEN
                     * ============================================================
                     * IMPORTANT:
                     * We are NOT using window.fetch() here.
                     * CapacitorHttp uses the native iOS HTTP stack, so this request
                     * does not depend on the WebView origin:
                     */

                    let refreshTokenActive = false;

                    const introspectBody = new URLSearchParams({
                      token: refreshToken,
                      client_id: clientId,
                      token_type_hint: 'refresh_token',
                    }).toString();

                    const introspectResponse = await CapacitorHttp.request({
                      url: introspectEndpoint,
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },

                      // Native iOS request body
                      data: introspectBody,
                      responseType: 'json',
                      connectTimeout: 30000,
                      readTimeout: 30000,
                    });

                    /** HTTP error */
                    // if ( introspectResponse.status < 200 || introspectResponse.status >= 300 ) {
                    //   alert( 'Okta refresh-token introspection failed. Please login again.' );
                    // }

                    /*
                     * Parse response.
                     */
                    const introspectResult =
                      typeof introspectResponse.data === 'string'
                        ? JSON.parse(introspectResponse.data)
                        : introspectResponse.data;

                    /*
                     * Check refresh-token active status.
                     */
                    refreshTokenActive = introspectResult?.active === true;

                    if (!refreshTokenActive) {
                      // alert( 'Your Okta refresh token has expired, been revoked, or is no longer valid. Please login again.');
                      this.settingService.message = 'Refresh Token Expire';
                      confirm(this.settingService.getLabelValue('BiometricRefreshTokenExpire'));
                    } else {
                      /*
                       * Refresh token is valid.
                       * Continue to /v1/token.
                       */

                      // Fingerprint login:
                      // Refresh the stored refresh token and save the returned tokens in the same OktaAuth tokenManager used by the application.
                      const tokenEndpoint = issuer + '/v1/token';

                      const tokenResponse = await fetch(tokenEndpoint, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                          grant_type: 'refresh_token',
                          refresh_token: refreshToken,
                          client_id: clientId,
                          scope: 'openid offline_access',
                        }),
                      });

                      if (!tokenResponse.ok) {
                        const errorText = await tokenResponse.text();
                        console.log('Okta refresh token failed');
                        // alert('Okta refresh token failed');
                      } else {
                        const newtokens = await tokenResponse.json();
                        const newaccessToken = newtokens.access_token;
                        const newRefreshToken = newtokens.refresh_token || refreshToken;
                        const newIdToken = newtokens.id_token;

                        if (!newaccessToken) {
                          console.log('Okta did not return an access_token');
                          // alert('Okta did not return an access_token');
                        } else {
                          // isAuthenticated() checks the OktaAuth tokenManager. Store the refreshed tokens before calling isAuthenticated().
                          const now = Math.floor(Date.now() / 1000);
                          const tokenIssuer = issuer;
                          const authorizeUrl = tokenIssuer + '/v1/authorize';
                          const tokenUrl = tokenIssuer + '/v1/token';
                          const userinfoUrl = tokenIssuer + '/v1/userinfo';

                          // Decode access-token claims for the Okta AccessToken type.
                          let accessTokenClaims: any = {};
                          try {
                            const accessTokenParts = newaccessToken.split('.');

                            if (accessTokenParts.length === 3) {
                              accessTokenClaims = JSON.parse(
                                atob(accessTokenParts[1].replace(/-/g, '+').replace(/_/g, '/'))
                              );
                            }
                          } catch (e) {
                            console.log('Unable to decode access token claims');
                            // alert('Unable to decode access token claims');
                          }

                          // Decode ID-token claims as well. The installed OktaAuth version expects idToken.claims to be a UserClaims object.Using the decoded JWT object (typed as any) keeps the SDK's required UserClaims fields while preserving the actual claims returned by Okta.

                          let idTokenClaims: any = {};

                          if (newIdToken) {
                            try {
                              const idTokenParts = newIdToken.split('.');

                              if (idTokenParts.length === 3) {
                                idTokenClaims = JSON.parse(
                                  atob(idTokenParts[1].replace(/-/g, '+').replace(/_/g, '/'))
                                );
                              }
                            } catch (e) {
                              console.log('Unable to decode ID token claims');
                              // alert('Unable to decode ID token claims');
                            }
                          }

                          // Store the refreshed tokens in OktaAuth tokenManager. This is required before calling isAuthenticated().
                          await this.oktaAuth.tokenManager.setTokens({
                            accessToken: {
                              accessToken: newaccessToken,
                              tokenType: newtokens.token_type || 'Bearer',
                              expiresAt: now + (newtokens.expires_in || 300),
                              scopes: newtokens.scope ? newtokens.scope.split(' ') : ['openid', 'offline_access'],
                              claims: accessTokenClaims,
                              authorizeUrl: authorizeUrl,
                              userinfoUrl: userinfoUrl,
                            },

                            refreshToken: {
                              refreshToken: newRefreshToken,
                              expiresAt: now + (newtokens.refresh_token_expires_in || 86400),
                              scopes: newtokens.scope ? newtokens.scope.split(' ') : ['openid', 'offline_access'],
                              tokenUrl: tokenUrl,
                              authorizeUrl: authorizeUrl,
                              issuer: tokenIssuer,
                            },

                            ...(newIdToken
                              ? {
                                  idToken: {
                                    idToken: newIdToken,
                                    expiresAt: now + (newtokens.expires_in || 300),
                                    claims: idTokenClaims,
                                    issuer: tokenIssuer,
                                    clientId: clientId,
                                    authorizeUrl: authorizeUrl,
                                    scopes: newtokens.scope
                                      ? newtokens.scope.split(' ')
                                      : ['openid', 'profile', 'email'],
                                  },
                                }
                              : {}),
                          });
                        }
                      }

                      const isAuthenticated = await this.oktaAuth.isAuthenticated();

                      if (isAuthenticated) {
                        // Callback will use the tokens already stored in OktaAuth.
                        // It will NOT start the username/password redirect.
                        await this.router.navigate(['/oktacallback'], {
                          queryParams: {
                            fingerprint: 'true',
                            agentId: agentId,
                          },
                        });
                      } else {
                        this.settingService.message = 'Refresh Token Expire';
                        confirm(this.settingService.getLabelValue('BiometricRefreshTokenExpire'));
                        // alert('Okta token was refreshed successfully, but isAuthenticated() returned false.');
                      }
                    }
                  } else if (bioMetricResult.cancelled) {
                    this.settingService.message = 'Biometric authentication cancelled.';
                    // alert( 'Biometric authentication was cancelled. Please use your user id and password to continue.' );
                    confirm(this.settingService.getLabelValue('BiometricCancelled'));
                  } else {
                    this.settingService.message = 'Biometric failed.';
                    // alert( 'Biometric authentication was unsuccessful after 3 attempts. Please log in using your User ID and password.' );
                    confirm(this.settingService.getLabelValue('BiometricThreeAttemptsCancelled'));
                  }
                }
              }
            }
          }
        } catch (e) {
          // alert("userData:--355----catch-"+ e);
          console.log('userData:------catch-' + e);
        }
      }, 1500);
    }

    if (!bioMetricResult.success) {
      this.isAuthenticated = await this.oktaAuth.isAuthenticated();
      console.log('this.isAuthenticated ====' + this.isAuthenticated);
      // alert("this.isAuthenticated ===="+this.isAuthenticated );

      if (
        this.isAuthenticated &&
        !this.settingService.isConnected &&
        this.settingService.getApplicationMode() === 'offline'
      ) {
        console.log('inside isAuthenticated no network====');

        this.isAuthenticated = false;
      }
      if (this.isAuthenticated) {
        console.log('inside isAuthenticated if====');

        this.router.navigate(['/oktacallback']);
      } else {
        this.offlineService.hideSplashScreen();
      }
    }

    this.loginForm = this.formBuilder.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
      language: ['', Validators.required],
      useCase: [null],
      // password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
  public onCopy(event: Event): boolean {
    return false;
  }

  /**
   * This method allow paste username/password.
   * @returns false value by default.
   */
  public onPaste(event: Event): boolean {
    return false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  public omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  // convenience getter for easy access to form fields in HTML file
  get form() {
    return this.loginForm.controls;
  }
}
