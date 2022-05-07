"use strict";

class DAWCore {
	cb = {};
	ctx = null;
	cmps = Object.freeze( {
		local: new Map(),
		cloud: new Map(),
	} );
	env = Object.seal( {
		def_bpm: 120,
		def_appGain: 1,
		def_nbTracks: 21,
		def_stepsPerBeat: 4,
		def_beatsPerMeasure: 4,
		sampleRate: 48000,
		analyserFFTsize: 8192,
		analyserEnable: true,
	} );
	#dest = Object.seal( {
		ctx: null,
		gainNode: null,
		inputNode: null,
		analyserNode: null,
		analyserData: null,
		gain: 1,
	} );
	#hist = Object.seal( {
		stack: [],
		stackInd: 0,
	} );
	#slicesBuffers = new Map();
	composition = new DAWCore.Composition( this );
	keys = new DAWCore.Keys( this );
	drums = new DAWCore.Drums( this );
	slices = new DAWCore.Slices( this );
	buffers = new DAWCore.Buffers( this );
	#focused = this.composition;
	#focusedStr = "composition";
	#focusedSwitch = "keys";
	#loopBind = this.#loop.bind( this );
	#loopMs = 1;

	constructor() {
		this.get = {
			saveMode: () => this.composition.cmp.options.saveMode,
			currentTime: () => this.composition.currentTime,
			compositions: saveMode => this.cmps[ saveMode ],
			composition: ( saveMode, id ) => this.cmps[ saveMode ].get( id ),
			opened: t => this.composition.cmp[ DAWCore.actionsCommon.patternOpenedByType[ t ] ],
			// .................................................................
			ctx: () => this.ctx,
			audioDestination: () => this.destinationGetOutput(),
			audioBuffer: id => this.buffers.getBuffer( this.composition.cmp.buffers[ id ] ).buffer,
			audioSlices: id => this.slicesBuffersGetBuffer( id ),
			audioChanIn: id => this.composition.waMixer.getChanInput( id ),
			audioChanOut: id => this.composition.waMixer.getChanOutput( id ),
			audioEffect: id => this.composition.waEffects.getFx( id ),
			audioSynth: id => this.composition.waSynths.get( id ),
			// .................................................................
			cmp: () => this.composition.cmp,
			id: () => this.composition.cmp.id,
			bpm: () => this.composition.cmp.bpm,
			bps: () => this.composition.cmp.bpm / 60,
			name: () => this.composition.cmp.name,
			loopA: () => this.composition.cmp.loopA,
			loopB: () => this.composition.cmp.loopB,
			duration: () => this.composition.cmp.duration,
			beatsPerMeasure: () => this.composition.cmp.beatsPerMeasure,
			stepsPerBeat: () => this.composition.cmp.stepsPerBeat,
			// .................................................................
			block: id => this.composition.cmp.blocks[ id ],
			blocks: () => this.composition.cmp.blocks,
			buffer: id => this.composition.cmp.buffers[ id ],
			buffers: () => this.composition.cmp.buffers,
			channel: id => this.composition.cmp.channels[ id ],
			channels: () => this.composition.cmp.channels,
			slices: id => id ? this.composition.cmp.slices[ id ] : this.composition.cmp.slices, // 1.
			drumrow: id => this.composition.cmp.drumrows[ id ],
			drumrows: () => this.composition.cmp.drumrows,
			drums: id => id ? this.composition.cmp.drums[ id ] : this.composition.cmp.drums, // 1.
			effect: id => this.composition.cmp.effects[ id ],
			effects: () => this.composition.cmp.effects,
			keys: id => id ? this.composition.cmp.keys[ id ] : this.composition.cmp.keys, // 1.
			pattern: id => this.composition.cmp.patterns[ id ],
			patterns: () => this.composition.cmp.patterns,
			synth: id => this.composition.cmp.synths[ id ],
			synths: () => this.composition.cmp.synths,
			track: id => this.composition.cmp.tracks[ id ],
			tracks: () => this.composition.cmp.tracks,
			// .................................................................
			patternDuration: id => {
				const pat = this.get.pattern( id );

				return pat.type !== "slices"
					? pat.duration
					: pat.source
						? this.get.pattern( pat.source ).duration
						: this.get.beatsPerMeasure();
			},
		};
		this.composition.waDrumrows.getAudioBuffer = this.get.audioBuffer;
		this.composition.waDrumrows.getChannelInput = this.get.audioChanIn;
		this.composition.waDrumrows.onstartdrum = rowId => this.callCallback( "onstartdrum", rowId );
		this.composition.waDrumrows.onstartdrumcut = rowId => this.callCallback( "onstopdrumrow", rowId );
		this.setLoopRate( 60 );
		this.resetAudioContext();
		this.destinationSetGain( this.env.def_appGain );
	}

	// ..........................................................................
	destinationGetOutput() {
		return this.#dest.inputNode;
	}
	destinationGetGain() {
		return this.#dest.gain;
	}
	destinationSetCtx( ctx ) {
		DAWCoreDestination.setCtx( this.#dest, this.env.analyserEnable, this.env.analyserFFTsize, ctx );
	}
	destinationSetGain( v ) {
		DAWCoreDestination.setGain( this.#dest, v );
	}
	destinationAnalyserFillData() {
		return DAWCoreDestination.analyserFillData( this.#dest );
	}

	// ..........................................................................
	historyEmpty() {
		DAWCoreHistory.empty( this, this.#hist );
	}
	historyStackChange( redo, msg ) {
		DAWCoreHistory.stackChange( this, this.#hist, redo, msg );
	}
	historyGetCurrentAction() {
		return DAWCoreHistory.getCurrentAction( this.#hist );
	}
	historyUndo() {
		return DAWCoreHistory.undo( this, this.#hist );
	}
	historyRedo() {
		return DAWCoreHistory.redo( this, this.#hist );
	}

	// ..........................................................................
	slicesBuffersClear() {
		this.#slicesBuffers.clear();
	}
	slicesBuffersGetBuffer( patId ) {
		return this.#slicesBuffers.get( patId );
	}
	slicesBuffersChange( obj ) {
		DAWCoreSlicesBuffers.change( this.#slicesBuffers, this.get, obj );
	}
	slicesBuffersBuffersLoaded( buffersLoaded ) {
		DAWCoreSlicesBuffers.buffersLoaded( this.#slicesBuffers, this.get, buffersLoaded );
	}

	// ..........................................................................
	compositionExportJSON( saveMode, id ) {
		return DAWCoreCompositionExportJSON.export( this.get.composition( saveMode, id ) );
	}
	compositionExportWAV() {
		return DAWCoreCompositionExportWAV.export( this );
	}
	compositionAbortWAV() {
		DAWCoreCompositionExportWAV.abort( this );
	}
	compositionNeedSave() {
		return !this.composition.saved;
	}

	// ..........................................................................
	newComposition( opt ) {
		return DAWCoreAddComposition.new( this, opt )
	}
	importCompositionsFromLocalStorage() {
		return DAWCoreAddComposition.LS( this );
	}
	addCompositionByURL( url, opt ) {
		return DAWCoreAddComposition.URL( this, url, opt );
	}
	addCompositionByBlob( blob, opt ) {
		return DAWCoreAddComposition.blob( this, blob, opt );
	}
	addCompositionByJSObject( cmp, opt ) {
		return DAWCoreAddComposition.JSObject( this, blob, opt );
	}

	// ..........................................................................
	liveChangeChannel( id, prop, val ) {
		this.composition.waMixer.change( { channels: { [ id ]: { [ prop ]: val } } } );
	}
	liveChangeEffect( fxId, prop, val ) {
		this.composition.waEffects.liveChangeFxProp( fxId, prop, val );
	}
	liveChangeSynth( id, obj ) {
		this.composition.waSynths.get( id ).change( obj );
	}

	// ..........................................................................
	setCtx( ctx ) {
		this.ctx = ctx;
		this.drums._waDrums.setContext( ctx );
		this.slices.setContext( ctx );
		this.keys._waKeys.setContext( ctx );
		this.composition.waDrumrows.setContext( ctx );
		this.destinationSetCtx( ctx );
		this.composition.setCtx( ctx );
	}
	resetAudioContext() {
		this.stop();
		this.setCtx( new AudioContext( { sampleRate: this.env.sampleRate } ) );
	}

	// ..........................................................................
	callAction( action, ...args ) {
		const fn = DAWCore.actions.get( action );

		if ( !fn ) {
			console.error( `DAWCore: undefined action "${ action }"` );
		} else {
			const ret = DAWCore.utils.deepFreeze( fn( ...args, this.get ) );

			if ( Array.isArray( ret ) ) {
				this.historyStackChange( ...ret );
			} else if ( ret ) {
				const undo = DAWCore.utils.composeUndo( this.get.cmp(), ret );

				this.composition.change( ret, undo );
			}
		}
	}
	callCallback( cbName, ...args ) {
		const fn = this.cb[ cbName ];

		return fn && fn( ...args );
	}

	// ..........................................................................
	openComposition( saveMode, id ) {
		const cmp = this.get.composition( saveMode, id );

		if ( cmp ) {
			if ( this.composition.loaded ) {
				this.closeComposition();
			}
			return ( this.get.composition( saveMode, id ) // 2.
				? Promise.resolve( cmp )
				: this.newComposition( { saveMode } ) )
				.then( cmp => this.composition.load( cmp ) )
				.then( cmp => this.#compositionOpened( cmp ) );
		}
	}
	#compositionOpened( cmp ) {
		this.focusOn( "composition" );
		this.callCallback( "compositionOpened", cmp );
		this.#startLoop();
		return cmp;
	}
	closeComposition() {
		if ( this.composition.loaded ) {
			const cmp = this.cmps[ this.get.saveMode() ].get( this.get.id() );

			this.stop();
			this.keys.clearLoop();
			this.keys.setCurrentTime( 0 );
			this.composition.setCurrentTime( 0 );
			this.#stopLoop();
			this.callCallback( "compositionClosed", cmp );
			this.composition.unload();
			this.historyEmpty();
			this.buffers.empty();
			if ( !cmp.savedAt ) {
				this.#deleteComposition( cmp );
			}
		}
	}
	deleteComposition( saveMode, id ) {
		if ( this.composition.cmp && id === this.get.id() ) {
			this.closeComposition();
		}
		this.#deleteComposition( this.cmps[ saveMode ].get( id ) );
	}
	#deleteComposition( cmp ) {
		if ( cmp ) {
			const saveMode = cmp.options.saveMode;

			this.cmps[ saveMode ].delete( cmp.id );
			if ( saveMode === "local" ) {
				DAWCore.LocalStorage.delete( cmp.id );
			}
			this.callCallback( "compositionDeleted", cmp );
		}
	}
	saveComposition() {
		const actSave = this.composition.actionSavedOn;

		if ( this.composition.save() ) {
			const cmp = this.get.cmp();
			const id = this.get.id();

			if ( this.get.saveMode() === "local" ) {
				this.cmps.local.set( id, cmp );
				DAWCore.LocalStorage.put( id, cmp );
				this.callCallback( "compositionSavedStatus", cmp, true );
			} else {
				this.composition.saved = false;
				this.callCallback( "compositionLoading", cmp, true );
				( this.callCallback( "compositionSavingPromise", cmp )
				|| Promise.resolve( cmp ) )
					.finally( this.callCallback.bind( this, "compositionLoading", cmp, false ) )
					.then( res => {
						this.composition.saved = true;
						this.cmps.cloud.set( id, cmp );
						this.callCallback( "compositionSavedStatus", cmp, true );
						return res;
					}, err => {
						this.composition.actionSavedOn = actSave;
						this.callCallback( "compositionSavedStatus", cmp, false );
						throw err;
					} );
			}
		}
	}

	// ..........................................................................
	dropAudioFiles( files ) {
		const order = this.buffers.getSize();

		this.buffers.loadFiles( files ).then( ( { newBuffers, knownBuffers, failedBuffers } ) => {
			if ( newBuffers.length || knownBuffers.length ) {
				const cmpBuffers = this.get.buffers();
				const bufNextId = +DAWCore.actionsCommon.getNextIdOf( cmpBuffers );
				const patNextId = +DAWCore.actionsCommon.getNextIdOf( this.get.patterns() );
				const buffersLoaded = {};

				if ( newBuffers.length ) {
					const obj = {};

					obj.buffers = {};
					obj.patterns = {};
					newBuffers.forEach( ( buf, i ) => {
						const dotind = buf.name.lastIndexOf( "." );
						const patname = dotind > -1 ? buf.name.substr( 0, dotind ) : buf.name;
						const bufId = bufNextId + i;

						obj.buffers[ bufId ] = {
							MIME: buf.MIME,
							duration: buf.duration,
							hash: buf.hash,
						};
						obj.patterns[ patNextId + i ] = {
							type: "buffer",
							dest: "main",
							buffer: `${ bufId }`,
							duration: Math.ceil( buf.duration * this.get.bps() ),
							name: patname,
							order: order + i,
						};
						buffersLoaded[ bufId ] = this.buffers.getBuffer( buf );
					} );
					this.callAction( "dropBuffers", obj );
				}
				if ( knownBuffers.length ) {
					const bufmap = Object.entries( cmpBuffers )
						.reduce( ( map, [ idBuf, buf ] ) => {
							map.set( buf.hash, idBuf );
							return map;
						}, new Map() );

					knownBuffers.forEach( buf => {
						const idBuf = bufmap.get( buf.hash );

						buffersLoaded[ idBuf ] = this.buffers.getBuffer( buf );
					} );
					this.slicesBuffersBuffersLoaded( buffersLoaded );
				}
				this.callCallback( "buffersLoaded", buffersLoaded );
			}
			if ( failedBuffers.length > 0 ) {
				console.log( "failedBuffers", failedBuffers );
				// show a popup
			}
		} );
	}

	// ..........................................................................
	getFocusedObject() {
		return this.#focused;
	}
	getFocusedName() {
		return this.#focusedStr;
	}
	getFocusedDuration() {
		return this.#focusedStr === "composition"
			? this.get.duration()
			: this.get.patternDuration( this.get.opened( this.#focusedStr ) );
	}
	focusSwitch() {
		this.focusOn( this.#focusedStr === "composition" ? this.#focusedSwitch : "composition", "-f" );
	}
	focusOn( win, f ) {
		switch ( win ) {
			case "keys":
			case "drums":
			case "slices":
				if ( this.get.opened( win ) !== null ) {
					if ( this.#focused !== this[ win ] ) {
						this.#focusOn( win, f );
					}
					return;
				}
			case "composition":
				if ( this.#focused !== this.composition ) {
					this.#focusOn( "composition", f );
				}
		}
	}
	#focusOn( focusedStr, force ) {
		if ( force === "-f" || !this.isPlaying() ) {
			this.pause();
			this.#focused = this[ focusedStr ];
			this.#focusedStr = focusedStr;
			if ( focusedStr !== "composition" ) {
				this.#focusedSwitch = focusedStr;
			}
			this.callCallback( "focusOn", focusedStr );
		}
	}

	// ..........................................................................
	isPlaying() {
		return this.composition.playing || this.keys.playing || this.drums.playing || this.slices.playing;
	}
	togglePlay() {
		this.isPlaying() ? this.pause() : this.play();
	}
	play() {
		this.#focused.play();
		this.callCallback( "play", this.#focusedStr );
	}
	pause() {
		this.#focused.pause();
		this.callCallback( "pause", this.#focusedStr );
	}
	stop() {
		this.#focused.stop();
		this.callCallback( "stop", this.#focusedStr );
		this.callCallback( "currentTime", this.#focused.getCurrentTime(), this.#focusedStr );
	}
	setSampleRate( sr ) {
		if ( sr !== this.env.sampleRate ) {
			this.env.sampleRate = sr;
			this.resetAudioContext();
		}
	}
	setLoopRate( fps ) {
		this.#loopMs = 1000 / fps | 0;
	}

	// ..........................................................................
	#startLoop() {
		this.#loop();
	}
	#stopLoop() {
		clearTimeout( this._frameId );
		cancelAnimationFrame( this._frameId );
	}
	#loop() {
		const anData = this.destinationAnalyserFillData();

		if ( anData ) {
			this.composition.updateChanAudioData();
			this.callCallback( "analyserFilled", anData );
		}
		if ( this.isPlaying() ) {
			const beat = this.#focused.getCurrentTime();

			this.callCallback( "currentTime", beat, this.#focusedStr );
		}
		this._frameId = this.#loopMs < 20
			? requestAnimationFrame( this.#loopBind )
			: setTimeout( this.#loopBind, this.#loopMs );
	}
}

DAWCore.json = { effects: {} };
DAWCore.utils = {};
DAWCore.actions = new Map();
DAWCore.actionsCommon = {};
DAWCore.controllers = {};
DAWCore.controllersFx = {};

/*
1. The getter 'keys', 'drums' and 'slices' can't use their singular form like the others getters
   because 'key' and 'drum' are referring to the objects contained in ONE 'keys' or 'drums'.
   So `keys[0]` is a 'keys' not a 'key', a 'key' would be `keys[0][0]`.
2. Why don't we use `cmp` instead of recalling .get.composition() ?
   Because the `cmp` could have been delete in .closeComposition()
   if the composition was a new untitled composition.
*/
