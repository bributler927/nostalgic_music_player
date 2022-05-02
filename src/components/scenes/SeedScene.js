import * as Dat from 'dat.gui';
import { Scene, Color,Fog } from 'three';
import { Flower, Land, Blob } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            song: ["no song"],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // maybe make a fog so points don't look weird, unsure if this will work though
        const color = 0xFFFFFF;  // white
        const near = 10;
        const far = 100;
        //this.fog = new Fog(color, near, far);


        // Add meshes to scene
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        const blob = new Blob(this);
        this.add(lights, blob);
        
        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        this.state.gui.add(this.state, 'song', ["no song", "Hallelujah by Jeff Buckley",
                                                "The Chain by Fleetwood Mac", "Hey Ya by Outkast",
                                            "Patience by Guns N' Roses", "Take Me Home, Country Roads by John Denver",
                                        "Bridge Over Troubled Water by Simon and Garfunkel", "Despacito by Luisi Fonsi"]);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    //blob.update();
}

export default SeedScene;
