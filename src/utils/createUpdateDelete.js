"use strict";

DAWCore.utils.createUpdateDelete = ( dataSrc, fnCreate, fnUpdate, fnDelete, dataChange ) => {
	if ( dataChange ) {
		Object.entries( dataChange ).forEach( ( [ id, obj ] ) => {
			if ( !obj ) {
				if ( id in dataSrc ) {
					fnDelete( id, dataChange );
				}
			} else if ( id in dataSrc ) {
				fnUpdate( id, obj, dataChange );
			} else {
				fnCreate( id, obj, dataChange );
			}
		} );
	}
};
