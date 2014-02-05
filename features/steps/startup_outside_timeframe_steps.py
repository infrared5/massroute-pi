from mock import MagicMock
from app.util.scheduler import Scheduler
from app.service.service import Service
from app.program import Program

SCHEDULE_START = 6 # 6am
SCHEDULE_END = 22 # 10pm

@given('The Program is intiated')
def program_initiated(context):
  board = context.board
  board.run_startup_seq = MagicMock(return_value=None)
  board.run_shutdown_seq = MagicMock(return_value=None)
  
  scheduler = Scheduler(SCHEDULE_START, SCHEDULE_END)
  
  service = Service('http://nowhere.com', 'open')
  service.resource_available = MagicMock(return_value=True)

  program = Program(board, scheduler)
  program.set_service(service)
  program.stop = MagicMock(return_value=None)

  context.program = program

@when('The current time lies outside of the \'live\' timeframe')
def scheduler_current_time_not_in_timeframe(context):
  context.program.scheduler.current_hour = MagicMock(return_value=23)

@when('The Program is invoked to :start()')
def program_started(context):
  context.program.start()

@then('The Stop Sequence is initiated')
def program_stop_invoked(context):
  context.program.stop.assert_called_once_with()