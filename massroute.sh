#! /bin/sh
# /etc/init.d/massroute
#
### BEGIN INIT INFO 
# Provides: automount 
# Required-Start: $remote_fs $syslog 
# Required-Stop: $remote_fs $syslog 
# Default-Start: 2 3 4 5 
# Default-Stop: 0 1 6 
# Short-Description: Start daemon at boot time 
# Description: Enable service provided by daemon. 
### END INIT INFO 

PIDFILE=/var/run/massroute.pid
pid=`cat $PIDFILE`

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting massroute..."
    python /home/pi/Desktop/massroute-py/massroute.py start &
    echo $! > $PIDFILE
    ;;
  stop)
    echo "Stopping massroute..."
    echo "pid=$pid"
    kill -9 $pid
    python /home/pi/Desktop/massroute-py/massroute.py stop
    ;;
  *)
    echo "Usage: /etc/init.d/massroute {start|stop}"
    exit 1
    ;;
esac

exit 0