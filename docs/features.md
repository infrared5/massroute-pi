Features / User Stories
===
> The following stories describe the expected features/business rules of the massroute display to be installed in City Feed.

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
<b>I want to</b> be notified when the next bus is within a distant vicinity
<b>So that I can</b> plan accordingly to shop, pack up, finish eating.
</pre>

<pre>
<b>As a</b> patron of City Feed
<b>I want to</b> be notified when the next bus is approaching 
<b>So that I can</b> stop shopping, pack quickly, or finish eating on my way to catch the bus.
</pre>

###Criteria
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
* Display should notify of service unavailable for predictions.
* Display should calmly notify user of stops within vicinity based on time proximity.
* Display should urgently notify user of stops within vicinity based on time proximity.
* Display should notify user of next arrival time of outgoing bus.
* Display should notify user of next arrival time of incoming bus.


