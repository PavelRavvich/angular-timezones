import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter, Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private readonly router: Router,
  ) {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(this.update.bind(this));
    this.update();
    this.loadScreen();
  }

  private routerSubscription: Subscription;

  @ViewChild('outletRef') public outletRef!: ElementRef;

  private update(): void {
    this.resetScroll();
  }

  private resetScroll(): void {
    if (this.outletRef) {
      this.outletRef.nativeElement.scrollTop = 0;
    }
  }

  private loadScreen(): void {
    const LOAD_SCREEN_ID = '#load-screen';
    const FADE_ATTR = 'fade';
    const FADE_DELAY = 600;
    const loadScreen = document.body.querySelector(LOAD_SCREEN_ID);
    if (loadScreen) {
      loadScreen.setAttribute(FADE_ATTR, '');
      setTimeout(() => { loadScreen.remove(); }, FADE_DELAY);
    }
  }

  public ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
