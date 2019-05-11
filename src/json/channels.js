"use strict";

DAWCore.json.channels = () => {
	const chans = {
		main: DAWCore.json.channel( 0, "main" ),
		1: DAWCore.json.channel( 1, "chan 1" ),
		2: DAWCore.json.channel( 2, "chan 2" ),
		3: DAWCore.json.channel( 3, "chan 3" ),
		4: DAWCore.json.channel( 4, "chan 4" ),
	};

	delete chans.main.dest;
	return chans;
};
