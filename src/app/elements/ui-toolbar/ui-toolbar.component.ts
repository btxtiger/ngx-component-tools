import {Component, HostBinding} from '@angular/core';
@Component({
   selector: 'ui-toolbar',
   templateUrl: './ui-toolbar.component.html',
   styleUrls: ['./ui-toolbar.component.scss'],
})
export class UiToolbarComponent {
   @HostBinding()
   public class = 'ui-toolbar';

   constructor() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
         this.toggleDarkMode();
      }
   }

   /** Toggle Dark Mode */
   public toggleDarkMode(): void {
      document.body.classList.toggle('dark');
   }
}
