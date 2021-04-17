"use strict";

DAWCore.MIDI = class {
    constructor( daw ) {
        this.daw = daw
        this.midiSupport = this._MIDIApiBrowserSupport(),
        this.midiInputs = null,
        this.midiOutputs = null,
        this._MIDIAccess()
	}

    _MIDIApiBrowserSupport() {
        // check for the support of web midi api
        if (navigator.requestMIDIAccess) {
            return true;
        } else {
            return false;
        }
    }

    _MIDIAccess() {
        if (this.midiSupport) {
            navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
            function onMIDISuccess(midiAccess) {
                this.midiInputs = midiAccess.inputs;
                this.midiOutputs = midiAccess.outputs;
            }
        
            function onMIDIFailure() {
                 console.log('Could not access your MIDI devices.');
            }
        }
    }

    _getMIDIInput(id, callback = MIDIMessageReceived) {
         if (this.midiSupport) {
            var connectedMIDI = midi.inputs.get(id);
            // connect midi on message to callback
            connectedMIDI.onmidimessage = callback;
        }

    }

    _parseMIDIMessage() {
        // Parse basic information out of a MIDI message
        return {
            command: message.data[0] >> 4,
            channel: message.data[0] & 0xf,
            note: message.data[1],
            velocity: message.data[2] / 127,
        };
    }

    MIDIMessageReceived(e) {
        if (this.midiSupport) {
            var midiMessage = parseMidiMessage(e);
            if (midiMessage.velocity > 0) {
                this.daw.pianoroll.liveKeydown(midiMessage.note);
            } else {
                this.daw.pianoroll.liveKeyup(midiMessage.note);
            }
        }
    }
}