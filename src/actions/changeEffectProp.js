"use strict";

DAWCoreActions.set( "changeEffectProp", ( daw, fxId, prop, val ) => {
	const fx = daw.$getEffect( fxId );

	return [
		{ effects: { [ fxId ]: { data: { [ prop ]: val } } } },
		[ "effects", "changeEffectProp", daw.$getChannel( fx.dest ).name, fx.type, prop ],
	];
} );
