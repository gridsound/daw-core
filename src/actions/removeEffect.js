"use strict";

DAWCore.actions.set( "removeEffect", ( daw, id ) => {
	const fx = daw.$getEffect( id );

	return [
		{ effects: { [ id ]: undefined } },
		[ "effects", "removeEffect", daw.$getChannel( fx.dest ).name, fx.type ],
	];
} );
