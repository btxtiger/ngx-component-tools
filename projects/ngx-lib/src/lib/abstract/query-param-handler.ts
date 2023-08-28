import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, skip } from 'rxjs';

export type QueryParamMap = { [key: string]: string };
export type QueryParamKeyValuePair = { key: string; value: string | undefined };
export interface QueryParamHandlerConfig {
   ngRouter: Router;
   ngActivatedRoute: ActivatedRoute;
   isLoggingEnabled?: boolean;
}

export abstract class QueryParamHandler {
   protected __ngRouter!: Router;
   protected __ngActivatedRoute!: ActivatedRoute;
   protected _isLoggingEnabled: boolean = false;
   protected _queryParams: QueryParamMap = {};
   protected _queryParamsChanged$ = new Subject<QueryParamMap>();

   private _queryParamHandlerSubscriptions: Subscription[] = [];

   /** Initialize Query Param Handler */
   protected _initQueryParamHandler(config: QueryParamHandlerConfig): void {
      this.__ngRouter = config.ngRouter;
      this.__ngActivatedRoute = config.ngActivatedRoute;
      this._isLoggingEnabled = config.isLoggingEnabled || false;

      // Skip first tick, since the Angular Router initializes with empty query params
      this._initializeQueryParams();
   }

   /** Shutdown Url Filter Handler */
   protected _destroyQueryParamHandler(): void {
      this._queryParamHandlerSubscriptions.forEach((sub) => sub.unsubscribe());
   }

   /** Initialize Query Params */
   private _initializeQueryParams(): void {
      const sub = this.__ngActivatedRoute.queryParams.pipe(skip(1)).subscribe((queryParams) => {
         if (this._isLoggingEnabled) {
            console.log('–– QueryParamHandler: QueryParams changed', queryParams);
         }
         this._queryParams = { ...queryParams };
         this._queryParamsChanged$.next(this._queryParams);
      });

      this._queryParamHandlerSubscriptions.push(sub);
   }

   /** Update Query Params */
   protected async _updateQueryParams(newParams: { [key: string]: string }, replaceUrl: boolean): Promise<void> {
      this._queryParams = newParams;

      await this.__ngRouter.navigate([], {
         relativeTo: this.__ngActivatedRoute,
         queryParams: this._queryParams,
         replaceUrl: replaceUrl,
      });
   }

   /** Upsert Query Param */
   protected _upsertQueryParam(key: string, value: string, replaceUrl: boolean = true): Promise<void> {
      const newParams = { ...this._queryParams };
      newParams[key] = value;
      return this._updateQueryParams(newParams, replaceUrl);
   }

   /** Remove Query Param */
   protected _removeQueryParam(key: string, replaceUrl: boolean = true): Promise<void> {
      const newParams = { ...this._queryParams };
      delete newParams[key];
      return this._updateQueryParams(newParams, replaceUrl);
   }

   /** Get Query Params As Array */
   protected _getQueryParamsAsArray(): QueryParamKeyValuePair[] {
      return Object.entries(this._queryParams).map(([key, value]): QueryParamKeyValuePair => ({ key, value }));
   }
}
