"use strict";

DAWCore.prototype.nameComposition = function( nameBrut ) {
	const name = DAWCore.trim2( nameBrut );

	if ( name && name !== this.get.name() ) {
		this.compositionChange( { name } );
	}
};
