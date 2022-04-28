"use strict";

DAWCore.actions.set( "changeEffect", ( fxId, prop, val, get ) => {
	const fx = get.effect( fxId );

	return [
		{ effects: { [ fxId ]: { data: { [ prop ]: val } } } },
		[ "effects", "changeEffect", get.channel( fx.dest ).name, fx.type, prop ],
	];
} );
