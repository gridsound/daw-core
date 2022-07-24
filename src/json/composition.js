"use strict";

DAWCoreJSON.composition = ( env, id ) => {
	const tracks = {};
	const sPB = env.$defStepsPerBeat;
	const bPM = env.$defBeatsPerMeasure;

	for ( let i = 0; i < env.$defNbTracks; ++i ) {
		tracks[ i ] = DAWCoreJSON.track( { order: i } );
	}
	return {
		id,
		name: "",
		bpm: env.$defBPM,
		stepsPerBeat: sPB,
		beatsPerMeasure: bPM,
		duration: bPM,
		loopA: false,
		loopB: false,
		synthOpened: "0",
		patternKeysOpened: "0",
		patternDrumsOpened: "1",
		patternSlicesOpened: null,
		patternBufferOpened: null,
		buffers: {
			0: { MIME: "audio/wav", duration: .161, url: "1/kick-001" },
			1: { MIME: "audio/wav", duration: .310, url: "1/clap-001" },
			2: { MIME: "audio/wav", duration: .214, url: "1/hat-001" },
			3: { MIME: "audio/wav", duration: .321, url: "1/openhat-001" },
			4: { MIME: "audio/wav", duration: .429, url: "1/snare-001" },
		},
		patterns: {
			0: { order: 0, type: "keys", name: "keys", keys: "0", synth: "0", duration: bPM, },
			1: { order: 0, type: "drums", name: "drums", drums: "0", duration: bPM, },
			2: { order: 0, type: "buffer", dest: "1", buffer: "0", duration: 1, name: "1/kick-001", bufferType: "drum" },
			3: { order: 1, type: "buffer", dest: "1", buffer: "1", duration: 1, name: "1/clap-001", bufferType: "drum" },
			4: { order: 2, type: "buffer", dest: "1", buffer: "2", duration: 1, name: "1/hat-001", bufferType: "drum" },
			5: { order: 3, type: "buffer", dest: "1", buffer: "3", duration: 1, name: "1/openhat-001", bufferType: "drum" },
			6: { order: 4, type: "buffer", dest: "1", buffer: "4", duration: 1, name: "1/snare-001", bufferType: "drum" },
		},
		channels: DAWCoreJSON.channels(),
		tracks,
		blocks: {
			0: DAWCoreJSON.block( { pattern: "0", track: "0", duration: bPM } ),
			1: DAWCoreJSON.block( { pattern: "1", track: "1", duration: bPM } ),
		},
		synths: { 0: DAWCoreJSON.synth( { dest: "2" } ) },
		drumrows: {
			0: DAWCoreJSON.drumrow( { order: 0, pattern: "2" } ),
			1: DAWCoreJSON.drumrow( { order: 1, pattern: "3" } ),
			2: DAWCoreJSON.drumrow( { order: 2, pattern: "4" } ),
			3: DAWCoreJSON.drumrow( { order: 3, pattern: "5" } ),
			4: DAWCoreJSON.drumrow( { order: 4, pattern: "6" } ),
		},
		slices: {},
		drums: { 0: {} },
		keys: { 0: {} },
	};
};
