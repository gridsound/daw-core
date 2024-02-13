"use strict";

DAWCoreActions.set( "addBlock", ( daw, patType, patId, when, track ) => {
	return DAWCoreActionsCommon.addPatternBuffer( daw, patType, patId )
		.then( ( [ patId, patName, patObj ] ) => {
			const nId = DAWCoreActionsCommon.getNextIdOf( daw.$getBlocks() );
			const objBlc = DAWCoreJSON.block( {
				pattern: patId,
				when,
				track,
				duration: patObj
					? patObj.patterns[ patId ].duration
					: daw.$getPatternDuration( patId ),
			} );
			const obj = { blocks: { [ nId ]: objBlc } };
			const dur = DAWCoreActionsCommon.calcNewDuration( daw, obj );

			if ( dur !== daw.$getDuration() ) {
				obj.duration = dur;
			}
			return [
				Object.assign( obj, patObj ),
				[ "blocks", "addBlock", patName ],
			];
		} );
} );
