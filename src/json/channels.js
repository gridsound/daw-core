"use strict";

DAWCore.json.channels = () => ( {
	main: DAWCore.json.channelMain(),
	1: DAWCore.json.channel( { order: 0, name: "drums" } ),
	2: DAWCore.json.channel( { order: 1, name: "synth" } ),
	3: DAWCore.json.channel( { order: 2, name: "chan 3" } ),
	4: DAWCore.json.channel( { order: 3, name: "chan 4" } ),
} );
