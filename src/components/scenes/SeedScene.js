import * as Dat from 'dat.gui';
import { Scene, Color, Fog } from 'three';
import { BasicLights } from 'lights';
import { chooseColor } from '../adjustments';

export var currSong;

//save the wanted mp3 audios to their respective variables
var patience = new Audio("src/components/sounds/Patience.mp3");
var bridge = new Audio("src/components/sounds/Bridge_Over_Troubled_Water.mp3");
var hallelujah = new Audio("src/components/sounds/Hallelujah.mp3");
var despacito = new Audio("src/components/sounds/Despacito.mp3");
var heyya = new Audio("src/components/sounds/Hey_Ya!.mp3");
var country = new Audio("src/components/sounds/Take_Me_Home,Country_Roads.mp3");
var chain = new Audio("src/components/sounds/The_Chain.mp3");

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
        }
    }

    //helper function that takes selected song and plays the audio
    chooseSong() {
        if (currSong == "Patience - Guns N' Roses") {
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
