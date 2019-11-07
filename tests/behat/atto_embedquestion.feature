@ou @ou_vle @editor @editor_atto @atto @atto_embedquestion @filter_embedquestion
Feature: Embed question in the atto editor
  In order to encourage students interacting with ativity and learning from it
  As a teacher
  I need to insert interactive questions in my content

  Background:
    Given the following config values are set as admin:
      | toolbar | files = image, media, managefiles, embedquestion | editor_atto |
    And the following "users" exist:
      | username | firstname | lastname | email               |
      | teacher  | Terry     | Teacher  | teacher@example.com |
    And the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1        | 0        |
    And the following "course enrolments" exist:
      | user    | course | role           |
      | teacher | C1     | editingteacher |
    And the following "question categories" exist:
      | contextlevel | reference | name           | idnumber |
      | Course       | C1        | Test questions | embed |
    And the following "questions" exist:
      | questioncategory | qtype     | name           | idnumber |
      | Test questions   | truefalse | First question | test1    |
    And the "embedquestion" filter is "on"
    And I log in as "teacher"

  @javascript
  Scenario: Test using 'Embed question' button
    When I am on "Course 1" course homepage
    And I turn editing mode on
    And I add a "page" to section "1"
    And I set the field "Name" to "Test page 01"
    And I set the field "Description" to "Test page description"
    And I set the field "content" to "Test page content"
    And I click on "Embed question" "button"
    And I set the field "Question category" to "Test questions [embed] (1)"
    And I set the field "id_questionidnumber" to "First question [test1]"
    And I click on "Embed question" "button" in the "Embed question" "dialogue"
    Then I should see "{Q{embed/test1|"
    And I should see "}Q}Test page description"
