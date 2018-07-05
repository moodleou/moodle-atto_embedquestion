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
    'use strict';
    var t, priv;

    /**
     * Private variables and methods.
     */
    priv = {
        rootNode: false,
        contextId: false
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
        setContextId: function(contextid) {
            priv.contextId = contextid;
        },

        /**
         * This uses an ajax function to add the question selection form to the dialogue.
         *
         */
        insertQform: function() {
            var args = {};
            args.contextId = priv.contextId;

            // Replace with the form.
            Fragment.loadFragment('atto_embedquestion', 'questionselector', priv.contextId, args).done(function (html, js) {
                t.niceReplaceNodeContents(priv.rootNode, html, js);
            }).fail(Notification.exception);
        },

        niceReplaceNodeContents: function(node, html, js) {
            var promise = $.Deferred();
            node.fadeOut("fast", function () {
                Templates.replaceNodeContents(node, html, js);
                node.fadeIn("fast", function () {
                    promise.resolve();
                });
            });
            return promise.promise();
        },

        getQformData: function () {
            var out = {};
            console.log(priv.rootNode);
            out.catidnum = priv.rootNode.find('#id_categoryidnumber').val();//TODO!
            out.queidnum = priv.rootNode.find('#id_questionidnumber').val();
            out.behaviour = (priv.rootNode.find('#id_behaviour').val()) ? 'behaviour=' + priv.rootNode.find('#id_behaviour').val() : '';
            out.maxmark = (priv.rootNode.find('#id_maxmark').val()) ? 'maxmark=' + priv.rootNode.find('#id_maxmark').val() : '';
            out.variant = (priv.rootNode.find('#id_variant').val()) ? 'variant=' + priv.rootNode.find('#id_varian').val() : '';
            out.correctness = (priv.rootNode.find('#id_correctness').val()) ? 'correctness=' + priv.rootNode.find('#id_correctness').val() : '';
            out.marks = (priv.rootNode.find('#id_marks').val()) ? 'marks=' + priv.rootNode.find('#id_marks').val() : '';
            out.markdp = (priv.rootNode.find('#id_markdp').val()) ? 'markdp=' + priv.rootNode.find('#id_markdp').val() : '';
            out.feedback = (priv.rootNode.find('#id_feedback').val()) ? 'feedback=' + priv.rootNode.find('#id_feedback').val() : '';
            out.generalfeedback = (priv.rootNode.find('#id_generalfeedback').val()) ? 'generalfeedback=' + priv.rootNode.find('#id_generalfeedback').val() : '';
            out.rightanswer = (priv.rootNode.find('#id_rightanswer').val()) ? 'rightanswer=' + priv.rootNode.find('#id_rightanswer').val() : '';
            out.history = (priv.rootNode.find('#id_history').val()) ? 'history=' + priv.rootNode.find('#id_history').val() : '';
            out.token = '12345...';

            return out;
        }
    };

    return t;
});
