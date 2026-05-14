import '@analogjs/vitest-angular/setup-testbed';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { TestBed } from '@angular/core/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Polyfill para scrollTo (JSDOM no lo tiene)
Object.defineProperty(global.window.HTMLElement.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});
