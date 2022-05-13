"use strict";

DAWCore.actions.set( "changePatternSlices", ( daw, id, prop, val ) => {
	const obj = {};
	let act;

	switch ( prop ) {
		case "cropA":
		case "cropB":
			act = "cropSlices";
			obj.patterns = { [ id ]: { [ prop ]: val } };
			break;
		case "duration":
			act = "changeSlicesDuration";
			DAWCore.actionsCommon.updatePatternDuration( daw, obj, id, val );
			break;
		case "slices":
			act = "changeSlices";
			obj.slices = { [ daw.$getPattern( id ).slices ]: val };
			break;
	}
	return [
		obj,
		[ "slices", act, daw.$getPattern( id ).name, val ],
	];
} );
