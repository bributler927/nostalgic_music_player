import * as Dat from 'dat.gui';
import { Scene, Color, Fog, IcosahedronGeometry, 
        MeshStandardMaterial, Mesh, BufferGeometry,MeshLambertMaterial, BufferAttribute, ShaderMaterial,  
        Points } from 'three';
import { chooseColor } from '../adjustments';
import {songList} from '../../app.js';
import SimplexNoise from 'simplex-noise';
import perlinNoise3d from 'perlin-noise-3d';
import { bridge, despacito, eight, hallelujah, heyya, immortal, diggity, patience, rocket,country,chain } from '../sounds';

export var currSong;
var currValence;
var currDanceability;
var currEnergy;
var currBPM;



export var songIndex;

//save the wanted mp3 audios to their respective variables


//add sphere to scene
var sphere_geometry = new IcosahedronGeometry(20, 3);
        var Smaterial = new MeshStandardMaterial( {
            //change color of blob here
            color: 'white',
            roughness: 0.45,
            metalness: 0.90,
                                                
        });
var sphere = new Mesh(sphere_geometry, Smaterial);
let particles,  count = 0;
const SEPARATION = 70, AMOUNTX = 50, AMOUNTY = 50;

var context = new AudioContext(),sourceNode, analyser, audio;
var noise = new SimplexNoise();
var icosahedronGeometry = new IcosahedronGeometry(0.5, 5);
    var lambertMaterial = new MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true
    });

        var ball = new Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);


class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            //rotationSpeed: 1,
            song: "",
        };

        //adjust gui so whole droopdown menu is visible
        this.state.gui.width = 530;

        // Set background to a nice color
        this.background = new Color("gray");

        // maybe make a fog so points don't look weird, unsure if this will work though
        const color = 0xFFFFFF;  // white
        const near = 10;
        const far = 100;
        //this.fog = new Fog(color, near, far);
        // Add meshes to scene
       
        this.add(sphere);
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


        } );
        particles = new Points( geometry, material );
        this.add( particles );
        this.add(ball);


        
        
        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        this.state.gui.add(this.state, 'song', ['No Song', 'Bridge Over Troubled Water - Simon & Garfunkel', 'Despacito - Luis Fonsi', 
                                                'Eight Days A Week - The Beatles', 'Hallelujah - Jeff Buckley', 
                                                'Hey Ya - Outkast', 'My Immortal - Evanescence', 'No Diggity - Blackstreet', "Patience - Guns N' Roses",
                                                'Rocket Man - Elton John', 'The Chain - Fleetwood Mac', 'Take Me Home Country Roads - John Denver']);


    }

    update(timeStamp) {
        const { song } = this.state;
        //if the song has changed, play this new song
        var energy;
        var danceability;
        var BPM = 30;
        var loudness = 20; // initialize to 20 just for wave
        var valence;
        if (song != currSong) {
            if (audio) audio.remove();
            if (sourceNode) sourceNode.disconnect();
            this.remove(ball);
            icosahedronGeometry=  new IcosahedronGeometry(0.5, 5);
            lambertMaterial = new MeshLambertMaterial({
                color: 0xff00ee,
                wireframe: true
            });
            ball = new Mesh(icosahedronGeometry, lambertMaterial);
            this.add(ball);
            
            currSong = song;
            //calls song player helper function
            this.chooseSong();

            if(songIndex != null) {
                var energy = (songList.filter( element => element.Index=== songIndex)[0]["Energy"]);
                var danceability = (songList.filter( element => element.Index=== songIndex)[0]["Danceability"]);
                var BPM = (songList.filter( element => element.Index=== songIndex)[0]["Beats Per Minute (BPM)"]);
                var loudness = (songList.filter( element => element.Index=== songIndex)[0]["Loudness (dB)"]);
                var valence = (songList.filter( element => element.Index=== songIndex)[0]["Valence"]);
                
                currValence = valence;
                currDanceability = danceability;
                currBPM = BPM;
                currEnergy = energy;
            } else {
                currValence = null;
                currDanceability = null;
                currBPM = null;
                currEnergy = null;
            }

        }
        if (analyser) {
            analyser.fftSize = 512;
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
            var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

            var overallAvg = avg(dataArray);
            var lowerMax = max(lowerHalfArray);
            var lowerAvg = avg(lowerHalfArray);
            var upperMax = max(upperHalfArray);
            var upperAvg = avg(upperHalfArray);

            var lowerMaxFr = lowerMax / lowerHalfArray.length;
            var lowerAvgFr = lowerAvg / lowerHalfArray.length;
            var upperMaxFr = upperMax / upperHalfArray.length;
            var upperAvgFr = upperAvg / upperHalfArray.length;

            
            this.makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));
        }



        this.background = chooseColor(currValence, false);

        //can change this for bubble frequency
        
        if (currBPM != null) {
            var time = performance.now() * 0.00006 * currBPM / 10;
            var waveBPM = currBPM;
        }
        else {
            var time = performance.now() * 0.000001;
            var waveBPM = 0;
        }

        //console.log(currBPM);
        // change 'k' value for more spikes
        
        if (currDanceability != null) {
            var k = currDanceability * 2 / 100;
        }
        else {
            var k = 0;
        }

        if (currValence != null) {
            var col = chooseColor(currValence, true);
        }
        else {
            var col = new Color("white");
        }
        sphere.material.color = col;

        ball.material.color = col;

        for (var s = 0; s < sphere.geometry.vertices.length; s++) {
            var p = sphere.geometry.vertices[s];
            var n = new perlinNoise3d();
            var noise = n.noiseSeed(27);
            let perlin = noise.get(p.x * k + time, p.y * k, p.z * k);

            //increase this for more extreme ball
            //0.5 is default/low energy
            if (currEnergy != null) {
                var sc = 0.5 + currEnergy / 150;
            }
            else {
                var sc = 0;
            } 
            p.normalize().multiplyScalar(1.5 + sc * perlin);
        }

        //console.log(sphere);
        //debugger
        sphere.geometry.computeVertexNormals();
        sphere.geometry.normalsNeedUpdate = true;
        sphere.geometry.verticesNeedUpdate = true;
        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;
        //console.log(loudness);

        for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

            for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

                // originally 50
                positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * waveBPM ) +
                                ( Math.sin( ( iy + count ) * 0.5 ) * waveBPM );

                // originally times 20 -- if we make the multiplication numbers smaller, makes waves smaller/ tamer
                scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 30 +
                                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 30;

                i += 3;
                j ++;

            }

        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;

        count += BPM/950;
    }
    

    //helper function that takes selected song and plays the audio
    chooseSong() {

        context.resume();
        
        if (currSong == "Patience - Guns N' Roses") {
            songIndex = 1399;

            audio = new Audio(patience);
            this.setupAudioNodes();

        }
        else if (currSong == 'Bridge Over Troubled Water - Simon & Garfunkel') {
            //stop all other audios
            songIndex = 802;
            audio = new Audio(bridge);
            this.setupAudioNodes();
        }
        else if (currSong == 'Despacito - Luis Fonsi') {
            //stop all other audios
            songIndex = 798;
            audio = new Audio(despacito);

            this.setupAudioNodes();
        }
        else if (currSong == 'Hallelujah - Jeff Buckley') {
            //stop all other audios
            songIndex = 1632;
            audio = new Audio(hallelujah);
            this.setupAudioNodes();
        }
        else if (currSong == 'Hey Ya - Outkast') {
            //stop all other audios
            songIndex = 280;
            audio = new Audio(heyya);
            this.setupAudioNodes();
        }
        else if (currSong == 'The Chain - Fleetwood Mac') {
            //stop all other audios
            songIndex = 1038;
            audio = new Audio(chain);
            this.setupAudioNodes();
        }
        else if (currSong == 'Take Me Home Country Roads - John Denver') {
            //stop all other audios
            songIndex = 1722;
            audio = new Audio(country);
            this.setupAudioNodes();
        }
        else if (currSong == 'No Diggity - Blackstreet')  {
            //stop all other audios
            songIndex = 1712;
            audio = new Audio(diggity);            
            this.setupAudioNodes();
        }
        else if (currSong == 'Rocket Man - Elton John')  {
            //stop all other audios
            songIndex = 885;
            audio = new Audio(rocket);
            this.setupAudioNodes();
        }
        else if (currSong == 'My Immortal - Evanescence')  {
            //stop all other audios
            songIndex = 166;
            audio = new Audio(immortal);
            this.setupAudioNodes();
        }
        else if (currSong == 'Eight Days A Week - The Beatles')  {
            //stop all other audios
            songIndex = 1847;
            audio = new Audio(eight);
            this.setupAudioNodes();
        }
        else {
            //stop all songs if no songs is selected
            songIndex = null;
            audio = null;
        }
    }

    setupAudioNodes() {
        analyser = (analyser || context.createAnalyser());
    
        sourceNode = context.createMediaElementSource(audio);
        sourceNode.connect(analyser);
        sourceNode.connect(context.destination);
    
        audio.play();
        
    }

    makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.radius;
            var amp = 7;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
            var distance = ((offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr)/3;
            vertex.multiplyScalar(distance);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    //blob.update();
}

export default SeedScene;





//initialise simplex noise instance

  


//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}

function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
