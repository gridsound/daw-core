"use strict";

DAWCore.controllers.slicer = class {
	data = {};
	#dawcore = null;
	#patternId = null;
	#slicesId = null;
	#slicesCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data,
		this.#addSlice.bind( this ),
		this.#updateSlice.bind( this ),
		this.#deleteSlice.bind( this )
	);

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"disabled",
			"timedivision",
			"setBuffer",
			"renameBuffer",
			"removeBuffer",
			"changeDuration",
			"addSlice",
			"removeSlice",
			"changeSlice",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	// .........................................................................
	getPatternId() {
		return this.#patternId;
	}
	setDAWCore( core ) {
		this.#dawcore = core;
	}
	clear() {
		this.#patternId =
		this.#slicesId = null;
		this.on.disabled( true );
		this.on.removeBuffer();
		this.on.changeDuration( 4 );
		Object.keys( this.data ).forEach( this.#deleteSlice, this );
	}
	change( obj ) {
		const get = this.#dawcore.get;

		if ( "beatsPerMeasure" in obj || "stepsPerBeat" in obj ) {
			this.on.timedivision( `${ get.beatsPerMeasure() }/${ get.stepsPerBeat() }` );
		}
		if ( "patternSlicesOpened" in obj ) {
			const id = obj.patternSlicesOpened;

			if ( !id ) {
				this.clear();
			} else {
				const pat = get.pattern( id );

				this.#patternId = id;
				this.#slicesId = pat.slices;
				Object.keys( this.data ).forEach( this.#deleteSlice, this );
				this.#changeSource( pat.source, this.#dawcore );
				this.#slicesCrud( get.slices( this.#slicesId ) );
				this.on.disabled( false );
			}
		} else if ( this.#patternId ) {
			const objPat = obj.patterns?.[ this.#patternId ];

			if ( objPat && "source" in objPat ) {
				this.#changeSource( objPat.source, this.#dawcore );
			} else {
				this.#updateSourceDur( obj, get );
			}
			this.#slicesCrud( obj.slices?.[ this.#slicesId ] );
		}
	}
	#updateSourceDur( obj, get ) {
		const dur = obj.patterns?.[ get.pattern( this.#patternId ).source ]?.duration;

		if ( dur ) {
			this.on.changeDuration( dur );
		}
	}
	#changeSource( srcId, daw ) {
		if ( srcId ) {
			const patSrc = daw.get.pattern( srcId );
			const buf = daw.$getAudioBuffer( patSrc.buffer );

			this.on.setBuffer( buf );
			this.on.renameBuffer( patSrc.name );
			this.on.changeDuration( patSrc.duration );
		} else {
			this.on.removeBuffer();
		}
	}

	// .........................................................................
	#addSlice( id, obj ) {
		const sli = { ...obj };

		this.data[ id ] = sli;
		this.on.addSlice( id, sli );
	}
	#deleteSlice( id ) {
		delete this.data[ id ];
		this.on.removeSlice( id );
	}
	#updateSlice( id, obj ) {
		Object.assign( this.data[ id ], obj );
		this.on.changeSlice( id, obj );
	}
};

Object.freeze( DAWCore.controllers.slicer );
