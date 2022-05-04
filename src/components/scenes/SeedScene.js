import * as Dat from 'dat.gui';
import { Scene, Color, Fog, IcosahedronGeometry, 
        MeshStandardMaterial, Mesh, BufferGeometry, BufferAttribute, ShaderMaterial,  
        Points } from 'three';
import { BasicLights } from 'lights';
import { chooseColor } from '../adjustments';
import {songList} from '../../app.js';

export var currSong;
var currValence;
var currDanceability;
var currEnergy;
var currBPM;



export var songIndex;

//save the wanted mp3 audios to their respective variables
var patience = new Audio("src/components/sounds/Patience.mp3");
var bridge = new Audio("src/components/sounds/Bridge_Over_Troubled_Water.mp3");
var hallelujah = new Audio("src/components/sounds/Hallelujah.mp3");
var despacito = new Audio("src/components/sounds/Despacito.mp3");
var heyya = new Audio("src/components/sounds/Hey_Ya!.mp3");
var country = new Audio("src/components/sounds/Take_Me_Home,Country_Roads.mp3");
var chain = new Audio("src/components/sounds/The_Chain.mp3");
//second set of Songs
var eight = new Audio("src/components/sounds/EightDaysAWeek.mp3");
var diggity = new Audio("src/components/sounds/NoDiggity.mp3");
var rocketman = new Audio("src/components/sounds/Rocketman.mp3");
var imm = new Audio("src/components/sounds/MyImmortal.mp3");

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
            }

            currValence = valence;
        }

        this.background = chooseColor(valence, false);

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
        if (currSong == "Patience - Guns N' Roses") {
            songIndex = 1399;
            //stop all other audios
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            patience.play();
        }
        else if (currSong == 'Bridge Over Troubled Water - Simon & Garfunkel') {
            //stop all other audios
            songIndex = 802;
            patience.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            bridge.play();
        }
        else if (currSong == 'Despacito - Luis Fonsi') {
            //stop all other audios
            songIndex = 798;
            patience.pause();
            bridge.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            despacito.play();
        }
        else if (currSong == 'Hallelujah - Jeff Buckley') {
            //stop all other audios
            songIndex = 1632;
            patience.pause();
            bridge.pause();
            despacito.pause();
            heyya.pause();
            chain.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            hallelujah.play();
        }
        else if (currSong == 'Hey Ya - Outkast') {
            //stop all other audios
            songIndex = 280;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            chain.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            heyya.play();
        }
        else if (currSong == 'The Chain - Fleetwood Mac') {
            //stop all other audios
            songIndex = 1038;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            chain.play();
        }
        else if (currSong == 'Take Me Home Country Roads - John Denver') {
            //stop all other audios
            songIndex = 1722;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            country.play();
        }
        else if (currSong == 'No Diggity - Blackstreet')  {
            //stop all other audios
            songIndex = 1712;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            eight.pause();
            country.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            diggity.play();
        }
        else if (currSong == 'Rocket Man - Elton John')  {
            //stop all other audios
            songIndex = 885;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            eight.pause();
            country.pause();
            imm.pause();
            diggity.pause();

            //play wanted song
            rocketman.play();
        }
        else if (currSong == 'My Immortal - Evanescence')  {
            //stop all other audios
            songIndex = 166;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            eight.pause();
            country.pause();
            diggity.pause();
            rocketman.pause();

            //play wanted song
            imm.play();
        }
        else if (currSong == 'Eight Days A Week - The Beatles')  {
            //stop all other audios
            songIndex = 1847;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            diggity.pause();
            country.pause();
            imm.pause();
            rocketman.pause();

            //play wanted song
            eight.play();
        }
        else {
            //stop all songs if no songs is selected
            songIndex = null;
            patience.pause();
            bridge.pause();
            despacito.pause();
            hallelujah.pause();
            heyya.pause();
            chain.pause();
            country.pause();
            eight.pause();
            diggity.pause();
            imm.pause();
            rocketman.pause();
        }
    }

    //blob.update();
}

export default SeedScene;
