import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import packageJson from '../../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService extends TitleStrategy {

  private readonly baseTitle = packageJson.config.appTitle;

  constructor(private readonly title: Title) {
    super();
  }


  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.title.setTitle(title ? `${title} :: ${this.baseTitle}` : this.baseTitle);
  }
}
