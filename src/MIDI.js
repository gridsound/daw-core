"use strict";

DAWCore.MIDI = class {
    constructor( daw ) {
        this.daw = daw
        this.MIDIEnable
        this.MIDISupport = this._MIDIApiBrowserSupport(),
        this.MIDIInputs = null,
        this.MIDIOutputs = null,
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
            function onMIDISuccess(MIDIAccess) {
                this.MIDIInputs = MIDIAccess.inputs;
                this.MIDIOutputs = MIDIAccess.outputs;
            }
        
            function onMIDIFailure() {
                 console.log('Could not access your MIDI devices.');
            }
        }
    }

    getMIDIInput(id, callback = MIDIMessageReceived) {
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

    MIDIMessageReceived(e, callback) {
        if (this.midiSupport) {
            var midiMessage = parseMidiMessage(e);
            if (midiMessage.velocity > 0) {
                this.daw.pianoroll.liveKeydown(midiMessage.note);
                callback()
            } else {
                this.daw.pianoroll.liveKeyup(midiMessage.note);
                callback()
            }
        }
    }
}