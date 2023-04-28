import { Component } from '@angular/core';

@Component({
  selector: 'app-vv-one-step-down',
  templateUrl: './vv-one-step-down.component.html',
  styleUrls: ['./vv-one-step-down.component.scss'],
})
export class VVOneStepDownComponent {}

import { Scene } from './VV-OSD-2';
import { NgtCanvas } from 'angular-three';

@Component({
  selector: 'vv-one-step-down',
  standalone: true,
  templateUrl: './VV-one-step-down.component.html',
  // template: `
  // `,
  imports: [NgtCanvas],
})
export class AppComponent {
  readonly Scene = Scene;
}
