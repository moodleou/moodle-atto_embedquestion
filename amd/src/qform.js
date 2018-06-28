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

/**
 * Manages the question selection form.
 *
 * @package    atto_embedquestion
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery', 'core/notification', 'core/fragment', 'core/templates'], function($, Notification, Fragment, Templates) {

    // This is based on calendar/amd/src/modal_event_form.js and mod/assign/amd/src/grading_panel.js
    'use strict';

    var t, priv;

    /**
     * Private variables and methods.
     */
    priv = {
        reloadingBody: false,
        bodyPromise: false,
        rootNode: false,
        elementId: false,
        contextId: false,
        currentSelection: false
    };

    /**
     * Public returned object.
     *
     * @alias atto_embedquestion/qform
     */
    t = {
        setRootNode: function(rootnode) {
            priv.rootNode = $(rootnode);
        },
        setElementId: function(elementid) {
            priv.elementId = elementid;
        },
        setContextId: function(contextid) {
            priv.contextId = contextid;
        },
        setCurrentSelection: function(currentselection) {
            priv.currentSelection = currentselection;
        },

        /**
         * Temp experiment - not working - remove me.
         * This uses an ajax function to get the question selection form.
         *
         * @param {object} formData any data already set in the form
         * @returns {object} a promise or wrapper containing html and javascript for the question selection form
         */
        getQform: function(formData) {
            var args = {};
            if (priv.reloadingBody) {
                return priv.bodyPromise;
            }
            priv.reloadingBody = true;
            //t.disableButtons();//TODO
            // if (priv.courseId) {
            //     args.courseid = priv.courseId;
            // }
            // if (priv.qcatIdNum) {
            //     args.qcatidnum = priv.qcatIdNum;
            // }
            // if (priv.qIdNum) {
            //     args.qidnum = priv.qIdNum;
            // }
            if (typeof formData !== 'undefined') {
                args.formdata = formData;
            }

            priv.bodyPromise = Fragment.loadFragment('atto_embedquestion', 'questionselector', priv.contextId, args);

            priv.bodyPromise
                .done(function(html, js) {
                    //t._niceReplaceNodeContents(priv.rootNode, html, js);
                    //t.enableButtons();//TODO?
                    //return;
                    return html;//this never gets returned!
                })
                .fail(Notification.exception)
                .always(function() {
                    priv.reloadingBody = false;
                    return;
                })
                .fail(Notification.exception);

            return priv.bodyPromise;
            //return 'something';//just for testing!
        },

        /**
         * This uses an ajax function to add the question selection form to the dialogue.
         *
         */
        insertQform: function() {
            var args = {};
            // Start with a loading spinner.
            Templates.render('mod_assign/loading', {}).done(function(html, js) {
                //window.alert(html);//test of functionality only - remove me.
                t.niceReplaceNodeContents(priv.rootNode, html, js).done(function() {
                    // Replace with the form.
                    Fragment.loadFragment('atto_embedquestion', 'questionselector', priv.contextId, args).done(function(html, js) {
                        t.niceReplaceNodeContents(priv.rootNode, html, js).done(function() {
                            // Need to add event listeners here.
                            // Currently clicking on the Embed this question button gives an ajax error.
                            $('#' + priv.elementId + ' input[name="embedquestion"]').on('click', t.embedQuestionCode);
                        });
                    }).fail(Notification.exception);
                });
            }).fail(Notification.exception);
        },

        niceReplaceNodeContents: function(node, html, js) {
            var promise = $.Deferred();
            node.fadeOut("fast", function() {
                Templates.replaceNodeContents(node, html, js);
                node.fadeIn("fast", function() {
                    promise.resolve();
                });
            });
            return promise.promise();
        },

        embedQuestionCode: function(e) {
            e.preventDefault();
            // calculate this code properly
            var qcode = '{Q{cat-id-num/que-id-num|id=3|courseid=31}Q}';
            // do the following here or in button.js using the return from getQformData?
            // insert this in the right place
            // close the dialogue
            // mark the text area as changed
            window.alert(qcode);
            // Alternatively trigger an event that the yui button.js code can listen for.
        },

        getQformData: function() {
            //return this.getForm().serialize();
            return '';
        },

        save: function() {
            //not required?
        },

        registerEventListeners: function() {
            //
        }
    };

    return t;
});
