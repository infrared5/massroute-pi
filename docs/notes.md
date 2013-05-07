GPIO
---

###Pull-Up Resistors for DPDT Switches
http://www.coactionos.com/embedded-design/28-using-pull-ups-and-pull-downs.html

###Shift Register
http://wiringpi.com/extensions/shift-register-74x595/

dataPin(14):GPIO17
clockPin(11):GPIO18/CLK
latchPin(12):GPIO21/DOUT

###shifter.js
Based on Shifter.cpp for Arduino
http://bildr.org/2011/08/74hc595-breakout-arduino/

####Setup
* pin 4
* resistor to power (3v3)
* power/input of switch sits between pin 4 and resistor
* GND of switch goes to GND of pi