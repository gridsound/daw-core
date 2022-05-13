"use strict";

DAWCore.actions.set( "toggleEffect", ( daw, fxId ) => {
	const fx = daw.get.effect( fxId );
	const toggle = !fx.toggle;

	return [
		{ effects: { [ fxId ]: { toggle } } },
		[ "effects", "toggleEffect", daw.get.channel( fx.dest ).name, fx.type, toggle ],
	];
} );
