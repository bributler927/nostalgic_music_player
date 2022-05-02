import * as Dat from 'dat.gui';
import { Scene, Color, Fog } from 'three';
import { BasicLights } from 'lights';

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

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

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
        this.state.gui.add(this.state, 'song', ['Bridge Over Troubled Water - Simon & Garfunkel', 'Despacito - Luis Fonsi', 
                                                'Hallelujah - Jeff Buckley', 'Hey Ya - Outkast', "Patience - Guns N' Roses", 
                                                'The Chain - Fleetwood Mac', 'Take Me Home Country Roads - John Denver']);
    }

    update(timeStamp) {
        const { song } = this.state;
    }

    //blob.update();
}

export default SeedScene;
