"use strict";

DAWCore.actions.changeLoop = ( a, b ) => {
	return Number.isFinite( a )
		? [
			{ loopA: a, loopB: b },
			[ "cmp", "changeLoop", a, b ]
		] : [
			{ loopA: null, loopB: null },
			[ "cmp", "removeLoop" ]
		];
};
