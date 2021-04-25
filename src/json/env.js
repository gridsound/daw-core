"use strict";

DAWCore.json.env = obj => ( {
	toggle: true,
	attack: .1,
	hold: .05,
	decay: .1,
	substain: .6,
	release: .25,
	...obj,
} );
