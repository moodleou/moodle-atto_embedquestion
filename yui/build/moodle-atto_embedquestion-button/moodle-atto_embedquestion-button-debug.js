YUI.add('moodle-atto_embedquestion-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_embedquestion
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_embedquestion-button
 */

var COMPONENTNAME = 'atto_embedquestion',
    WRAPPER = 'atto-embedquestion-question-selector-wrapper',
    BUTTON = 'atto-embedquestion-submit-button';

/**
 * Atto text editor embedquestion plugin.
 *
 * @namespace M.atto_embedquestion
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_embedquestion').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current selection range at the time that the dialogue was opened.
     *
     * @type Range
     */
    currentSelection: null,

    /**
     * A local variable ensuring some things are only added once.
     */
    doneOnce: false,
    qForm: false,

    initializer: function() {
        var contextId, elementId;
        if (!this.get('enablebutton')) {
            return;
        }
        contextId = this.get('contextid');
        elementId = this.get('elementid');
        this.addButton({
            icon: 'icon',
            iconComponent: COMPONENTNAME,
            callback: this.displayDialogue
        });
        Y.M.atto_embedquestion.form = {};
        // Initialise the amd javascript that will insert the moodle form in the dialogue.
        // This needs to happen during init to make a reference to it available in later functions below.
        require(['atto_embedquestion/qform'], function(qform) {
            qform.setContextId(contextId);
            // Note we need a reference to qform, but cannot use this.qForm as all the functions within
            // this class are private so not accessible from AMD code. At least this is not a new global var.
            Y.M.atto_embedquestion.form[elementId] = qform;
            // Use just one dialogue, not one per instance of the Atto button.
            Y.M.atto_embedquestion.dialogue = false;
        });
    },

    /**
     * Display the question selector dialogue.
     */
    displayDialogue: function() {
        var loader, content, submit, elementId;

        this.currentSelection = this.get('host').getSelection();

        // The wrapper div's loading icon will be replaced with form contents.
        // The submit button needs to be 'outside' the form to avoid an ajax submission of the form.
        loader = M.util.image_url('y/loading');
        content = '<div class="' + WRAPPER + '">' +
            '<img class="icon " src="' + loader + '" alt="Loading..." title="Loading...">' +
            '</div>' +
            '<button class="' + BUTTON + '">' + M.util.get_string('embedqcode', COMPONENTNAME) + '</button>';

        if (!Y.M.atto_embedquestion.dialogue) {
            Y.M.atto_embedquestion.dialogue = this.getDialogue({
                headerContent: M.util.get_string('pluginname', COMPONENTNAME),
                focusAfterHide: true,
                bodyContent: content
            }, true);
        }
        Y.M.atto_embedquestion.dialogue.show();

        // Note it is important to only set the wrapper after the dialogue has been inserted in the DOM.
        elementId = this.get('elementid');
        if (!this.doneOnce) {
            // Capture the reference to this version of the AMD code's form.
            this.qForm = Y.M.atto_embedquestion.form[elementId];
            this.qForm.setRootNode('.' + WRAPPER);
        }
        this.qForm.insertQform();

        // Set the listener for the submit button (once).
        if (!this.doneOnce) {
            submit = Y.all('.' + BUTTON);
            submit.on('click', this.insertQcode, this);
            this.doneOnce = true;
        }
    },

    /**
     * Insert the selected question code into the editor textarea.
     *
     * @param {string} qcode The embed question code for inserting.
     */
    insertQcode: function(qcode) {
        var host, dialogueid;

        // Hide the dialogue.
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        host = this.get('host');

        // Focus on the last point.
        host.setSelection(this.currentSelection);

        host.insertContentAtFocusPoint(qcode);

        // And mark the text area as updated.
        this.markUpdated();
    }
}, {
    ATTRS: {
        enablebutton: {value: false},
        contextid: {value: false},
        elementid: {value: false}
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
