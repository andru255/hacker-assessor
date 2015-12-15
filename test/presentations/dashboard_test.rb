require 'test_helper'

class DashboardTest < ActiveSupport::TestCase

  def dashboard hacker = hackers(:jorge)
    @dashboard ||= Dashboard.new hacker
  end

  def experience level: 3, skill: skills(:tdd)
    Experience.new skill, level
  end

  test 'have a title' do
    assert_equal 'Welcome Jorge', dashboard.title
  end

  test 'have a career' do
    assert_equal hackers(:jorge).career, dashboard.career
  end

  test 'show the seniority detail' do
    assert_equal 'Junior+ => Semi-Senior', dashboard.seniority_detail
  end

  test 'shows matching requirements' do
    matching_requirements = dashboard.matching_requirements
    assert matching_requirements
    assert_equal experience, matching_requirements.first.required
    assert_equal 'tdd', matching_requirements.first.skill_name
    assert_equal experience(level: 2), matching_requirements.first.current
    assert_equal 1, matching_requirements.size
  end

  test 'find all the missign requirements' do
    assert_equal 2, dashboard(hackers(:rodrigo)).matching_requirements.size
  end

  test 'elder hackers can edit the dashboard' do
    refute dashboard.editable?
    assert Dashboard.new(hackers(:jorge), reviewer: hackers(:leo)).editable?,
      'Leo can edit'
  end

  test 'have a hacker' do
    assert_equal hackers(:jorge), dashboard.hacker
  end

end
