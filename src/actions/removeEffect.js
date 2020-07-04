"use strict";

DAWCore.actions.removeEffect = ( id, get ) => {
	const fx = get.effect( id );

	return [
		{ effects: { [ id ]: undefined } },
		[ "effects", "removeEffect", get.channel( fx.dest ).name, fx.type ],
	];
};
