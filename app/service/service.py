import json
import requests
import logging
from requests.exceptions import *

logger = logging.getLogger(__name__)

class Service:
  """ Proxy Service for custom RESTful service API to MassDOT real-time data """
  base_url = ''

  def __init__(self, base_url, prediction_uri):
    self.base_url = base_url
    self.prediction_uri = prediction_uri

  def format_stop_request(self, stop_id):
    return "{url}/{endpoint}/{stop}".format(url=self.base_url, endpoint=self.prediction_uri, stop=str(stop_id))

  def resource_available(self):
    url = "{url}/{endpoint}".format(url=self.base_url, endpoint=self.prediction_uri)
    logger.info('Checking resource availability on %s' % url)
    try:
      r = requests.get(url)
      return r.status_code == requests.codes.ok
    except HTTPError, e:
      logger.error('Error in request: %r' % e)
      return False
    except RequestException, e:
      logger.error('RequestException in request: %r' % e)
      return False

  def access(self, stop_id, delegate):
    url = self.format_stop_request(stop_id)
    logger.info('Request for stop %s' % url)
    headers = {
      'content-type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    }
    try:
      r = requests.get(url, headers=headers)
      delegate.success(r.text)
    except HTTPError as e:
      logger.error('Error in request for %r: %r' % (stop_id, e))
      delegate.failure(e)
    except RequestException as e:
      logger.error('RequestException in request for %r: %r' % (stop_id, e))
      delegate.failure(e)