"use strict";

DAWCoreActions.toggleEffect = ( daw, fxId ) => {
	const fx = daw.$getEffect( fxId );
	const toggle = !fx.toggle;

	return [
		{ effects: { [ fxId ]: { toggle } } },
		[ "effects", "toggleEffect", daw.$getChannel( fx.dest ).name, fx.type, toggle ],
	];
};
