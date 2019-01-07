"use strict";

DAWCore.prototype.addCompositionsFromLocalStorage = function() {
	return Promise.all( DAWCore.LocalStorage
		.getAll().map( cmp => this.addComposition( cmp ) ) );
};
