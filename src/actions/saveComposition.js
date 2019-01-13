"use strict";

DAWCore.prototype.saveComposition = function() {
	const actSave = this.composition._actionSavedOn;

	if ( this.composition.save() ) {
		const cmp = this.get.composition(),
			saveMode = this.get.saveMode(),
			id = this.get.id();

		this.cmps[ saveMode ].set( id, cmp );
		if ( saveMode === "local" ) {
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
