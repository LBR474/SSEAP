import { Component } from '@angular/core';
import { Scene } from './scene';
import { NgtCanvas } from 'angular-three';



@Component({
  selector: 'my-app',
  standalone: true,
  templateUrl: './app.component.html',
  // template: `
  // `,
  imports: [NgtCanvas],
})
export class AppComponent {
  readonly Scene = Scene;
}
