"use strict";

DAWCore.actions.set( "changeEffect", ( daw, fxId, prop, val ) => {
	const fx = daw.$getEffect( fxId );

	return [
		{ effects: { [ fxId ]: { data: { [ prop ]: val } } } },
		[ "effects", "changeEffect", daw.$getChannel( fx.dest ).name, fx.type, prop ],
	];
} );
