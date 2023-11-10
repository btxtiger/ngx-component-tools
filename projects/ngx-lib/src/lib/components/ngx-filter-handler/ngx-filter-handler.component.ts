import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { IsolatedComponent } from '../../abstract/isolated-component';
import { UrlFilterHandler, UrlFilterMap } from '../../abstract/url-filter-handler';
import { Mixin } from "ts-mixer";

@Component({
   selector: 'ngx-filter-handler',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './ngx-filter-handler.component.html',
   styleUrls: ['./ngx-filter-handler.component.scss'],
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxFilterHandlerComponent extends Mixin(IsolatedComponent, UrlFilterHandler) implements OnInit {
   @Input({ required: true })
   public urlFilter$?: Subject<UrlFilterMap>;

   public urlFilterMap$ = new ReplaySubject<{ key: string; value: string }[]>(1);

   ngOnInit(): void {
      this.urlFilter$?.subscribe({
         next: (data) => {
            const k = Object.entries(data).map(([key, value]) => ({ key, value }));
            this.urlFilterMap$.next(k);
            this.cdRef.detectChanges();
         },
      });
   }
}
