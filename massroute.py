import os
import os.path
import logging
import RPi.GPIO as GPIO

from sys import argv
from time import sleep

from app.board import Board
from app.service.service import Service
from app.util.scheduler import Scheduler
from app.request.factory import StopRequestFactory
from app.program import Program
from app.component.modifier.blinker import blinker_pool

script, task = argv

cwd = os.getcwd()
log_dir = '{root}/{dir}'.format(root=cwd, dir='log')
if not os.path.exists(log_dir):
  os.mkdir(log_dir)
log_file = '{dir}/{filename}'.format(dir=log_dir, filename='massroute.log')
print 'massroute log file: %r' % log_file

format = '%(asctime)s %(name)s [%(levelname)s]: %(message)s'
logging.basicConfig(level=logging.DEBUG, format=format)
formatter = logging.Formatter(format)

# console = logging.StreamHandler()
# console.setLevel(logging.DEBUG)
# console.setFormatter(formatter)
# logging.getLogger('').addHandler(console)
fileh = logging.FileHandler(log_file)
fileh.setLevel(logging.ERROR)
fileh.setFormatter(formatter)
logging.getLogger('').addHandler(fileh)

logger = logging.getLogger(__name__)

SCHEDULE_START = 6 # 6am
SCHEDULE_END = 22 # 10pm
BASE_URL = 'http://68.169.43.76:3001'
PREDICTION_URI = 'routes/39/destinations/39_1_var1/stops'

def main():
  try:
    GPIO.cleanup()
    board = Board()
    service = Service(BASE_URL, PREDICTION_URI)
    scheduler = Scheduler(SCHEDULE_START, SCHEDULE_END)

    program = Program(board, scheduler)
    program.set_service(service)

    if task == 'start':
      program.enqueue(StopRequestFactory(board.shifter))
      program.start()
    elif task == 'stop':
      program.stop()
    elif task == 'web':
      service.access()
    elif task == 'blink':
      board.blinker_test()
    elif task == 'error':
      board.run_resource_error()
    else:
      logger.warning('Task not found: %r' % task)

  except KeyboardInterrupt:
    blinker_pool.drain()
    if 'board' in locals():
      board.run_shutdown_seq()
  except Exception, e:
    logger.warning('Could not properly run %s: %r' % (task, e))
    if 'board' in locals():
      board.run_resource_error()

if __name__ == '__main__':
  main()
