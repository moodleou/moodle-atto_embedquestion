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
    CSS = {
        PARAM: 'atto_embedquestion_param'
    },
    SELECTORS = {
        BUTTON: 'input[name="embedquestion"]'
    }

/**
 * Atto text editor embedquestion plugin.
 *
 * @namespace M.atto_embedquestion
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_embedquestion').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    qForm: null,

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
            callback: this._displayDialogue
        });
        // Initialise the amd javascript that will insert the moodle form in the dialogue.
        require(['atto_embedquestion/qform'], function(qform) {
            //qform.setCourseId(18);//TODO this.get('courseid');//not available for now
            qform.setContextId(contextId);
            qform.setElementId(elementId);
            qForm = qform;
        });
    },

    /**
     * Display the question selector dialogue.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();

        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            bodyContent: '<div class="atto-embedquestion-question-selector-wrapper"></div>'
        }, true);
        qForm.setRootNode('.atto-embedquestion-question-selector-wrapper');//does not work with this.qForm!
        qForm.setCurrentSelection(this._currentSelection);//TODO this is sent to amd code in case it can do the inserting, otherwise remove.
        // dialogue.set('bodyContent', qForm.getQform()).show();//works when a string is returned by getQform.
        // dialogue.set('bodyContent', this._getDialogueContent()).show();//not currently working.
        dialogue.show();
        qForm.insertQform();
        //TODO is it possible to set a listener for the selector embed button after the form has been loaded (calling insertQcode)?
        //TODO alternatively listen for special event that the form could trigger.
    },

    /**
     * Generates the content of the dialogue, attaching event listeners to
     * the content.
     *
     * @method _getDialogueContent
     * @return {Node} Node containing the dialogue content
     * @private
     */
    _getDialogueContent: function() {
        // This is from the equivalent file for the emoticon atto plugin, and shows how to attach event listeners.
        // var template = Y.Handlebars.compile(TEMPLATE),
        //     content = Y.Node.create(template({
        //         component: COMPONENTNAME,
        //         elementid: this.get('host').get('elementid'),
        //         CSS: CSS
        //     }));
        // content.one(SELECTORS.BUTTON).on('click', this._insertQcode, this);//works, but TEMPLATE is now removed.
        // Alternative.
        // var a = qForm.getQform();
        // var content = Y.Node.create(a);
        // content.one(SELECTORS.BUTTON).on('click', this._insertQcode, this);//also works, but only if getQform does not return a promise.
        // Possibly useful:
        //content.delegate('click', this._insertQcode, SELECTORS.BUTTON, this);
        //content.delegate('key', this._insertQcode, '32', SELECTORS.BUTTON, this);
        //return content;
    },

    /**
     * Insert the selected question code into the editor.
     *
     * @method _insertQcode
     * @param {EventFacade} e
     * @private
     */
    _insertQcode: function(e) {
        //TODO this works as a proof of concept, but how to initiate it?
        //var character = e.target.getData('character');
        var formData = qForm.getQformData();//not working yet
        // use formData to create a qcode.
        var qcode = '{Q{cat-id-num/que-id-num|id=3|courseid=31}Q}';

        // Hide the dialogue.
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var host = this.get('host');

        // Focus on the last point.
        host.setSelection(this._currentSelection);

        // And add the character.
        host.insertContentAtFocusPoint(qcode);

        // And mark the text area as updated.
        this.markUpdated();
    }
}, {
    ATTRS: {
        /**
         * Whether the button should be displayed
         *
         * @attribute enablebutton
         * @type Boolean
         */
        enablebutton: {
            value: false
        },
        contextid: {value: false},
        elementid: {value: false}
    }
});
