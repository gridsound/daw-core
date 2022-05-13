"use strict";

DAWCore.actions.set( "changeEffect", ( daw, fxId, prop, val ) => {
	const fx = daw.get.effect( fxId );

	return [
		{ effects: { [ fxId ]: { data: { [ prop ]: val } } } },
		[ "effects", "changeEffect", daw.get.channel( fx.dest ).name, fx.type, prop ],
	];
} );
