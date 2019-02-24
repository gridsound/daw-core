"use strict";

DAWCore.Mixer = class {
	constructor( daw ) {
		const mixer = new gswaMixer();

		this.daw = daw;
		this.mixer = mixer;
	}

	setCtx( ctx ) {
		this.mixer.setContext( ctx );
	}
};
