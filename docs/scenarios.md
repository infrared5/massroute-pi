Scenarios
===
> The following define scenarios as they relate to each story describe in features.md

Feature: Service availability
---
###Scenario: Service not available
<pre>
<b>Given</b> system requests a prediction for a stop
<b>When</b> a HTTP fault is received (404, 501)
<b>Then</b> the system notifies of 'Service Unavailable'
</pre>

Feature: Bus vicinity notification
---

###Scenario: System polls for stop prediction, success response
<pre>
<b>Given</b> a defined list of stop ids from the MassDOT system
<b>When</b> a request is made for the first item removed from the list
<b>And</b> a list of 0 or more prediction is received
<b>Then</b> the requested stop id is pushed to the end of the list
<b>And</b> the system does not request the next stop id until lapse of <i>defined time</i>.
</pre>
* The __defined time__ is based on the amount of stops and MassDOT limit on request spans. The request limit from a single IP shall not go below one per every 10 second interval.

__defined time = 10 seconds__

###Scenario: System polls for stop prediction, fault response
<pre>
<b>Given</b> a defined list of stop ids from the MassDOT system
<b>When</b> a request is made for the first item removed from the list
<b>And</b> a fault is received
<b>Then</b> the requested stop id is pushed to the end of the list
<b>And</b> the system does not request the next stop id until lapse of <i>defined time</i>.
</pre>
* The __defined time__ is based on the amount of stops and MassDOT limit on request spans. The request limit from a single IP shall not go below one per every 10 second interval.

__defined time = 10 seconds__

###Scenario: System logs prediction fault response
<pre>
<b>Given</b> a defined list of stop ids from the MassDOT system
<b>When</b> a request is made for the first item removed from the list
<b>And</b> a fault is received
<b>Then</b> the system logs the fault message to an external file.
</pre>

###Scenario: System reports Out of Proximity
<pre>
<b>Given</b> predictions are accessed on the service for a single stop
<b>When</b> the list predictions equal or exceed 1 item
<b>And</b> the first prediction in seconds is over 5 minutes
<b>Then</b> the system is notified of approaching bus out of proximity.
</pre>

###Scenario: System reports Safe Proximity
<pre>
<b>Given</b> predictions are accessed on the service for a single stop
<b>When</b> the list predictions equal or exceed 1 item
<b>And</b> the first prediction in seconds is under 5 minutes
<b>And</b> the first prediction in seconds is over 2 minutes
<b>Then</b> the system is notified of approaching bus within a safe distance.
</pre>

###Scenario: System reports Immediate Proximity
<pre>
<b>Given</b> predictions are accessed on the service for a single stop
<b>When</b> the list predictions equal or exceed 1 item
<b>And</b> the first prediction in seconds is under 2 minutes
<b>Then</b> the system is notified of appraching bus within close distance.
</pre>
