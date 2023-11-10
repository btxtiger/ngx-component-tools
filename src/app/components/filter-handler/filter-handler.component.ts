import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlFilterHandler } from '../../../../projects/ngx-lib/src/lib/abstract/url-filter-handler';

@Component({
   selector: 'app-filter-handler',
   templateUrl: './filter-handler.component.html',
   styleUrls: ['./filter-handler.component.scss'],
})
export class FilterHandlerComponent extends UrlFilterHandler implements OnInit, OnDestroy {
   public filterName?: string;
   public filterValue?: string;

   constructor(
      private router: Router,
      private route: ActivatedRoute,
   ) {
      super();
   }

   ngOnInit(): void {
      this._initUrlFilterHandler({
         ngRouter: this.router,
         ngActivatedRoute: this.route,
         isLoggingEnabled: true,
         urlFilterRoutingStrategy: 'stack',
      });
   }

   ngOnDestroy(): void {
      this._destroyUrlFilterHandler();
   }

   /** Add Filter */
   public addFilter(): void {
      if (this.filterName && this.filterValue) {
         this._upsertFilter(this.filterName, this.filterValue);
         this.filterName = this.filterValue = undefined;

         // @ts-ignore
         document.activeElement.blur();
      }
   }

   /** Add Query Param */
   public addQueryParam(): void {
      if (this.filterName && this.filterValue) {
         this._upsertQueryParam(this.filterName, this.filterValue);
         this.filterName = this.filterValue = undefined;

         // @ts-ignore
         document.activeElement.blur();
      }
   }
}
