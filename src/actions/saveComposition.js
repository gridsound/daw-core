"use strict";

DAWCore.prototype.saveComposition = function() {
	if ( this.composition.save() ) {
		const cmp = this.get.composition(),
			id = this.get.id(),
			opt = this.compositionsOptions.get( id );

		this.compositions.set( id, cmp );
		this._call( "compositionSaved", cmp, true );
		if ( opt.localSaving ) {
			DAWCore.LocalStorage.put( id, cmp );
		}
	}
};
