<?php
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
 * The mform for selecting a question to embed.
 * Note this is a temporary file that needs replacing!
 * This has been based on calendar/classes/local/event/forms/create.php
 *
 * @package    atto_embedquestion
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//namespace atto_embedquestion\qform;//not working for some reason!

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/lib/formslib.php');

/**
 * The mform class for selecting a question to embed.
 *
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qform extends moodleform {

    /**
     * The form definition
     */
    public function definition() {//TODO remove this file!

        $mform = $this->_form;

        $mform->setDisableShortforms();//These two lines do not affect the display of the form, may effect its use.
        $mform->disable_form_change_checker();

        // Empty string so that the element doesn't get rendered.
        $mform->addElement('header', 'general', '');//Must be added or nothing displays for some reason!

        //$this->add_default_hidden_elements($mform);

        $mform->addElement('text', 'aname', 'Testing', 'size="10"');
        $mform->setType('aname', PARAM_TEXT);

        //$this->add_action_buttons();//not working for some reason!
        //$mform->addElement('submit', 'embedquestion', 'Embed this question');

        // Add the javascript required to enhance this mform.
        //$PAGE->requires->js_call_amd('core_calendar/event_form', 'init', [$mform->getAttribute('id')]);
    }

    /**
     * A bit of custom validation for this form
     *
     * @param array $data An assoc array of field=>value
     * @param array $files An array of files
     * @return array
     */
    public function validation($data, $files) {
        global $DB, $CFG;

        $errors = parent::validation($data, $files);
        //$coursekey = isset($data['groupcourseid']) ? 'groupcourseid' : 'courseid';
        //$eventtypes = calendar_get_all_allowed_types();
        //$eventtype = isset($data['eventtype']) ? $data['eventtype'] : null;
        //
        //if (empty($eventtype) || !isset($eventtypes[$eventtype])) {
        //    $errors['eventtype'] = get_string('invalideventtype', 'calendar');
        //}
        //
        //if (isset($data[$coursekey]) && $data[$coursekey] > 0) {
        //    if ($course = $DB->get_record('course', ['id' => $data[$coursekey]])) {
        //        if ($data['timestart'] < $course->startdate) {
        //            $errors['timestart'] = get_string('errorbeforecoursestart', 'calendar');
        //        }
        //    } else {
        //        $errors[$coursekey] = get_string('invalidcourse', 'error');
        //    }
        //}
        //
        //if ($eventtype == 'course' && empty($data['courseid'])) {
        //    $errors['courseid'] = get_string('selectacourse');
        //}
        //
        //if ($eventtype == 'group' && empty($data['groupcourseid'])) {
        //    $errors['groupcourseid'] = get_string('selectacourse');
        //}
        //
        //if ($data['duration'] == 1 && $data['timestart'] > $data['timedurationuntil']) {
        //    $errors['durationgroup'] = get_string('invalidtimedurationuntil', 'calendar');
        //} else if ($data['duration'] == 2 && (trim($data['timedurationminutes']) == '' || $data['timedurationminutes'] < 1)) {
        //    $errors['durationgroup'] = get_string('invalidtimedurationminutes', 'calendar');
        //}

        return $errors;
    }

    /**
     * Add the list of hidden elements that should appear in this form each
     * time. These elements will never be visible to the user.
     *
     * @param MoodleQuickForm $mform
     */
    protected function add_default_hidden_elements($mform) {
        global $USER;

        // Add some hidden fields.
        $mform->addElement('hidden', 'id');
        $mform->setType('id', PARAM_INT);
        $mform->setDefault('id', 0);

        $mform->addElement('hidden', 'userid');
        $mform->setType('userid', PARAM_INT);
        $mform->setDefault('userid', $USER->id);

        $mform->addElement('hidden', 'modulename');
        $mform->setType('modulename', PARAM_INT);
        $mform->setDefault('modulename', '');

        $mform->addElement('hidden', 'instance');
        $mform->setType('instance', PARAM_INT);
        $mform->setDefault('instance', 0);

        $mform->addElement('hidden', 'visible');
        $mform->setType('visible', PARAM_INT);
        $mform->setDefault('visible', 1);
    }
}
