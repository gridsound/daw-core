"use strict";

function DAWCoreJSON_channels() {
	return {
		main: DAWCoreJSON_channelMain(),
		1: DAWCoreJSON_channel( { order: 0, name: "drums" } ),
		2: DAWCoreJSON_channel( { order: 1, name: "synth" } ),
		3: DAWCoreJSON_channel( { order: 2, name: "chan 3" } ),
		4: DAWCoreJSON_channel( { order: 3, name: "chan 4" } ),
	};
}
