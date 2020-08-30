"use strict";

DAWCore.json.env = obj => ( {
	toggle: true,
	attack: .15,
	hold: .08,
	decay: .08,
	substain: .5,
	release: .25,
	...obj,
} );
