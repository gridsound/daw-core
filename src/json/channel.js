"use strict";

DAWCore.json.channel = ( order, name ) => ( {
	order,
	toggle: true,
	name,
	gain: 1,
	pan: 0,
	dest: "main",
} );
