import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import {
  extend,
  injectNgtLoader,
  NgtArgs,
  NgtBeforeRenderEvent,
  NgtPush,
  NgtStore,
} from 'angular-three';
import { map } from 'rxjs';
import * as THREE from 'three';
import { Mesh } from 'three';
import { OBJLoader, OrbitControls } from 'three-stdlib';

import { gsap } from 'gsap';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
extend(THREE);
extend({ OrbitControls });

@Component({
  standalone: true,
  template: `
    <ngt-spot-light
      [position]="10"
      angle="0.15"
      penumbra="1"
      color="white"
    ></ngt-spot-light>
    <ngt-point-light [position]="[0, 10, -10]"></ngt-point-light>
    <ngt-point-light [position]="[0, 10, 10]"></ngt-point-light>
    <ngt-primitive
      *args="[model$ | ngtPush]"
      [scale]="1"
      (beforeRender)="onBeforeRender($any($event))"
      #primitive
    />
    <ngt-orbit-controls
      *args="[camera, glDom]"
      [enableDamping]="true"
      (beforeRender)="$any($event).object.update()"
    />
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
  private readonly store = inject(NgtStore);
  readonly camera = this.store.get('camera');

  readonly glDom = this.store.get('gl', 'domElement');

  readonly events = this.store.get('events');

  render_count = 0;

  positionAdded = false;

  onBeforeRender(event: NgtBeforeRenderEvent<THREE.Mesh>) {
    const mesh = event.object as THREE.Mesh;
    mesh.rotation.y += 0.01;

    //(event.object.children[0] as THREE.Mesh).material;

    let tl = gsap.timeline();
    tl.to((event.object.children[1] as THREE.Mesh).material, {
      onStart: () => {
        gsap.to((event.object.children[0] as THREE.Mesh).material, {
          opacity: '-=0.1',
        });
      },

      opacity: 1,
      delay: 3,
    })
      .to((event.object.children[2] as THREE.Mesh).material, {
        onStart: () => {
          gsap.to((event.object.children[1] as THREE.Mesh).material, {
            opacity: 0,
            duration: 1,
          });
        },

        opacity: 1,
        delay: 4,
      })
      .to((event.object.children[4] as THREE.Mesh).material, {
        onStart: () => {
          gsap.to((event.object.children[2] as THREE.Mesh).material, {
            opacity: 0,
            duration: 1,
          });
          console.log(event.object)
        },

        opacity: 1,
        delay: 6,
      });

    // onComplete: () => {
    //     event.object.children[0].visible = true;

    //     //console.log(event.object);
    //   },
    // .to((event.object.children[0] as THREE.Mesh).material, {
    //   onStart: () => {
    //     gsap.to((event.object.children[1] as THREE.Mesh).material, {
    //       opacity: '+=0.2',
    //       duration: 2,
    //       delay: 4,
    //     });
    //   },

    //   opacity: '-=0.1',
    //   duration: 1,
    //   delay: 4,
    // })
    // .to((event.object.children[3] as THREE.Mesh).material, {
    //   opacity: 1,
    //   diration: 3,
    //   delay: 6,
    // })
    // .to((event.object.children[4] as THREE.Mesh).material, {
    //   opacity: 1,
    //   diration: 3,
    //   delay: 8,
    // });
  }

  readonly model$ = injectNgtLoader(
    () => GLTFLoader,
    'assets/smooth_sphere_7.glb'
  ).pipe(
    map((model) => {
      // Apply the new material to each sphere
      model.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.includes('001')) {
          // child.scale.x = 0.5;
          // child.scale.y = 0.5;
          // child.scale.z = 0.5;

          child.material.transparent = true;
          child.material.opacity = 1;
        }
        if (child instanceof THREE.Mesh && child.name.includes('002')) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
        if (child instanceof THREE.Mesh && child.name.includes('003')) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
        if (child instanceof THREE.Mesh && child.name.includes('004')) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      });

      return model.scene;
    })
  );
}
