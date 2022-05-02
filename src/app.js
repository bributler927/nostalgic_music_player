/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, BufferGeometry, BufferAttribute, ShaderMaterial, Color, 
            Points, IcosahedronGeometry, MeshStandardMaterial, Mesh, Audio } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import perlinNoise3d from 'perlin-noise-3d';
import { currSong } from './components/scenes/SeedScene';
import { chooseColor } from './components/adjustments';

//import JSON file
const json = require('./Spotify-2000.json');
var data = JSON.parse(JSON.stringify(json));

// Initialize core ThreeJS components
const SEPARATION = 70, AMOUNTX = 50, AMOUNTY = 50;

const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
let particles,  count = 0;

// Set up camera
// adjusted to move the wave behind the blob
camera.position.set(20, 0, -5);
camera.lookAt(new Vector3(0, 0, 0));

const numParticles = AMOUNTX * AMOUNTY;

const positions = new Float32Array( numParticles * 3 );
const scales = new Float32Array( numParticles );

let i = 0, j = 0;

for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

    for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

        // idk I tried lowering the wave using x and z, had issues with that -- maybe im missing/misunderstanding
        positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
        positions[ i + 1 ] = 0; // y
        positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z

        scales[ j ] = 1;

        i += 3;
        j ++;

    }

}

const geometry = new BufferGeometry();
geometry.setAttribute( 'position', new BufferAttribute( positions, 3 ) );
geometry.setAttribute( 'scale', new BufferAttribute( scales, 1 ) );

const material = new ShaderMaterial( {

    uniforms: {
        color: { value: new Color( 0xffffff  ) },
    },
    vertexShader: [
        "attribute float scale;", 
        "void main()",
        "{",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "gl_PointSize = scale * ( 300.0 / - mvPosition.z );",
        "gl_Position = projectionMatrix * mvPosition;",
        "}"
        ].join("\n"),
    fragmentShader: [
        "uniform vec3 color;", 
        "void main()",
        "{",
        "if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;",
        "gl_FragColor = vec4( color, 1.0 );",
        "}"
    ].join("\n")

    //vertexShader: document.getElementById( 'vertexshader' ).textContent,
    //fragmentShader: document.getElementById( 'fragmentshader' ).textContent

} );

     //

particles = new Points( geometry, material );
scene.add( particles );

var sphere_geometry = new IcosahedronGeometry(20, 3);
var Smaterial = new MeshStandardMaterial( {
    //change color of blob here
    color: 'white',
    roughness: 0.45,
    metalness: 0.75,

});

var sphere = new Mesh(sphere_geometry, Smaterial);
scene.add (sphere);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;

    let i = 0, j = 0;

    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

        for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

            // originally 50
            positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) *80 ) +
                            ( Math.sin( ( iy + count ) * 0.5 ) * 80 );

            // originally times 20 -- if we make the multiplication numbers smaller, makes waves smaller/ tamer
            scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 15 +
                            ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 20;

            i += 3;
            j ++;

        }

    }

     //can change this for bubble frequency
     var time = performance.now() * 0.001;

     // change 'k' value for more spikes
    var k = 1;
    for (var s = 0; s < sphere.geometry.vertices.length; s++) {
        var p = sphere.geometry.vertices[s];
        var n = new perlinNoise3d();
        var noise = n.noiseSeed(27);
        let perlin = noise.get(p.x * k + time, p.y * k, p.z * k);

        //increase this for more extreme ball
        //0.7 is default/low energy
        p.normalize().multiplyScalar(1 + 0.7 * perlin);
    }
    sphere.geometry.computeVertexNormals();
    sphere.geometry.normalsNeedUpdate = true;
    sphere.geometry.verticesNeedUpdate = true;


    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    renderer.render( scene, camera );

    count += 0.1;
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);


// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
