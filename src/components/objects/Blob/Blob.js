import { Group, Color } from 'three';
import { IcosahedronGeometry, SphereGeometry, MeshStandardMaterial, Mesh } from 'three';
import perlinNoise3d from 'perlin-noise-3d';

var sphere_geometry = new IcosahedronGeometry(20, 3);
var material = new MeshStandardMaterial( {
    //change color of blob here
    color: '#87ceeb',

    roughness: 0.45,
    metalness: 0.75,

});

var sphere = new Mesh(sphere_geometry, material);


class Blob extends Group {
    
    
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
        };

        this.name = 'blob';
        this.add(sphere);

        // Add self to parent's update list
        parent.addToUpdateList(this);

    }
    

    update(timeStamp) {
        // Advance tween animations, if any exist
        
        //can change this for bubble frequency
        var time = performance.now() * 0.003;

         // change 'k' value for more spikes
        var k = 1;
        for (var i = 0; i < sphere.geometry.vertices.length; i++) {
            var p = sphere.geometry.vertices[i];
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

        //TWEEN.update();
    }
}

export default Blob;
