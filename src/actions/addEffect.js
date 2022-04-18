"use strict";

DAWCore.actions.addEffect = ( dest, type, get ) => {
	const fxs = get.effects();
	const destFxs = Object.values( fxs ).filter( fx => fx.dest === dest );
	const id = DAWCore.actions.common.getNextIdOf( fxs );
	const fx = {
		dest,
		type,
		toggle: true,
		order: DAWCore.actions.common.getNextOrderOf( destFxs ),
		data: DAWCore.json.effects[ type ](),
	};

	return [
		{ effects: { [ id ]: fx } },
		[ "effects", "addEffect", get.channel( dest ).name, type ],
	];
};
