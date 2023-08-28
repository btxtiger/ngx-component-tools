# ngx-component-tools

A set of tools that supercharges Angular component's functionality.

## QueryParamHandler

Methods that help you to manage query params in your components.

```ts
export class AppComponent extends QueryParamHandler implements OnInit, OnDestroy {
   constructor(private router: Router, private route: ActivatedRoute) {
      super();
   }

   ngOnInit(): void {
      this._initQueryParamHandler({
         ngRouter: this.router,
         ngActivatedRoute: this.route,
         isLoggingEnabled: true,
      });
   }

   ngOnDestroy(): void {
      this._destroyQueryParamHandler();
   }
}
```

### Properties/Methods

```ts
protected _queryParams: QueryParamMap;

protected _queryParamsChanged$: Subject<QueryParamMap>;

_updateQueryParams(newParams: { [key: string]: string }, replaceUrl: boolean): Promise<void>

_upsertQueryParam(key: string, value: string, replaceUrl: boolean = true): Promise<void>

_removeQueryParam(key: string, replaceUrl: boolean = true): Promise<void>

_getQueryParamsAsArray(): QueryParamKeyValuePair[]
```

## UrlFilterHandler

Methods that help you to manage url filters in your components.
The `UrlFilterHandler` uses the `QueryParamHandler` under the hood.

```ts
export class AppComponent extends UrlFilterHandler implements OnInit, OnDestroy {
   constructor(private router: Router, private route: ActivatedRoute) {
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
}
```

### Properties/Methods

```ts
protected _urlFilters: UrlFilterMap;

protected _urlFilterChanged$: Subject<UrlFilterMap>;

protected _upsertFilter(key: string, value: string): void

protected _removeFilter(key: string): void

protected _getFiltersAsArray(): UrlFilterKeyValuePair[]
```
