from mock import MagicMock
from app.util.scheduler import Scheduler

@given('A Scheduler has a \'live\' timeframe of 6am to 10pm')
def scheduler_timeframe_set_six_to_ten_pm(context):
  scheduler = Scheduler(6, 22)
  context.scheduler = scheduler

@when('Current time is not within timeframe')
def scheduler_current_hour(context):
  context.scheduler.current_hour = MagicMock(return_value=23)

@then('Scheduler is not considered available')
def scheduler_not_available(context):
  assert context.scheduler.check() == False
  assert context.scheduler.available == False

@when('Current time is within timeframe')
def scheduler_current_hour(context):
  context.scheduler.current_hour = MagicMock(return_value=12)

@then('Scheduler is considered available')
def scheduler_not_available(context):
  assert context.scheduler.check() == True
  assert context.scheduler.available == True