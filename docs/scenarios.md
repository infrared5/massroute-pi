Scenarios
===
> The following define scenarios as they relate to each story describe in features.md

###Terminology
On the device is a node server that manages communication between the remote MassDOT real-time bus data and that of the Raspberry Pi GPIO pins to display data based on output peripherals (LEDs, LCDs, 7-segments, etc).

* **MassRoute-Driver** refers to the NodeJS server running on the device that handles the communication between the proxy service and raspberry pi.
* **MassRoute-Proxy** refers to proxy service that communicates with the MassDOT bus data.


Feature: Device State
---
###Scenario: Device turned on
<pre>
<b>Given</b> the device has power
<b>And</b> the MassRoute-Driver service is running
<b>When</b> the device is switched on
<b>Then</b> the MassRoute-Proxy service should begin making requests.
</pre>

###Scenario: Device turned off
<pre>
<b>Given</b> the device has power
<b>And</b> the MassRoute-Driver service is running
<b>And</b> the MassRouteService is making requests
<b>When</b> the device is switched off
<b>Then</b> the MassRoute-Proxy service suspends requests.
</pre>


Feature: Service availability
---
###Scenario: Service not available
<pre>
<b>Given</b> MassRoute-Proxy requests a prediction for a stop
<b>When</b> a HTTP fault is received (404, 501)
<b>Then</b> the MassRoute-Driver notifies of 'Service Unavailable'
</pre>

Feature: Bus vicinity notification
---

###Scenario: System polls for stop prediction, success response
<pre>
<b>Given</b> a defined list of stop ids from the MassRoute-Proxy system
<b>When</b> a request is made for the first item removed from the list
<b>And</b> a list of 0 or more prediction is received
<b>Then</b> the requested stop id is pushed to the end of the list
<b>And</b> the MassRoute-Proxy does not request the next stop id until lapse of <i>defined time</i>.
</pre>
* The __defined time__ is based on the amount of stops and MassDOT limit on request spans. The request limit from a single IP shall not go below one per every 10 second interval.

__defined time = 10 seconds__

###Scenario: System polls for stop prediction, fault response
<pre>
<b>Given</b> a defined list of stop ids from the MassRoute-Proxy system
<b>When</b> a request is made for the first item removed from the list
<b>And</b> a fault is received
<b>Then</b> the requested stop id is pushed to the end of the list
<b>And</b> the MassRoute-Proxy does not request the next stop id until lapse of <i>defined time</i>.
</pre>
* The __defined time__ is based on the amount of stops and MassDOT limit on request spans. The request limit from a single IP shall not go below one per every 10 second interval.

__defined time = 10 seconds__

###Scenario: System logs prediction fault response
<pre>
<b>Given</b> a defined list of stop ids from the MassRoute-Proxy system
<b>When</b> a request is made for the first item removed from the list
<b>And</b> a fault is received
<b>Then</b> the MassRoute-Driver logs the fault message to an external file.
</pre>

###Scenario: System reports Out of Proximity
<pre>
<b>Given</b> predictions are accessed on the MassRoute-Proxy for a single stop
<b>When</b> the list predictions equal or exceed 1 item
<b>And</b> the first prediction in seconds is over 5 minutes
<b>Then</b> the MassRoute-Driver notifies of approaching bus out of proximity.
</pre>

###Scenario: System reports Safe Proximity
<pre>
<b>Given</b> predictions are accessed on the MassRoute-Proxy for a single stop
<b>When</b> the list predictions equal or exceed 1 item
<b>And</b> the first prediction in seconds is under 5 minutes
<b>And</b> the first prediction in seconds is over 2 minutes
<b>Then</b> the MassRoute-Driver notifies of approaching bus within a safe distance.
</pre>

###Scenario: System reports Immediate Proximity
<pre>
<b>Given</b> predictions are accessed on the MassRoute-Proxy for a single stop
<b>When</b> the list predictions equal or exceed 1 item
<b>And</b> the first prediction in seconds is under 2 minutes
<b>Then</b> the MassRoute-Driver notifies of appraching bus within close distance.
</pre>

Feature: Arrival Times
---
###Scenario: Inbound Prediction
<pre>
<b>Given</b> MassRoute-Proxy service is enabled 
<b>When</b> arrival time prediction for nearest inbound stop to City Feed received
<b>Then</b> the MassRoute-Driver notifies of arrival time regardless of proximity.
</pre>

###Scenario: Outbound Prediction
<pre>
<b>Given</b> MassRoute-Proxy service is enabled
<b>When</b> arrival time prediction for nearest outbound stop to City Feed received
<b>Then</b> the MassRoute-Driver notifies of arrival time regardless of proximity.
</pre>
