import { Component } from '@angular/core';
import { AppAlertService } from './app-alert.service';

export interface RefreshablePage {
  refresh(): void;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public userNotAccepted: boolean = true;
  public alerts: string[] = [];
  private childComponent: RefreshablePage;

  constructor(private alertService: AppAlertService) {
    alertService.networkError.subscribe((err) => this.alerts.push('An unexpected error occurred while attempting to request data.'));
  }

  ngOnInit() { }

  public installApp() {
    let deferredInstall = (window as any).deferredInstall;
    if (deferredInstall) {
      console.debug('Deferred install...');
      deferredInstall.prompt();
    } else {
      console.debug('No deferred install...');
    }
  }

  public get canInstall(): boolean {
    return (window as any).deferredInstall ? true : false;
  }

  public refresh() : void {
    if (this.childComponent) {
      this.alerts = [];
      this.childComponent.refresh();
    }
  }

  public activateChild(element: any) {
    if (element.refresh) {
      this.childComponent = element;
    }
  }

  public deactivateChild() {
    this.childComponent = null;
  }
}
