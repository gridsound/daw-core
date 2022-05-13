"use strict";

DAWCore.actions.set( "removeEffect", ( daw, id ) => {
	const fx = daw.get.effect( id );

	return [
		{ effects: { [ id ]: undefined } },
		[ "effects", "removeEffect", daw.get.channel( fx.dest ).name, fx.type ],
	];
} );
