Features / User Stories
===
> The following stories describe the expected features/business rules of the massroute display to be installed in City Feed.

Device State
---
<pre>
<b>As a(n)</b> owner of the MassRoute device
<b>I want to</b> be able to turn it off
<b>So that I can</b> not waste power when closed.
</pre>

###Criteria
* Is able to turn the device on from an off state.
* Is able to turn the device off from an on state.


Service availability
---
<pre>
<b>As a</b> patron of City Fee
<b>I want to</b> be notified if the prediction service is unavailable
<b>So that I can</b> look out the window to see bus arrivals.
</pre>

###Criteria
* Is notified that service is unavailable.

Bus vicinity notification
---
<pre>
<b>As a</b> patron of City Feed
<b>I want to</b> be notified when the next bus is not within proximity
<b>So that I can</b> go about my business without worry of bus approaching.
</pre>

<pre>
<b>As a</b> patron of City Feed
<b>I want to</b> be notified when the next bus is within a close vicinity
<b>So that I can</b> plan accordingly to shop, pack up, finish eating.
</pre>

<pre>
<b>As a</b> patron of City Feed
<b>I want to</b> be notified when the next bus is approaching 
<b>So that I can</b> stop shopping, pack quickly, or finish eating on my way to catch the bus.
</pre>

###Criteria
* Is notified in a manner that represents a bus being out of proximity.
* Is notified in a calm manner when bus is within 5 minutes of target stop.
* Is notified in an urgent manner when bus is within 2 minutes of target stop.

Arrival times
---
<pre>
<b>As a</b> patron of City Feed
<b>I want to</b> be notified of the next arrival time of the closest outgoing bus
<b>So that I can</b> plan accordingly to shop, pack, finish eating.
</pre>

<pre>
<b>As a</b> patron of City Feed
<b>I want to</b> be notified of the next arrival time of the closest ingoing bus.
<b>So that I can</b> plan accordingly to shop, pack, finish eating.
</pre>

###Criteria
* Can access arrival time of outgoing bus in a readable format (mins, secs)
* Can access arrival time of ingoing bus in a reasable format (mins, secs)

Take-aways
---
* Device should be powered by a switch to change on/off state.
* Display should notify of service unavailable for predictions.
* Display should calmly notify user of stops within vicinity based on time proximity.
* Display should urgently notify user of stops within vicinity based on time proximity.
* Display should notify user of next arrival time of outgoing bus.
* Display should notify user of next arrival time of incoming bus.


