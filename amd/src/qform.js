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
        contextId: false,
        courseId: false
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
        setCourseId: function(courseid) {
            priv.courseId = courseid;
        },

        /**
         * This uses an ajax function to add the question selection form to the dialogue.
         *
         */
        insertQform: function() {
            var args = {};
            args.contextId = priv.contextId;
            args.courseId = priv.courseId;

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
            out.catidnum = priv.rootNode.find('#id_categoryidnumber').val();
            out.queidnum = priv.rootNode.find('#id_questionidnumber').val();
            out.courseid = priv.courseId;
            return out;
        }
    };

    return t;
});
