"use strict";

DAWCore.controllers.midi = class {
    constructor( fns ) {
		this.data = {
            midiSupport: this._MIDIApiBrowserSupport(),
            midiInputs: null,
            midiOutputs: null,
        };
        this._MIDIAccess()
		this.on = GSUtils.mapCallbacks( [], fns.dataCallbacks );
		this._keysCrud = GSUtils.createUpdateDelete.bind( null, this.data,
			this._addKey.bind( this ),
			this._updateKey.bind( this ),
			this._deleteKey.bind( this ) );
		Object.freeze( this );
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

    _getMIDIInput(id, callback) {
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
                DAW.pianoroll.liveKeydown(midiMessage.note);
                UIkeys.midiKeyDown(midiMessage.note);
            } else {
                DAW.pianoroll.liveKeyup(midiMessage.note);
                UIkeys.midiKeyUp(midiMessage.note);
            }
        }
    }
}