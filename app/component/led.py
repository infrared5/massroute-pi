import json
import logging

from ..util.json_util import convert

logger = logging.getLogger(__name__)

class LED:

  stop_id = 0
  resolver = None

  def __init__(self, stop_id, resolver):
    self.stop_id = stop_id
    self.resolver = resolver

  def data(self, result):
    data = convert(json.loads(result))
    logger.info("LED:data(result) for stop %r" % self.stop_id)
    if 'predictions' in data:
      self.resolver.resolve(data['predictions'])
    elif 'error' in data:
      self.error("Error in getting predictions for %r: %r" % (self.stop_id, data['error']))
    else:
      self.error('Unkown error occurred.')

  def error(self, error):
    logger.error("Error for LED %r: %r" % (self.stop_id, error))
    self.resolver.error()
