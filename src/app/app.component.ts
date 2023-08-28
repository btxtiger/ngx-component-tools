import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlFilterHandler } from '../../projects/ngx-lib/src/lib/abstract/url-filter-handler';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent extends UrlFilterHandler implements OnInit, OnDestroy {
   public filterName?: string;
   public filterValue?: string;

   constructor(
      private router: Router,
      private route: ActivatedRoute,
   ) {
      super();

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
         this.toggleDarkMode();
      }
   }

   ngOnInit(): void {
      this._initQueryParamHandler({
         ngRouter: this.router,
         ngActivatedRoute: this.route,
         isLoggingEnabled: false,
      });
      this._initUrlFilterHandler({
         urlFilterRoutingStrategy: 'stack'
      });
   }

   ngOnDestroy(): void {
      this._destroyQueryParamHandler();
      this._destroyUrlFilterHandler();
   }

   /** Add Filter */
   public addFilter(): void {
      if (this.filterName && this.filterValue) {
         this._upsertFilter(this.filterName, this.filterValue);
         this.filterName = this.filterValue = undefined;
      }
   }

   /** Add Query Param */
   public addQueryParam(): void {
      if (this.filterName && this.filterValue) {
         this._upsertQueryParam(this.filterName, this.filterValue);
         this.filterName = this.filterValue = undefined;
      }
   }

   /** Toggle Dark Mode */
   public toggleDarkMode(): void {
      document.body.classList.toggle('dark');
   }
}
