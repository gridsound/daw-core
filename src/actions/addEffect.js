"use strict";

DAWCore.actions.set( "addEffect", ( daw, dest, type ) => {
	const fxs = daw.$getEffects();
	const destFxs = Object.values( fxs ).filter( fx => fx.dest === dest );
	const id = DAWCore.actionsCommon.getNextIdOf( fxs );
	const fx = {
		dest,
		type,
		toggle: true,
		order: DAWCore.actionsCommon.getNextOrderOf( destFxs ),
		data: DAWCore.json.effects[ type ](),
	};

	return [
		{ effects: { [ id ]: fx } },
		[ "effects", "addEffect", daw.$getChannel( dest ).name, type ],
	];
} );
