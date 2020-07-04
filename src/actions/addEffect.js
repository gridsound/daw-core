"use strict";

DAWCore.actions.addEffect = ( dest, type, get ) => {
	const fxs = get.effects(),
		destFxs = Object.values( fxs ).filter( fx => fx.dest === dest ),
		id = DAWCore.common.getNextIdOf( fxs ),
		fx = {
			dest,
			type,
			toggle: true,
			order: DAWCore.common.getNextOrderOf( destFxs ),
			data: DAWCore.json.effects[ type ](),
		};

	return [
		{ effects: { [ id ]: fx } },
		[ "effects", "addEffect", get.channel( dest ).name, type ],
	];
};
