"use strict";

DAWCore.actions.changeEffect = ( fxId, prop, val, get ) => {
	const fx = get.effect( fxId );

	return [
		{ effects: { [ fxId ]: { data: { [ prop ]: val } } } },
		[ "effects", "changeEffect", get.channel( fx.dest ).name, fx.type, prop ],
	];
};
