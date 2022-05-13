"use strict";

DAWCore.actions.set( "changePatternSlices", ( id, prop, val, _get, daw ) => {
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
			DAWCore.actionsCommon.updatePatternDuration( obj, id, val, daw );
			break;
		case "slices":
			act = "changeSlices";
			obj.slices = { [ daw.get.pattern( id ).slices ]: val };
			break;
	}
	return [
		obj,
		[ "slices", act, daw.get.pattern( id ).name, val ],
	];
} );
