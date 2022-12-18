"use strict";

const DAWCoreJSON = { effects: {} };
const DAWCoreUtils = {};
const DAWCoreActions = new Map();
const DAWCoreActionsCommon = {};
const DAWCoreControllers = {};
const DAWCoreControllersFx = {};

class DAWCore {
	static #dropExtensions = Object.freeze( { gs: true, txt: true, json: true } );
	cb = {};
	ctx = null;
	#cmpsLocal = new Map();
	#cmpsCloud = new Map();
	#slicesBuffers = new Map();
	#waMixer = new gswaMixer();
	#waSynths = new Map();
	#waDrumrows = new gswaDrumrows();
	#waEffects = new gswaEffects( {
		getChanInput: this.#waMixer.$getChanInput.bind( this.#waMixer ),
		getChanOutput: this.#waMixer.$getChanOutput.bind( this.#waMixer ),
	} );
	$env = Object.seal( {
		$defBPM: 120,
		$defAppGain: 1,
		$defNbTracks: 21,
		$defStepsPerBeat: 4,
		$defBeatsPerMeasure: 4,
		$sampleRate: 48000,
		$analyserFFTsize: 8192,
		$analyserEnable: true,
	} );
	#dest = Object.seal( {
		$ctx: null,
		$gainNode: null,
		$inputNode: null,
		$analyserNode: null,
		$analyserData: null,
		$gain: 1,
	} );
	#hist = Object.seal( {
		$stack: [],
		$stackInd: 0,
	} );
	#buffers = Object.seal( {
		$absn: null,
		$objs: new Map(),
		$buffers: new Map(),
	} );
	#slices = Object.seal( {
		$waSched: new gswaScheduler(),
		$startedBuffers: new Map(),
		$duration: 4,
		$playing: false,
		$looping: false,
		$loopA: null,
		$loopB: null,
	} );
	#keys = Object.seal( {
		$waKeys: new gswaKeysScheduler(),
		$keysStartedLive: {},
		$looping: false,
		$playing: false,
		$synth: null,
		$loopA: null,
		$loopB: null,
		$duration: 0,
	} );
	#drums = Object.seal( {
		$waDrums: new gswaDrumsScheduler(),
		$looping: false,
		$playing: false,
		$loopA: null,
		$loopB: null,
		$duration: 0,
	} );
	#composition = Object.seal( {
		$waSched: new gswaScheduler(),
		$startedSched: new Map(),
		$startedBuffers: new Map(),
		$cmp: null,
		$loaded: false,
		$playing: false,
		$saved: true,
		$actionSavedOn: null,
	} );
	#focusedStr = "composition";
	#focusedSwitch = "keys";
	#loopBind = this.#loop.bind( this );
	#loopMs = 1;
	#frameId = null;

	// .........................................................................
	$getCompositions( saveMode ) { return this.$getCmps( saveMode ); }
	$getComposition( saveMode, id ) { return this.$getCmps( saveMode ).get( id ); }
	$getSaveMode() { return this.#composition.$cmp.options.saveMode; }
	$getOpened( t ) { return this.#composition.$cmp[ DAWCoreActionsCommon.patternOpenedByType[ t ] ]; }
	// .........................................................................
	$getCtx() { return this.ctx; }
	$getAudioDestination() { return this.#dest.$inputNode; }
	$getAudioDestinationGain() { return this.#dest.$gain; }
	$getAudioEffects() { return this.#waEffects; }
	$getAudioEffect( id ) { return this.#waEffects.$getFx( id ); }
	$getAudioSynths() { return this.#waSynths; }
	$getAudioSynth( id ) { return this.#waSynths.get( id ); }
	$getAudioDrumrows() { return this.#waDrumrows; }
	$getAudioMixer() { return this.#waMixer; }
	$getAudioChanIn( id ) { return this.#waMixer.$getChanInput( id ); }
	$getAudioChanOut( id ) { return this.#waMixer.$getChanOutput( id ); }
	$getAudioSlices( id ) { return this.$slicesBuffersGetBuffer( id ); }
	$getAudioBuffer( id ) { return this.#buffers.$buffers.get( this.$getBuffer( id ).url || this.$getBuffer( id ).hash ); }
	// .........................................................................
	$getCmps( saveMode ) { return saveMode === "local" ? this.#cmpsLocal : this.#cmpsCloud; }
	$getCmp() { return this.#composition.$cmp; }
	$getName() { return this.#composition.$cmp.name; }
	$getLoopA() { return this.#composition.$cmp.loopA; }
	$getLoopB() { return this.#composition.$cmp.loopB; }
	$getDuration() { return this.#composition.$cmp.duration; }
	$getId() { return this.#composition.$cmp.id; }
	$getBPM() { return this.#composition.$cmp.bpm; }
	$getBPS() { return this.#composition.$cmp.bpm / 60; }
	$getTimedivision() { return this.#composition.$cmp.timedivision; }
	$getBeatsPerMeasure() { return +this.#composition.$cmp.timedivision.split( "/" )[ 0 ]; }
	$getStepsPerBeat() { return +this.#composition.$cmp.timedivision.split( "/" )[ 1 ]; }
	// .........................................................................
	$getBlocks() { return this.#composition.$cmp.blocks; }
	$getBlock( id ) { return this.#composition.$cmp.blocks[ id ]; }
	$getBuffers() { return this.#composition.$cmp.buffers; }
	$getBuffer( id ) { return this.#composition.$cmp.buffers[ id ]; }
	$getChannels() { return this.#composition.$cmp.channels; }
	$getChannel( id ) { return this.#composition.$cmp.channels[ id ]; }
	$getSlices( id ) { return id ? this.#composition.$cmp.slices[ id ] : this.#composition.$cmp.slices; } // 1.
	$getDrumrows() { return this.#composition.$cmp.drumrows; }
	$getDrumrow( id ) { return this.#composition.$cmp.drumrows[ id ]; }
	$getDrums( id ) { return id ? this.#composition.$cmp.drums[ id ] : this.#composition.$cmp.drums; } // 1.
	$getEffects() { return this.#composition.$cmp.effects; }
	$getEffect( id ) { return this.#composition.$cmp.effects[ id ]; }
	$getKeys( id ) { return id ? this.#composition.$cmp.keys[ id ] : this.#composition.$cmp.keys; } // 1.
	$getPatterns() { return this.#composition.$cmp.patterns; }
	$getPattern( id ) { return this.#composition.$cmp.patterns[ id ]; }
	$getSynths() { return this.#composition.$cmp.synths; }
	$getSynth( id ) { return this.#composition.$cmp.synths[ id ]; }
	$getTracks() { return this.#composition.$cmp.tracks; }
	$getTrack( id ) { return this.#composition.$cmp.tracks[ id ]; }
	$getItemByType( type, id ) { return this.$getListByType( type )[ id ]; }
	$getListByType( type ) {
		switch ( type ) {
			case "keys": return this.$getKeys();
			case "drums": return this.$getDrums();
			case "slices": return this.$getSlices();
			case "buffer": return this.$getBuffers();
		}
	}
	$getBlocksOrderedByTracks() {
		const blcs = this.$getBlocks();
		const trcks = {};

		Object.entries( blcs ).forEach( ( [ idBlc, blc ] ) => {
			if ( blc.track in trcks ) {
				trcks[ blc.track ][ idBlc ] = blc;
			} else {
				trcks[ blc.track ] = { [ idBlc ]: blc };
			}
		} );
		return trcks;
	}
	// .........................................................................
	$getPatternDuration( id ) {
		const pat = this.$getPattern( id );

		return pat.type !== "slices"
			? pat.duration
			: pat.source
				? this.$getPattern( pat.source ).duration
				: this.$getBeatsPerMeasure();
	}

	// .........................................................................
	constructor() {
		DAWCoreComposition.$init( this, this.#composition );
		this.#waDrumrows.$getAudioBuffer = this.$getAudioBuffer.bind( this );
		this.#waDrumrows.$getChannelInput = this.$getAudioChanIn.bind( this );
		this.#waDrumrows.$onstartdrum = rowId => this.$callCallback( "onstartdrum", rowId );
		this.#waDrumrows.$onstartdrumcut = rowId => this.$callCallback( "onstopdrumrow", rowId );
		this.#drums.$waDrums.$setDrumrows( this.#waDrumrows );
		DAWCoreSlices.$init( this, this.#slices );
		this.$setLoopRate( 60 );
		this.$resetAudioContext();
		this.$destinationSetGain( this.$env.$defAppGain );
	}

	// .........................................................................
	$destinationSetGain( v ) {
		DAWCoreDestination.$setGain( this.#dest, v );
	}
	$destinationAnalyserFillData() {
		return DAWCoreDestination.$analyserFillData( this.#dest );
	}

	// .........................................................................
	$historyEmpty() {
		DAWCoreHistory.$empty( this, this.#hist );
	}
	$historyStackChange( redo, msg ) {
		DAWCoreHistory.$stackChange( this, this.#hist, redo, msg );
	}
	$historyGetCurrentAction() {
		return DAWCoreHistory.$getCurrentAction( this.#hist );
	}
	$historyUndo() {
		return DAWCoreHistory.$undo( this, this.#hist );
	}
	$historyRedo() {
		return DAWCoreHistory.$redo( this, this.#hist );
	}

	// .........................................................................
	$buffersChange( obj, prevObj ) {
		DAWCoreBuffers.$change( this, this.#buffers, obj, prevObj );
	}
	$buffersEmpty() {
		this.#buffers.$objs.clear();
		this.#buffers.$buffers.clear();
	}
	$buffersGetSize() {
		return this.#buffers.$objs.size;
	}
	$buffersLoadURLBuffer( url ) {
		return DAWCoreBuffers.$loadURLBuffer( this, this.#buffers, url );
	}
	$buffersGetAudioBuffer( hash ) {
		return DAWCoreBuffers.$getAudioBuffer( this, this.#buffers, hash );
	}
	$buffersSetBuffer( objBuf ) {
		return DAWCoreBuffers.$setBuffer( this, this.#buffers, objBuf );
	}
	$buffersPlayBuffer( hash ) {
		return DAWCoreBuffers.$playBuffer( this, this.#buffers, hash );
	}
	$buffersStopBuffer() {
		return DAWCoreBuffers.$stopBuffer( this.#buffers );
	}

	// .........................................................................
	$slicesBuffersClear() {
		this.#slicesBuffers.clear();
	}
	$slicesBuffersGetBuffer( patId ) {
		return this.#slicesBuffers.get( patId );
	}
	$slicesBuffersChange( obj ) {
		DAWCoreSlicesBuffers.$change( this, this.#slicesBuffers, obj );
	}
	$slicesBuffersBuffersLoaded( buffersLoaded ) {
		DAWCoreSlicesBuffers.$buffersLoaded( this, this.#slicesBuffers, buffersLoaded );
	}

	// .........................................................................
	$compositionExportJSON( saveMode, id ) {
		return DAWCoreCompositionExportJSON.$export( this.$getComposition( saveMode, id ) );
	}
	$compositionExportWAV() {
		return DAWCoreCompositionExportWAV.$export( this );
	}
	$compositionAbortWAV() {
		DAWCoreCompositionExportWAV.$abort( this );
	}
	$compositionNeedSave() {
		return !this.#composition.$saved;
	}

	// .........................................................................
	$newComposition( opt ) {
		return DAWCoreAddComposition.$new( this, opt );
	}
	$importCompositionsFromLocalStorage() {
		return DAWCoreAddComposition.$LS( this );
	}
	$addCompositionByURL( url, opt ) {
		return DAWCoreAddComposition.$URL( this, url, opt );
	}
	$addCompositionByBlob( blob, opt ) {
		return DAWCoreAddComposition.$blob( this, blob, opt );
	}
	$addCompositionByJSObject( cmp, opt ) {
		return DAWCoreAddComposition.$JSObject( this, cmp, opt );
	}

	// .........................................................................
	$compositionLoad( cmpOri ) {
		return DAWCoreComposition.$load( this, this.#composition, cmpOri );
	}
	$compositionUnload() {
		DAWCoreComposition.$unload( this, this.#composition );
	}
	$compositionSave() {
		return DAWCoreComposition.$save( this, this.#composition );
	}
	$compositionUpdateChanAudioData() {
		DAWCoreComposition.$updateChanAudioData( this );
	}
	$compositionGetCurrentTime() {
		return DAWCoreComposition.$getCurrentTime( this.#composition );
	}
	$compositionSetCurrentTime( t ) {
		DAWCoreComposition.$setCurrentTime( this, this.#composition, t );
	}
	$compositionPlay() {
		DAWCoreComposition.$play( this, this.#composition );
	}
	$compositionPause() {
		DAWCoreComposition.$pause( this.#composition );
	}
	$compositionStop() {
		DAWCoreComposition.$stop( this, this.#composition );
	}
	$compositionChange( obj, prevObj ) {
		return DAWCoreComposition.$change( this, this.#composition, obj, prevObj );
	}

	// .........................................................................
	$liveChangeChannel( id, prop, val ) {
		this.#waMixer.$change( { channels: { [ id ]: { [ prop ]: val } } } );
	}
	$liveChangeEffect( fxId, prop, val ) {
		this.#waEffects.$liveChangeFxProp( fxId, prop, val );
	}
	$liveChangeSynth( id, obj ) {
		this.#waSynths.get( id ).$change( obj );
	}
	$liveKeydown( midi ) {
		DAWCoreKeys.$liveKeydown( this.#keys, midi );
	}
	$liveKeyup( midi ) {
		DAWCoreKeys.$liveKeyup( this.#keys, midi );
	}
	$liveDrumrowChange( rowId, prop, val ) {
		DAWCoreDrums.$liveDrumrowChange( this, rowId, prop, val );
	}
	$liveDrumStart( rowId ) {
		DAWCoreDrums.$liveDrumStart( this, rowId );
	}
	$liveDrumStop( rowId ) {
		DAWCoreDrums.$liveDrumStop( this, rowId );
	}

	// .........................................................................
	$keysChange( patObj, keysObj ) {
		DAWCoreKeys.$change( this.#keys, patObj, keysObj );
	}
	$keysSetSynth( id ) {
		DAWCoreKeys.$setSynth( this, this.#keys, id );
	}
	$keysOpenPattern( id ) {
		DAWCoreKeys.$openPattern( this, this.#keys, id );
	}
	$keysGetCurrentTime() {
		return DAWCoreKeys.$getCurrentTime( this.#keys );
	}
	$keysSetCurrentTime( t ) {
		DAWCoreKeys.$setCurrentTime( this, this.#keys, t );
	}
	$keysSetBPM( bpm ) {
		this.#keys.$waKeys.scheduler.$setBPM( bpm );
	}
	$keysSetLoop( a, b ) {
		DAWCoreKeys.$setLoop( this.#keys, a, b );
	}
	$keysClearLoop() {
		DAWCoreKeys.$clearLoop( this, this.#keys );
	}
	$keysPlay() {
		DAWCoreKeys.$play( this.#keys );
	}
	$keysPause() {
		DAWCoreKeys.$pause( this.#keys );
	}
	$keysStop() {
		DAWCoreKeys.$stop( this, this.#keys );
	}

	// ..........................................................................
	$drumsChange( objChange ) {
		DAWCoreDrums.$change( this, this.#drums, objChange );
	}
	$drumsGetCurrentTime() {
		return DAWCoreDrums.$getCurrentTime( this.#drums );
	}
	$drumsSetCurrentTime( t ) {
		DAWCoreDrums.$setCurrentTime( this, this.#drums, t );
	}
	$drumsSetLoop( a, b ) {
		DAWCoreDrums.$setLoop( this.#drums, a, b );
	}
	$drumsClearLoop() {
		DAWCoreDrums.$clearLoop( this, this.#drums );
	}
	$drumsPlay() {
		DAWCoreDrums.$play( this.#drums );
	}
	$drumsPause() {
		DAWCoreDrums.$pause( this.#drums );
	}
	$drumsStop() {
		DAWCoreDrums.$stop( this, this.#drums );
	}

	// ..........................................................................
	$slicesChange( obj ) {
		DAWCoreSlices.$change( this, this.#slices, obj );
	}
	$slicesGetCurrentTime() {
		return DAWCoreSlices.$getCurrentTime( this.#slices );
	}
	$slicesSetCurrentTime( t ) {
		DAWCoreSlices.$setCurrentTime( this, this.#slices, t );
	}
	$slicesSetLoop( a, b ) {
		DAWCoreSlices.$setLoop( this.#slices, a, b );
	}
	$slicesClearLoop() {
		DAWCoreSlices.$clearLoop( this, this.#slices );
	}
	$slicesPlay() {
		DAWCoreSlices.$play( this.#slices );
	}
	$slicesPause() {
		DAWCoreSlices.$pause( this.#slices );
	}
	$slicesStop() {
		DAWCoreSlices.$stop( this, this.#slices );
	}

	// .........................................................................
	$setContext( ctx ) {
		this.ctx = ctx;
		this.#drums.$waDrums.$setContext( ctx );
		DAWCoreSlices.$setContext( this.#slices, ctx );
		this.#keys.$waKeys.$setContext( ctx );
		this.#waDrumrows.$setContext( ctx );
		DAWCoreDestination.$setContext( this.#dest, this.$env.$analyserEnable, this.$env.$analyserFFTsize, ctx );
		gswaPeriodicWaves.$clearCache();
		this.#waMixer.$setContext( ctx ); // 3.
		this.#waMixer.$connect( this.$getAudioDestination() );
		this.#waEffects.$setContext( ctx );
		this.#waSynths.forEach( ( syn, synId ) => {
			syn.$setContext( ctx );
			syn.$output.disconnect();
			syn.$output.connect( this.$getAudioChanIn( this.$getSynth( synId ).dest ) );
		} );
	}
	$resetAudioContext() {
		this.$stop();
		this.$setContext( new AudioContext( { sampleRate: this.$env.$sampleRate } ) );
	}

	// .........................................................................
	$callAction( action, ...args ) {
		const fn = DAWCoreActions.get( action );

		if ( !fn ) {
			console.error( `DAWCore: undefined action "${ action }"` );
		} else {
			const ret = DAWCoreUtils.$deepFreeze( fn( this, ...args ) );

			if ( Array.isArray( ret ) ) {
				this.$historyStackChange( ...ret );
				return ret[ 0 ];
			}
			if ( ret ) {
				this.$compositionChange( ret, DAWCoreUtils.$composeUndo( this.$getCmp(), ret ) );
				return ret;
			}
		}
	}
	$callCallback( cbName, ...args ) {
		const fn = this.cb[ cbName ];

		return fn && fn( ...args );
	}

	// .........................................................................
	$openComposition( saveMode, id ) {
		const cmp = this.$getComposition( saveMode, id );

		if ( cmp ) {
			if ( this.#composition.$loaded ) {
				this.$closeComposition();
			}
			return ( this.$getComposition( saveMode, id ) // 2.
				? Promise.resolve( cmp )
				: this.$newComposition( { saveMode } ) )
				.then( cmp => this.$compositionLoad( cmp ) )
				.then( cmp => this.#compositionOpened( cmp ) );
		}
	}
	#compositionOpened( cmp ) {
		this.$focusOn( "composition" );
		this.$callCallback( "compositionOpened", cmp );
		this.#startLoop();
		return cmp;
	}
	$closeComposition() {
		if ( this.#composition.$loaded ) {
			const cmp = this.$getCmps( this.$getSaveMode() ).get( this.$getId() );

			this.$stop();
			this.$keysClearLoop();
			this.$keysSetCurrentTime( 0 );
			this.$compositionSetCurrentTime( 0 );
			this.#stopLoop();
			this.$callCallback( "compositionClosed", cmp );
			this.$compositionUnload();
			this.$historyEmpty();
			this.$buffersEmpty();
			if ( !cmp.savedAt ) {
				this.#deleteComposition( cmp );
			}
		}
	}
	$deleteComposition( saveMode, id ) {
		if ( this.#composition.$cmp && id === this.$getId() ) {
			this.$closeComposition();
		}
		this.#deleteComposition( this.$getCmps( saveMode ).get( id ) );
	}
	#deleteComposition( cmp ) {
		if ( cmp ) {
			const saveMode = cmp.options.saveMode;

			this.$getCmps( saveMode ).delete( cmp.id );
			if ( saveMode === "local" ) {
				DAWCoreLocalStorage.$delete( cmp.id );
			}
			this.$callCallback( "compositionDeleted", cmp );
		}
	}
	$saveComposition() {
		const actSave = this.#composition.$actionSavedOn;

		if ( this.$compositionSave() ) {
			const cmp = this.$getCmp();
			const id = this.$getId();

			if ( this.$getSaveMode() === "local" ) {
				this.#cmpsLocal.set( id, cmp );
				DAWCoreLocalStorage.$put( id, cmp );
				this.$callCallback( "compositionSavedStatus", cmp, true );
			} else {
				this.#composition.$saved = false;
				this.$callCallback( "compositionLoading", cmp, true );
				( this.$callCallback( "compositionSavingPromise", cmp )
				|| Promise.resolve( cmp ) )
					.finally( this.$callCallback.bind( this, "compositionLoading", cmp, false ) )
					.then( res => {
						this.#composition.$saved = true;
						this.#cmpsCloud.set( id, cmp );
						this.$callCallback( "compositionSavedStatus", cmp, true );
						return res;
					}, err => {
						this.#composition.$actionSavedOn = actSave;
						this.$callCallback( "compositionSavedStatus", cmp, false );
						throw err;
					} );
			}
		}
	}

	// .........................................................................
	$dropFiles( promFiles ) {
		DAWCoreBuffers.$dropBuffers( this, this.#buffers, promFiles )
			.then( arr => {
				this.$callCallback( "buffersDropped", arr );
				return promFiles;
			} )
			.then( files => {
				const file = files.find( f => f.name.split( "." ).pop().toLowerCase() in DAWCore.#dropExtensions );

				return file && this.$addCompositionByBlob( file );
			} )
			.then( cmp => cmp && this.$openComposition( "local", cmp.id ) );
	}

	// .........................................................................
	$getFocusedName() {
		return this.#focusedStr;
	}
	$getFocusedDuration() {
		return this.#focusedStr === "composition"
			? this.$getDuration()
			: this.$getPatternDuration( this.$getOpened( this.#focusedStr ) );
	}
	$focusSwitch() {
		this.$focusOn( this.#focusedStr === "composition" ? this.#focusedSwitch : "composition", "-f" );
	}
	$focusOn( win, f ) {
		switch ( win ) {
			case "keys":
			case "drums":
			case "slices":
				if ( this.$getOpened( win ) !== null ) {
					if ( this.#focusedStr !== win ) {
						this.#focusOn( win, f );
					}
					return;
				}
			case "composition":
				if ( this.#focusedStr !== "composition" ) {
					this.#focusOn( "composition", f );
				}
		}
	}
	#focusOn( focusedStr, force ) {
		if ( force === "-f" || !this.$isPlaying() ) {
			this.$pause();
			this.#focusedStr = focusedStr;
			if ( focusedStr !== "composition" ) {
				this.#focusedSwitch = focusedStr;
			}
			this.$callCallback( "focusOn", focusedStr );
		}
	}

	// .........................................................................
	$getCurrentTime() {
		switch ( this.#focusedStr ) {
			case "keys": return this.$keysGetCurrentTime();
			case "drums": return this.$drumsGetCurrentTime();
			case "slices": return this.$slicesGetCurrentTime();
			case "composition": return this.$compositionGetCurrentTime();
		}
	}
	$setCurrentTime( t ) {
		switch ( this.#focusedStr ) {
			case "keys": this.$keysSetCurrentTime( t ); break;
			case "drums": this.$drumsSetCurrentTime( t ); break;
			case "slices": this.$slicesSetCurrentTime( t ); break;
			case "composition": this.$compositionSetCurrentTime( t ); break;
		}
	}
	$isPlaying() {
		return this.#composition.$playing || this.#keys.$playing || this.#drums.$playing || this.#slices.$playing;
	}
	$togglePlay() {
		this.$isPlaying() ? this.$pause() : this.$play();
	}
	$play() {
		switch ( this.#focusedStr ) {
			case "keys": this.$keysPlay(); break;
			case "drums": this.$drumsPlay(); break;
			case "slices": this.$slicesPlay(); break;
			case "composition": this.$compositionPlay(); break;
		}
		this.$callCallback( "play", this.#focusedStr );
	}
	$pause() {
		switch ( this.#focusedStr ) {
			case "keys": this.$keysPause(); break;
			case "drums": this.$drumsPause(); break;
			case "slices": this.$slicesPause(); break;
			case "composition": this.$compositionPause(); break;
		}
		this.$callCallback( "pause", this.#focusedStr );
	}
	$stop() {
		switch ( this.#focusedStr ) {
			case "keys": this.$keysStop(); break;
			case "drums": this.$drumsStop(); break;
			case "slices": this.$slicesStop(); break;
			case "composition": this.$compositionStop(); break;
		}
		this.$buffersStopBuffer();
		this.$callCallback( "stop", this.#focusedStr );
		this.$callCallback( "currentTime", this.$getCurrentTime(), this.#focusedStr );
	}
	$setSampleRate( sr ) {
		if ( sr !== this.$env.$sampleRate ) {
			this.$env.$sampleRate = sr;
			this.$resetAudioContext();
		}
	}
	$setLoopRate( fps ) {
		this.#loopMs = 1000 / fps | 0;
	}

	// .........................................................................
	#startLoop() {
		this.#loop();
	}
	#stopLoop() {
		clearTimeout( this.#frameId );
		cancelAnimationFrame( this.#frameId );
	}
	#loop() {
		const anData = this.$destinationAnalyserFillData();

		if ( anData ) {
			this.$compositionUpdateChanAudioData();
			this.$callCallback( "analyserFilled", anData );
		}
		if ( this.$isPlaying() ) {
			const beat = this.$getCurrentTime();

			this.$callCallback( "currentTime", beat, this.#focusedStr );
		}
		this.#frameId = this.#loopMs < 20
			? requestAnimationFrame( this.#loopBind )
			: setTimeout( this.#loopBind, this.#loopMs );
	}
}

/*
1. The getter 'keys', 'drums' and 'slices' can't use their singular form like the others getters
   because 'key' and 'drum' are referring to the objects contained in ONE 'keys' or 'drums'.
   So `keys[0]` is a 'keys' not a 'key', a 'key' would be `keys[0][0]`.
2. Why don't we use `cmp` instead of recalling .$getComposition() ?
   Because the `cmp` could have been delete in .$closeComposition()
   if the composition was a new untitled composition.
3. The order between the mixer and the effects is important.
*/
