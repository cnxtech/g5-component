/**
 *
 * @module events/master
 * @author Greg Babula [greg.babula@mlb.com]
 * @description event communication hub, mediates events between master, model, and viewModel
 *
 */

import size from 'lodash.size';
import each from 'lodash.foreach';
import every from 'lodash.every';
import utils from './../utils/master';
import { EventEmitter } from 'events';
import dependencies from './../dependencies/container';

/**
 *
 * @function hasEventEmitter
 * @param {Object} obj
 * @description returns true if given obj has an instance of EventEmitter
 * @returns {Boolean}
 *
 */
function hasEventEmitter(obj) {

    return obj && obj instanceof EventEmitter;

}

/**
 *
 * @function detachEvents
 * @param {Object} target
 * @description checks if a given target has events, proceeds to remove if true
 *
 */
function detachEvents(target) {

    const hasEvents = target && hasEventEmitter(target) && size(target._events);

    if (hasEvents) {
        target.removeAllListeners();
    }

}

/**
 *
 * @class EventTower
 * @description mediates events between master, model and viewModel
 *
 */
class EventTower {

    /**
     *
     * @param {Object} master
     *
     */
    constructor(master) {

        this.master = master;
        this.model = master && master.model || {};
        this.viewModel = master && master.viewModel || {};

        //
        // ensure all targets have an instance of
        // EventEmitter before proceeding to attach events
        //
        if (every([this.master, this.model, this.viewModel], hasEventEmitter)) {

            //
            // attach events to a single instnace
            //
            if (!this.master.hasInstance()) {
                this.attachEvents();
            }

        } else {

            if (this.master) {
                throw Error('EventEmitter is required on all main Constructors');
            }

        }

    }

    /**
     *
     * @method attachEvents
     * @description core attachEvents method, attaches core and extender events
     * @returns {Object} this
     *
     */
    attachEvents() {

        const { master, model, viewModel } = this;

        utils.log('attach events');

        dependencies.eventGroup(master, model, viewModel);
        dependencies.eventGroupExtender(master, model, viewModel);

        // require('./group/group')(master, model, viewModel);
        // require('./group/extender')(master, model, viewModel);

        return this;

    }

    /**
     *
     * @method detachEvents
     * @description detaches all events
     * @returns {Object} this
     *
     */
    detachEvents() {

        const _eventGroup = [this.master, this.model, this.viewModel];

        utils.log('detach events');

        each(_eventGroup, (obj) => {
            detachEvents(obj);
        });

        return this;

    }
}

export default EventTower;
