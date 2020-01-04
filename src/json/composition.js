"use strict";

DAWCore.json.composition = ( env, id ) => {
	const tracks = {},
		sPB = env.def_stepsPerBeat,
		bPM = env.def_beatsPerMeasure;

	for ( let i = 0; i < env.def_nbTracks; ++i ) {
		tracks[ i ] = {};
	}
	return {
		id,
		name: "",
		bpm: env.def_bpm,
		stepsPerBeat: sPB,
		beatsPerMeasure: bPM,
		duration: bPM,
		loopA: false,
		loopB: false,
		synthOpened: "0",
		patternKeysOpened: "0",
		patternBufferOpened: null,
		buffers: {},
		patterns: {
			0: { order: 0, type: "keys", name: "pat", keys: "0", synth: "0", duration: bPM, },
		},
		channels: DAWCore.json.channels(),
		tracks,
		blocks: {
			0: { pattern: "0", track: "0", when: 0, duration: bPM },
		},
		synths: { 0: DAWCore.json.synth( "synth" ) },
		drumrows: {},
		drums: {},
		keys: { 0: {} },
	};
};
