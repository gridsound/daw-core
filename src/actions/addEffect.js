"use strict";

DAWCoreActions.set( "addEffect", ( daw, dest, type ) => {
	const fxs = daw.$getEffects();
	const destFxs = Object.values( fxs ).filter( fx => fx.dest === dest );
	const id = DAWCoreActionsCommon.getNextIdOf( fxs );
	const fx = {
		dest,
		type,
		toggle: true,
		order: DAWCoreActionsCommon.getNextOrderOf( destFxs ),
		data: DAWCoreJSON.effects[ type ](),
	};

	return [
		{ effects: { [ id ]: fx } },
		[ "effects", "addEffect", daw.$getChannel( dest ).name, type ],
	];
} );
