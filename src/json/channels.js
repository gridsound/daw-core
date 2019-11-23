"use strict";

DAWCore.json.channels = () => {
	const main = DAWCore.json.channel( 0, "main" );

	main.gain = .4;
	delete main.dest;
	delete main.order;
	return {
		main,
		1: DAWCore.json.channel( 0, "chan 1" ),
		2: DAWCore.json.channel( 1, "chan 2" ),
		3: DAWCore.json.channel( 2, "chan 3" ),
		4: DAWCore.json.channel( 3, "chan 4" ),
	};
};
