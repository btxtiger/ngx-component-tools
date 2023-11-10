import {ReplaySubject, Subject, Subscription} from 'rxjs';
import { QueryParamHandler, QueryParamHandlerConfig } from './query-param-handler';

export type UrlFilterMap = { [key: string]: string };
export type UrlFilterKeyValuePair = { key: string; value: string | undefined };
export type UrlFilterRoutingStrategy = 'replace' | 'stack';

export interface UrlFilterHandlerConfig extends QueryParamHandlerConfig {
   urlFilterRoutingStrategy?: UrlFilterRoutingStrategy;
   urlFilterStructure?: string | 'filter[{name}]={value}' | 'filter.{name}={value}';
}

export class UrlFilterHandler extends QueryParamHandler {
   private _urlFilterRegex!: RegExp;
   protected _urlFilters: UrlFilterMap = {};
   protected _urlFilters$ = new ReplaySubject<UrlFilterMap>(1);
   protected _urlFilterRoutingStrategy!: UrlFilterRoutingStrategy;
   protected _urlFilterStructure!: string;

   private _urlFilterHandlerSubscriptions: Subscription[] = [];

   /** Initialize Url Filter Handler */
   protected _initUrlFilterHandler(config: UrlFilterHandlerConfig): void {
      this._initQueryParamHandler({
         ngRouter: config.ngRouter,
         ngActivatedRoute: config.ngActivatedRoute,
         isLoggingEnabled: config.isLoggingEnabled,
      });

      this._urlFilterRoutingStrategy = config.urlFilterRoutingStrategy || 'replace';
      this._urlFilterStructure = config.urlFilterStructure || 'filter[{name}]={value}';
      this._updateFilterPatternRegEx();

      // Initially take 2 ticks, since the Angular Router initializes with empty query params
      this._initializeFiltersFromUrl();
   }

   /** Shutdown Url Filter Handler */
   protected _destroyUrlFilterHandler(): void {
      this._destroyQueryParamHandler();
      this._urlFilterHandlerSubscriptions.forEach((sub) => sub.unsubscribe());
   }

   /** Initialize Filters From Url */
   private _initializeFiltersFromUrl(): void {
      const sub = this._queryParamsChanged$.subscribe((queryParams) => {
         this._urlFilters = {};

         if (this._isLoggingEnabled) {
            console.group('–– UrlFilterHandler: Initializing Filters');
         }
         for (const key of Object.keys(queryParams)) {
            const queryStr = key + '=' + queryParams[key];
            const match = queryStr.match(this._urlFilterRegex);

            if (match) {
               const filterKey = match[1];
               this._urlFilters[filterKey] = queryParams[key];
               if (this._isLoggingEnabled) {
                  console.log('✅ Matched filter:', key, queryParams[key]);
               }
            } else {
               if (this._isLoggingEnabled) {
                  console.log('❌ Unmatched query:', queryStr);
               }
            }
         }

         if (this._isLoggingEnabled) {
            console.groupEnd();
            console.log('–– UrlFilterHandler: Initialized Filters', this._urlFilters);
         }

         this._urlFilters$.next(this._urlFilters);
      });

      this._urlFilterHandlerSubscriptions.push(sub);
   }

   /** Update Filter Pattern RegEx */
   protected _updateFilterPatternRegEx(): void {
      const filterPattern = this._urlFilterStructure
         .replace('{name}', '(.*)')
         .replace('{value}', '(.*)')
         .replace('[', '\\[')
         .replace(']', '\\]');
      this._urlFilterRegex = new RegExp(filterPattern);

      if (this._isLoggingEnabled) {
         console.log('–– UrlFilterHandler: Generated regex pattern:', this._urlFilterRegex);
      }
   }

   /** Add Filter */
   protected _upsertFilter(key: string, value: string): void {
      if (this._urlFilters[key] !== value) {
         this._urlFilters[key] = value;
         this._updateFiltersInUrl();
      }
   }

   /** Remove Filter */
   protected _removeFilter(key: string): void {
      if (this._urlFilters.hasOwnProperty(key)) {
         delete this._urlFilters[key];
         this._updateFiltersInUrl();
      }
   }

   /** Update Url */
   private _updateFiltersInUrl(): void {
      const queryParams: { [key: string]: any } = structuredClone(this._queryParams);

      // Update or add filter-related parameters
      for (const key in this._urlFilters) {
         if (this._urlFilters.hasOwnProperty(key) && this._urlFilters[key]) {
            const paramKey = this._urlFilterStructure.replace('{name}', key).replace('={value}', ''); // Remove the value placeholder
            queryParams[paramKey] = this._urlFilters[key];
         }
      }

      // Remove filter-related parameters that are not in _urlFilters
      for (const key in queryParams) {
         const filterStr = key + '=' + queryParams[key];
         const match = filterStr.match(this._urlFilterRegex);

         if (match && !this._urlFilters.hasOwnProperty(match[1])) {
            delete queryParams[key];
         }
      }

      this._updateQueryParams(queryParams, this._urlFilterRoutingStrategy === 'replace');
   }

   /** Get Filters As Array */
   protected _getFiltersAsArray(): UrlFilterKeyValuePair[] {
      return Object.entries(this._urlFilters).map(([key, value]): UrlFilterKeyValuePair => ({ key, value }));
   }
}
