Specs
---

* Raspbian Wheezy.
* preinstalled RPi.GPIO python library.
* '595 Shift Registers (x2)
* LED 20mA ? (x14)
* 100ohm Resisters (x14)

### Circuit
3.3 V
limit LED's to 2.5V at 20mA
R = .8 / .02 = 40ohm
Using 100ohm.

### Transistor - NOT USED
Using transistor to transfer power to the circuit through digital write on GPIO pin instead of kust supplying power to the Raspberry Pi unit.

Transistor = NPN 2N2222

**R = V / I**

* Collector =  x = 3.3V / 6mA = 3.3 / .06 = 55 (rounded to 100ohm)
* Base = x = 3.3v / 1.2mA = 3.3 / .0012 = 2750 (used 4700ohm)
* Emitter = x = 3.3v / 17mA = 3.3 / .017 = 194 (used 220ohm)

Boot
---
Added massroute.sh to /etc/init.d : [http://www.debian-administration.org/articles/28](http://www.debian-administration.org/articles/28)

	$> sudo /etc/init.d/massroute stop

TRIED:

Added script to /etc/rc.local:

	(sleep 10;sh ~/Desktop/massroutepy/init.sh)&
	
:NOT WORK

Cron
---
Created cron to run at 6am every morning. This allowed for the system to start its program again at 6am. It should have been properly shutdown by itself by checking the scheduler during execution.

	$> crontab -e
	$> 00 06 * * * sudo sh /home/pi/Desktop/massroute-py/init.sh
	$> sudo /etc/init.d/cron restart

Articles
---
Raw: [https://sites.google.com/site/semilleroadt/raspberry-pi-tutorials/gpio](https://sites.google.com/site/semilleroadt/raspberry-pi-tutorials/gpio)

RPi: [https://code.google.com/p/raspberry-gpio-python/wiki/BasicUsage](https://code.google.com/p/raspberry-gpio-python/wiki/BasicUsage)

[http://openmicros.org/index.php/articles/94-ciseco-product-documentation/raspberry-pi/217-getting-started-with-raspberry-pi-gpio-and-python](http://openmicros.org/index.php/articles/94-ciseco-product-documentation/raspberry-pi/217-getting-started-with-raspberry-pi-gpio-and-python)

**Error:**
RPi.GPIO.ModeNotSetException: Please set pin numbering mode using GPIO.setmode(GPIO.BOARD) or GPIO.setmode(GPIO.BCM)

**Resolution:** GPIO.setmode(GPIO.BCM)

Communication with RESTful service
---
Uses [requests](http://docs.python-requests.org/en/latest/user/quickstart/) python library:
http://docs.python-requests.org/en/latest/user/quickstart/

cloned and setup: http://docs.python-requests.org/en/latest/user/install/#install