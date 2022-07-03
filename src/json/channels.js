"use strict";

DAWCoreJSON.channels = () => ( {
	main: DAWCoreJSON.channelMain(),
	1: DAWCoreJSON.channel( { order: 0, name: "drums" } ),
	2: DAWCoreJSON.channel( { order: 1, name: "synth" } ),
	3: DAWCoreJSON.channel( { order: 2, name: "chan 3" } ),
	4: DAWCoreJSON.channel( { order: 3, name: "chan 4" } ),
} );
