"use strict";

DAWCore.prototype.addCompositionsFromLocalStorage = function() {
	return Promise.all( DAWCore.LocalStorage
		.getAll().map( this.addComposition.bind( this ) ) );
};
