"use strict";

DAWCore.actions.set( "changePatternSlices", ( id, prop, val, get ) => {
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
			DAWCore.actionsCommon.updatePatternDuration( obj, id, val, get );
			break;
		case "slices":
			act = "changeSlices";
			obj.slices = { [ get.pattern( id ).slices ]: val };
			break;
	}
	return [
		obj,
		[ "slices", act, get.pattern( id ).name, val ],
	];
} );
