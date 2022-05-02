import * as Dat from 'dat.gui';
import { Scene, Color, Fog, IcosahedronGeometry, 
        MeshStandardMaterial, Mesh } from 'three';
import { BasicLights } from 'lights';
import { chooseColor } from '../adjustments';
import {songList} from '../../app.js';
export var currSong;
export var songIndex;

//save the wanted mp3 audios to their respective variables
var patience = new Audio("src/components/sounds/Patience.mp3");
var bridge = new Audio("src/components/sounds/Bridge_Over_Troubled_Water.mp3");
var hallelujah = new Audio("src/components/sounds/Hallelujah.mp3");
var despacito = new Audio("src/components/sounds/Despacito.mp3");
var heyya = new Audio("src/components/sounds/Hey_Ya!.mp3");
var country = new Audio("src/components/sounds/Take_Me_Home,Country_Roads.mp3");
var chain = new Audio("src/components/sounds/The_Chain.mp3");

//add sphere to scene
var sphere_geometry = new IcosahedronGeometry(20, 3);
        var Smaterial = new MeshStandardMaterial( {
            //change color of blob here
            color: 'white',
            roughness: 0.45,
            metalness: 0.75,
                                                
            });
var sphere = new Mesh(sphere_geometry, Smaterial);

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
        this.background = chooseColor(99);

        // maybe make a fog so points don't look weird, unsure if this will work though
        const color = 0xFFFFFF;  // white
        const near = 10;
        const far = 100;
        //this.fog = new Fog(color, near, far);
        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);
        this.add(sphere);
        
        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        this.state.gui.add(this.state, 'song', ['No Song', 'Bridge Over Troubled Water - Simon & Garfunkel', 'Despacito - Luis Fonsi', 
                                                'Hallelujah - Jeff Buckley', 'Hey Ya - Outkast', "Patience - Guns N' Roses", 
                                                'The Chain - Fleetwood Mac', 'Take Me Home Country Roads - John Denver']);


    }

    update(timeStamp) {
        const { song } = this.state;
        //if the song has changed, play this new song
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
                console.log(BPM);
            
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

            //play wanted song
            country.play();
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
        }
    }

    //blob.update();
}

export default SeedScene;
