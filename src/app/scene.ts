import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  extend,
  injectNgtLoader,
  NgtArgs,
  NgtBeforeRenderEvent,
  NgtPush,
} from 'angular-three';
import { map } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

extend(THREE);

@Component({
  standalone: true,
  template: `
    <ngt-spot-light
      [position]="10"
      angle="0.15"
      penumbra="1"
      color="white"
    ></ngt-spot-light>
    <ngt-point-light [position]="[0, 0, -10]"></ngt-point-light>
    <ngt-point-light [position]="[0, 0, 10]"></ngt-point-light>
    <ngt-primitive
      *args="[model$ | ngtPush]"
      [scale]="1"
      (beforeRender)="onBeforeRender($any($event))"
    />
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
  material1!: THREE.MeshStandardMaterial;
  material2!: THREE.MeshStandardMaterial;
    render_count = 0
  onBeforeRender(event: NgtBeforeRenderEvent<THREE.Mesh>) {
    const mesh = event.object as THREE.Mesh;
    this.render_count++
    if (this.render_count === 5 ){
      
       console.log(mesh.children[0]);
    }
    

    mesh.rotation.y += 0.01;
    if (mesh.children[0].scale.y < 1.5) {
      mesh.children[0].scale.y += 0.01;
      // Change the color of each face of the mesh
     
      const t = mesh.children[0].scale.y / 1.5;

      // Update material colors and make into white 
      const hsl = new THREE.Color().setHSL(t, 1, 0.5);
      const targetHSL = new THREE.Color().setHSL(t, 1, 1);
      const deltaHSL = targetHSL.clone().sub(hsl);
      const startTime = Date.now();

      const animateColor = () => {
        const deltaTime = Date.now() - startTime;
        const progress = Math.min(deltaTime / 3500, 1);
        const currentHSL = hsl
          .clone()
          .add(deltaHSL.clone().multiplyScalar(progress));
        this.material1.color.set(currentHSL);
        this.material2.color.set(currentHSL);

        if (progress < 1) {
          requestAnimationFrame(animateColor);
        }
      };

      animateColor();
    }
  }

  readonly model$ = injectNgtLoader(
    () => GLTFLoader,
    'assets/smooth_sphere.glb'
  ).pipe(
    map((model) => {
      this.material1 = (model.scene.children[0] as THREE.Mesh)
        .material as THREE.MeshStandardMaterial;
      this.material2 = (model.scene.children[1] as THREE.Mesh)
        .material as THREE.MeshStandardMaterial;

       const geometry = new THREE.PlaneGeometry(1, 0.05);
       const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
       const line = new THREE.Mesh(geometry, material);
       line.position.set(0, 1.5, 0);
       model.scene.add(line);

       return model.scene;
    })
  );
}
