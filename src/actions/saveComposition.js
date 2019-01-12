"use strict";

DAWCore.prototype.saveComposition = function() {
	const actSave = this.composition._actionSavedOn;

	if ( this.composition.save() ) {
		const cmp = this.get.composition(),
			id = this.get.id(),
			opt = this.compositionsOptions.get( id );

		this.compositions.set( id, cmp );
		if ( opt.localSaving ) {
			DAWCore.LocalStorage.put( id, cmp );
			this._call( "compositionSavedStatus", cmp, true );
		} else {
			this.composition._saved = false;
			this._call( "compositionLoading", cmp, true );
			( this._call( "compositionSavingPromise", cmp )
			|| Promise.resolve( cmp ) )
				.finally( this._call.bind( this, "compositionLoading", cmp, false ) )
				.then( res => {
					this.composition._saved = true;
					this._call( "compositionSavedStatus", cmp, true );
					return res;
				}, err => {
					this.composition._actionSavedOn = actSave;
					this._call( "compositionSavedStatus", cmp, false );
					throw err;
				} );
		}
	}
};
