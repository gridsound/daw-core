"use strict";

DAWCore.actions.toggleEffect = ( fxId, get ) => {
	const fx = get.effect( fxId ),
		toggle = !fx.toggle;

	return [
		{ effects: { [ fxId ]: { toggle } } },
		[ "effects", "toggleEffect", get.channel( fx.dest ).name, fx.type, toggle ],
	];
};
