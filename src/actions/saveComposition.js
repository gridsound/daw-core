"use strict";

DAWCore.prototype.saveComposition = function() {
	if ( this.composition.save() ) {
		const cmp = this.get.composition();

		this._call( "compositionSaved", cmp, true );
		DAWCore.LocalStorage.put( this.get.id(), cmp );
	}
};
