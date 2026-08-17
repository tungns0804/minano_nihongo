import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { LanguageStore } from './core/i18n/language-store';
import { T } from './core/i18n/t';
import { ThemeStore } from './core/services/theme-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, T],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = inject(ThemeStore);
  protected readonly lang = inject(LanguageStore);

  protected readonly t = this.lang.t.bind(this.lang);
}
