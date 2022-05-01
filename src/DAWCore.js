"use strict";

class DAWCore {
	constructor() {
		this.cb = {};
		this.env = Object.seal( {
			def_bpm: 120,
			def_appGain: 1,
			def_nbTracks: 21,
			def_stepsPerBeat: 4,
			def_beatsPerMeasure: 4,
			sampleRate: 48000,
			analyserFFTsize: 8192,
			analyserEnable: true,
		} );
		this.cmps = {
			local: new Map(),
			cloud: new Map(),
		};
		this.ctx = null;
		this._wadrumrows = new gswaDrumrows();
		this.history = new DAWCore.History( this );
		this.buffers = new DAWCore.Buffers( this );
		this.buffersSlices = new DAWCore.BuffersSlices( this );
		this.destination = new DAWCore.Destination( this );
		this.composition = new DAWCore.Composition( this );
		this.keys = new DAWCore.Keys( this );
		this.drums = new DAWCore.Drums( this );
		this.slices = new DAWCore.Slices( this );
		this._loop = this._loop.bind( this );
		this._loopMs = 1;
		this._focused = this.composition;
		this._focusedStr = "composition";
		this._focusedSwitch = "keys";
		this.get = {
			saveMode: () => this.composition.cmp.options.saveMode,
			currentTime: () => this.composition.currentTime,
			compositions: saveMode => this.cmps[ saveMode ],
			composition: ( saveMode, id ) => this.cmps[ saveMode ].get( id ),
			opened: t => this.composition.cmp[ DAWCore.actionsCommon.patternOpenedByType[ t ] ],
			// .................................................................
			ctx: () => this.ctx,
			audioDestination: () => this.destination.getDestination(),
			audioBuffer: id => this.buffers.getBuffer( this.composition.cmp.buffers[ id ] ).buffer,
			audioSlices: id => this.buffersSlices.getBuffer( id ),
			audioChanIn: id => this.composition._wamixer.getChanInput( id ),
			audioChanOut: id => this.composition._wamixer.getChanOutput( id ),
			audioEffect: id => this.composition._waeffects.getFx( id ),
			audioSynth: id => this.composition._synths.get( id ),
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

		this._wadrumrows.getAudioBuffer = this.get.audioBuffer;
		this._wadrumrows.getChannelInput = this.get.audioChanIn;
		this._wadrumrows.onstartdrum = rowId => this.callCallback( "onstartdrum", rowId );
		this._wadrumrows.onstartdrumcut = rowId => this.callCallback( "onstopdrumrow", rowId );
		this.setLoopRate( 60 );
		this.resetAudioContext();
		this.destination.setGain( this.env.def_appGain );
	}

	// ..........................................................................
	setCtx( ctx ) {
		this.ctx = ctx;
		this.drums._waDrums.setContext( ctx );
		this.slices.setContext( ctx );
		this.keys._waKeys.setContext( ctx );
		this._wadrumrows.setContext( ctx );
		this.destination.setCtx( ctx );
		this.composition.setCtx( ctx );
	}
	resetAudioContext() {
		this.stop();
		this.setCtx( new AudioContext( { sampleRate: this.env.sampleRate } ) );
	}
	envChange( obj ) {
		Object.assign( this.env, obj );
	}
	callAction( action, ...args ) {
		const fn = DAWCore.actions.get( action );

		if ( !fn ) {
			console.error( `DAWCore: undefined action "${ action }"` );
		} else {
			const ret = DAWCore.utils.deepFreeze( fn( ...args, this.get ) );

			if ( Array.isArray( ret ) ) {
				this.history.stackChange( ...ret );
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
	compositionNeedSave() {
		return !this.composition._saved;
	}
	exportCompositionJSON( saveMode, id ) {
		return DAWCore.ExportJSON.export( this.get.composition( saveMode, id ) );
	}
	abortCompositionWAV() {
		if ( this.ctx instanceof OfflineAudioContext ) {
			this.composition.stop();
		}
	}

	// ..........................................................................
	newComposition( opt ) {
		const cmp = DAWCore.json.composition( this.env, DAWCore.utils.uuid() );

		return this.addComposition( cmp, opt )
			.then( cmp => this.composition.load( cmp ) )
			.then( cmp => this._compositionOpened( cmp ) );
	}
	addComposition( cmp, opt ) {
		const cpy = DAWCore.utils.jsonCopy( cmp );

		cpy.options = Object.freeze( {
			saveMode: "local",
			...opt,
		} );
		this.cmps[ cpy.options.saveMode ].set( cpy.id, cpy );
		this.callCallback( "compositionAdded", cpy );
		this.callCallback( "compositionSavedStatus", cpy, true );
		return Promise.resolve( cpy );
	}
	addCompositionByBlob( blob, opt ) {
		return new Promise( ( res, rej ) => {
			const rd = new FileReader();

			rd.onload = () => {
				this.addCompositionByJSON( rd.result, opt ).then( res, rej );
			};
			rd.readAsText( blob );
		} );
	}
	addCompositionByJSON( json, opt ) {
		return new Promise( ( res, rej ) => {
			try {
				const cmp = JSON.parse( json );

				this.addComposition( cmp, opt ).then( res, rej );
			} catch ( e ) {
				rej( e );
			}
		} );
	}
	addCompositionByURL( url, opt ) {
		return fetch( url )
			.then( res => {
				if ( !res.ok ) {
					throw `The file is not accessible: ${ url }`;
				}
				return res.json();
			} )
			.then(
				cmp => this.addComposition( cmp, opt ),
				e => { throw e; }
			);
	}
	addCompositionsFromLocalStorage() {
		return Promise.all( DAWCore.LocalStorage
			.getAll().map( cmp => this.addComposition( cmp ) ) );
	}
	addNewComposition( opt ) {
		return this.addComposition(
			DAWCore.json.composition( this.env, DAWCore.utils.uuid() ), opt );
	}
	openComposition( saveMode, id ) {
		const cmp = this.get.composition( saveMode, id );

		if ( cmp ) {
			if ( this.composition.loaded ) {
				this.closeComposition();
			}
			return ( this.get.composition( saveMode, id ) // 1.
				? Promise.resolve( cmp )
				: this.addNewComposition( { saveMode } ) )
				.then( cmp => this.composition.load( cmp ) )
				.then( cmp => this._compositionOpened( cmp ) );
		}
	}
	_compositionOpened( cmp ) {
		this.focusOn( "composition" );
		this.callCallback( "compositionOpened", cmp );
		this._startLoop();
		return cmp;
	}
	closeComposition() {
		if ( this.composition.loaded ) {
			const cmp = this.cmps[ this.get.saveMode() ].get( this.get.id() );

			this.stop();
			this.keys.clearLoop();
			this.keys.setCurrentTime( 0 );
			this.composition.setCurrentTime( 0 );
			this._stopLoop();
			this.callCallback( "compositionClosed", cmp );
			this.composition.unload();
			this.history.empty();
			this.buffers.empty();
			if ( !cmp.savedAt ) {
				this._deleteComposition( cmp );
			}
		}
	}
	deleteComposition( saveMode, id ) {
		if ( this.composition.cmp && id === this.get.id() ) {
			this.closeComposition();
		}
		this._deleteComposition( this.cmps[ saveMode ].get( id ) );
	}
	_deleteComposition( cmp ) {
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
		const actSave = this.composition._actionSavedOn;

		if ( this.composition.save() ) {
			const cmp = this.get.cmp();
			const id = this.get.id();

			if ( this.get.saveMode() === "local" ) {
				this.cmps.local.set( id, cmp );
				DAWCore.LocalStorage.put( id, cmp );
				this.callCallback( "compositionSavedStatus", cmp, true );
			} else {
				this.composition._saved = false;
				this.callCallback( "compositionLoading", cmp, true );
				( this.callCallback( "compositionSavingPromise", cmp )
				|| Promise.resolve( cmp ) )
					.finally( this.callCallback.bind( this, "compositionLoading", cmp, false ) )
					.then( res => {
						this.composition._saved = true;
						this.cmps.cloud.set( id, cmp );
						this.callCallback( "compositionSavedStatus", cmp, true );
						return res;
					}, err => {
						this.composition._actionSavedOn = actSave;
						this.callCallback( "compositionSavedStatus", cmp, false );
						throw err;
					} );
			}
		}
	}
	exportCompositionToWAV() {
		const ctx = this.ctx;
		const dur = Math.ceil( this.get.duration() / this.get.bps() ) || 1;
		const ctxOff = new OfflineAudioContext( 2, dur * ctx.sampleRate | 0, ctx.sampleRate );

		this.stop();
		if ( DAWCore._URLToRevoke ) {
			URL.revokeObjectURL( DAWCore._URLToRevoke );
		}
		this.setCtx( ctxOff );
		this.composition.play();
		return ctxOff.startRendering().then( buffer => {
			const pcm = gswaEncodeWAV.encode( buffer, { float32: true } );
			const url = URL.createObjectURL( new Blob( [ pcm ] ) );

			this.composition.stop();
			this.setCtx( ctx );
			DAWCore._URLToRevoke = url;
			return {
				url,
				name: `${ this.get.name() || "untitled" }.wav`,
			};
		} );
	}

	// ..........................................................................
	liveChangeChannel( id, prop, val ) {
		this.composition._wamixer.change( { channels: { [ id ]: { [ prop ]: val } } } );
	}
	liveChangeEffect( fxId, prop, val ) {
		this.composition._waeffects.liveChangeFxProp( fxId, prop, val );
	}
	liveChangeSynth( id, obj ) {
		this.composition._synths.get( id ).change( obj );
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
					this.buffersSlices.buffersLoaded( buffersLoaded );
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
		return this._focused;
	}
	getFocusedName() {
		return this._focusedStr;
	}
	getFocusedDuration() {
		return this._focusedStr === "composition"
			? this.get.duration()
			: this.get.patternDuration( this.get.opened( this._focusedStr ) );
	}
	focusSwitch() {
		this.focusOn( this._focusedStr === "composition" ? this._focusedSwitch : "composition", "-f" );
	}
	focusOn( win, f ) {
		switch ( win ) {
			case "keys":
			case "drums":
			case "slices":
				if ( this.get.opened( win ) !== null ) {
					if ( this._focused !== this[ win ] ) {
						this.#focusOn( win, f );
					}
					return;
				}
			case "composition":
				if ( this._focused !== this.composition ) {
					this.#focusOn( "composition", f );
				}
		}
	}
	#focusOn( focusedStr, force ) {
		if ( force === "-f" || !this.isPlaying() ) {
			this.pause();
			this._focused = this[ focusedStr ];
			this._focusedStr = focusedStr;
			if ( focusedStr !== "composition" ) {
				this._focusedSwitch = focusedStr;
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
		this._focused.play();
		this.callCallback( "play", this._focusedStr );
	}
	pause() {
		this._focused.pause();
		this.callCallback( "pause", this._focusedStr );
	}
	stop() {
		this._focused.stop();
		this.callCallback( "stop", this._focusedStr );
		this.callCallback( "currentTime", this._focused.getCurrentTime(), this._focusedStr );
	}
	setSampleRate( sr ) {
		if ( sr !== this.env.sampleRate ) {
			this.env.sampleRate = sr;
			this.resetAudioContext();
		}
	}
	setLoopRate( fps ) {
		this._loopMs = 1000 / fps | 0;
	}

	// ..........................................................................
	_startLoop() {
		this._loop();
	}
	_stopLoop() {
		clearTimeout( this._frameId );
		cancelAnimationFrame( this._frameId );
	}
	_loop() {
		const anData = this.destination.analyserFillData();

		if ( anData ) {
			this.composition.updateChanAudioData();
			this.callCallback( "analyserFilled", anData );
		}
		if ( this.isPlaying() ) {
			const beat = this._focused.getCurrentTime();

			this.callCallback( "currentTime", beat, this._focusedStr );
		}
		this._frameId = this._loopMs < 20
			? requestAnimationFrame( this._loop )
			: setTimeout( this._loop, this._loopMs );
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
*/
