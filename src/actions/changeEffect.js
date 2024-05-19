"use strict";

function DAWCoreActions_changeEffect( daw, fxId, mainProp, data ) {
	const fx = daw.$getEffect( fxId );

	return [
		{ effects: { [ fxId ]: { data } } },
		[ "effects", "changeEffect", daw.$getChannel( fx.dest ).name, fx.type, mainProp ],
	];
}
