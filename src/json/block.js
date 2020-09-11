"use strict";

DAWCore.json.block = obj => ( {
	pattern: "",
	duration: 0,
	durationEdited: false,
	selected: false,
	offset: 0,
	when: 0,
	track: "",
	...obj,
} );
