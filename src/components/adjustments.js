import { Color } from 'three';

export function chooseColor(valence) {
    if (valence <= 9 ) {
        return new Color("darkblue");
    }
    else if (valence <= 19 ) {
        return new Color("purple");
    }
    else if (valence <= 29 ) {
        return new Color("darkgreen");
    }
    else if (valence <= 39 ) {
        return new Color("indigo");
    }
    else if (valence <= 49 ) {
        return new Color("crimson");
    }
    else if (valence <= 59 ) {
        return new Color("orchid");
    }
    else if (valence <= 69 ) {
        return new Color("orange");
    }
    else if (valence <= 79 ) {
        return new Color("cyan");
    }
    else if (valence <= 89 ) {
        return new Color("yellowgreen");
    }
    else if (valence <= 99 ) {
        return new Color("chartreuse");
    }
};