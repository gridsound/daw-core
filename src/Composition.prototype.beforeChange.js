"use strict";

DAWCore.Composition.prototype.beforeChange = function( obj ) {
	this.beforeChange.fn.forEach( ( fn, attr ) => {
		if ( typeof attr === "string" ) {
			if ( attr in obj ) {
				fn.call( this, obj, this.cmp );
			}
		} else if ( attr.some( attr => attr in obj ) ) {
			fn.call( this, obj, this.cmp );
		}
	} );
	return obj;
};

DAWCore.Composition.prototype.beforeChange.fn = new Map( [
	[ "channels", function( obj, cmp ) {
		const synths = Object.entries( cmp.synths ),
			objSynths = {};

		Object.entries( obj.channels ).forEach( ( [ chanId, chanObj ] ) => {
			if ( !chanObj ) {
				synths.forEach( kv => {
					if ( kv[ 1 ].dest === chanId ) {
						objSynths[ kv[ 0 ] ] = { dest: "main" };
					}
				} );
			}
		} );
		if ( !DAWCore.objectIsEmpty( objSynths ) ) {
			obj.synths = objSynths;
		}
	} ],
] );
