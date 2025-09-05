import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {MeshBasicMaterial} from "three";
import { OrbitControls } from "three/addons";
import {cloneUniformsGroups} from "three/src/renderers/shaders/UniformsUtils.js";

const canvas = document.querySelector('#phone')
const textureLoader = new THREE.TextureLoader()
const homeScreenTexture = textureLoader.load('/imgs/home_screen.jpg')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#3b3b3b');

const camera = new THREE.PerspectiveCamera( 50,
    window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5;

const light = new THREE.DirectionalLight(0xfffffff, 1);
light.position.set(1,1, 1);
scene.add(light);

const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
fillLight.position.set(-5, 2, -5);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
backLight.position.set(0, 5, -5);
scene.add(backLight);

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
canvas.appendChild( renderer.domElement )

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);

let model;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const loader = new GLTFLoader()
loader.load('/scene.gltf', function ( gltf ) {
    model = gltf.scene
    // model.overrideMaterial(new MeshBasicMaterial({ color: "blue"}))
    scene.add(model)
    model.traverse((child) => {
        if (child.isMesh && child.name === "Object_5") {
            // To see all the mesh names
            console.log(child.name);
            child.material = new THREE.MeshBasicMaterial({
                map: homeScreenTexture
            })
        }
    });
    // onProgress can be used for displaying something while it's loading the file
}, undefined, function (error) {
    console.error( error );
})


function onMouseClick(event) {
    // As three js needs coordinated in NDC (normalised device coordinates)
    // This will get the browsers coordinates of the click, and normalises it to the three js coord
    mouse.x = (event.clientX / window.innerWidth ) * 2 -1;
    mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;

    // console.log("x: ", mouse.x);
    // console.log("y: ", mouse.y);

    raycaster.setFromCamera(mouse, camera)

    if (model) {
        // This will check whether it intersects with the model
        const intersectPoint = raycaster.intersectObject(model, true);
        console.log(intersectPoint);
        if (intersectPoint.length > 0) {
            const clickedPart = intersectPoint[0].object;
            console.log('clicked:', clickedPart.name);
            // clickedPart.material.color.set('red')
        }
    }
}

window.addEventListener('click', onMouseClick)








function animate() {
    requestAnimationFrame(animate);
    // As model might not have rendered
    // if (model) {
    //     // model.rotation.x += 0.01;
    //     model.rotation.y += 0.01;
    // }
    controls.update()
    renderer.render(scene, camera);
}
animate();




//
// const geometry = new THREE.BoxGeometry( 1, 1, 1 )
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
// const cube = new THREE.Mesh(geometry, material)
// scene.add( cube )
//
// camera.position.z = 5;
//
// function animate() {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//
//     renderer.render( scene, camera )
// }
// renderer.setAnimationLoop(animate)

