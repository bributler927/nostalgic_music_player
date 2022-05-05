import { Color } from 'three';

export function chooseColor(valence, isSphere) {
    if (valence == null) {
        return new Color("gray");
    }
    if (valence <= 9 && isSphere == false ) {
        return new Color("darkblue");
    }
    //if sphere
    else if (valence <= 9 && isSphere == true ) {
        return new Color("blue");
    }


    else if (valence <= 19 && isSphere == false ) {
        return new Color("purple");
    }
    //if sphere
    else if (valence <= 19 && isSphere == true ) {
        return new Color("purple");
    }


    else if (valence <= 29 && isSphere == false ) {
        return new Color("darkgreen");
    }
    //if sphere
    else if (valence <= 29 && isSphere == true ) {
        return new Color("green");
    }


    else if (valence <= 39 && isSphere == false ) {
        return new Color("indigo");
    }
    //if sphere
    else if (valence <= 39 && isSphere == true ) {
        return new Color("lavender");
    }


    else if (valence <= 49 && isSphere == false ) {
        return new Color("crimson");
    }
     //if sphere
     else if (valence <= 49 && isSphere == true ) {
        return new Color("maroon");
    }


    else if (valence <= 59 && isSphere == false ) {
        return new Color("orchid");
    }
    //if sphere
    else if (valence <= 59 && isSphere == true ) {
        return new Color("hotpink");
    }
    

    else if (valence <= 69 && isSphere == false ) {
        return new Color("orange");
    }
    //if sphere
    else if (valence <= 69 && isSphere == true ) {
        return new Color("peachpuff");
    }


    else if (valence <= 79 && isSphere == false ) {
        return new Color("cyan");
    }
    //if sphere
    else if (valence <= 79 && isSphere == true ) {
        return new Color("aquamarine");
    }


    else if (valence <= 89 && isSphere == false ) {
        return new Color("limegreen");
    }
    //ifsphere
    else if (valence <= 89 && isSphere == true ) {
        return new Color("limegreen");
    }


    else if (valence <= 99 && isSphere == false ) {
        return new Color("chartreuse");
    }
    else if (valence <= 99 && isSphere == true ) {
        return new Color("chartreuse");
    }

};
