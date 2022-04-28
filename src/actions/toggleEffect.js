"use strict";

DAWCore.actions.set( "toggleEffect", ( fxId, get ) => {
	const fx = get.effect( fxId );
	const toggle = !fx.toggle;

	return [
		{ effects: { [ fxId ]: { toggle } } },
		[ "effects", "toggleEffect", get.channel( fx.dest ).name, fx.type, toggle ],
	];
} );
