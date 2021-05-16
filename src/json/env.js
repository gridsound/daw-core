"use strict";

DAWCore.json.env = obj => ( {
	toggle: true,
	attack: .04,
	hold: 0,
	decay: .08,
	substain: .75,
	release: .25,
	...obj,
} );
