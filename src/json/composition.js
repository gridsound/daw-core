"use strict";

DAWCore.json.composition = ( env, id ) => {
	const tracks = {},
		mixer = {
			"main": DAWCore.json.channel( "main" ),
			"1": DAWCore.json.channel( "chan#1" ),
			"2": DAWCore.json.channel( "chan#2" ),
			"3": DAWCore.json.channel( "chan#3" ),
			"4": DAWCore.json.channel( "chan#4" ),
		};

	delete mixer.main.dest;
	for ( let i = 0; i < env.def_nbTracks; ++i ) {
		tracks[ i ] = {};
	}
	return {
		id,
		bpm: env.def_bpm,
		stepsPerBeat: env.def_stepsPerBeat,
		beatsPerMeasure: env.def_beatsPerMeasure,
		name: "",
		duration: 0,
		loopA: false,
		loopB: false,
		synthOpened: "0",
		patternOpened: "0",
		patterns: {
			"0": {
				name: "pat",
				type: "keys",
				keys: "0",
				synth: "0",
				duration: env.def_beatsPerMeasure,
			},
		},
		mixer,
		tracks,
		blocks: {},
		synths: { "0": DAWCore.json.synth( "synth" ) },
		keys: { "0": {} },
	};
};
