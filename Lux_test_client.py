#!/usr/bin/python
import urllib
import time
import json
import socket
import random

#server_ip = "127.0.0.1"
server_ip = "54.88.133.189" # this would be the server's ip
#server_ip = "10.1.10.220"
#server_ip = "192.168.128.39" # this would be the server's ip
server_name = "ec2-54-85-159-206.compute-1.amazonaws.com"
#JSONAuth = json.loads(urllib2.urlopen(server_ip).read())

#print JSONAuth
#print JSONAuth["ip"]

"""
Extract authentication stuff from JSON object
"""
# EUID = JSONAuth["EUID"]
# AccessToken = JSON["AccessToken"]

# fake authentication data because don't have the real JSON object with this stuff
"""
authentication_data = {
    "EUID" : 1234,
    "AccessToken" : 5678
}
"""
"""
Create HTTP request object in order to send authentication info to server
"""
#formatted_data = urllib.urlencode(authentication_data)

#print formatted_data
#req = urllib2.Request(server_ip, formatted_data)

#print authentication_data

"""
Send request
"""
#JSONResponseObj = json.loads(urllib2.urlopen(server_ip, formatted_data).read())

"""
Get port number from JSON object
"""
# port = JSONResponseObj["Port"]

# print json.dumps(JSONResponseObj)


"""
Open socket on port retrieved from JSON object
"""
# will use 80 for now
port =3005
#socket.getaddrinfo(server_ip,port)
sendSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sendSocket.bind (("127.0.0.1",5001))
# this step will not be necessary when ip of server is known
#remote_ip = socket.gethostbyname(server_name)
#retval = sendSocket.sendto("Hello World", server_ip, port))
#print str(retval) + "bytes sent (Hello World test)"

"""
Receive all updates from server on same socket used to send
"""

#object
# location
#  x:
#  y
# radius
# EU_DOC
 
# fake JSON because google doesn't just send back json objects for no reason

msgFromServer = ["x", "y", "z"]

sendSocket.setblocking(0);
counter = 0
x = [random.randint(1,99) for x in range(3)]
y = [random.randint(1,99) for y in range(3)]
EUID = [random.randint(1,99) for EUID in range(3)]
while counter < 1:
# Add the IP Address to the below print statement 
	print ('top of while at iteration: '+str(counter))
	
	msgFromServer[0] = '{"tempid" : "1", "object" : {"location" : {"x" : "'+str(x[0])+'", "y" : "'+str(y[0])+'"}, "radius" : "2", "EU_DOC" : "true" }, "sender" : { "accessToken" : "abc", "EUID" : "'+str(EUID[0])+'" }}'
	msgFromServer[1] = '{"tempid" : "2", "object" : {"location" : {"x" : "'+str(x[1])+'", "y" : "'+str(y[1])+'"}, "radius" : "2", "EU_DOC" : "false"}, "sender" : { "accessToken" : "abc", "EUID" : "'+str(EUID[1])+'" }}'
	msgFromServer[2] = '{"tempid" : "3", "object" : {"location" : {"x" : "'+str(x[2])+'", "y" : "'+str(y[2])+'"}, "radius" : "2", "EU_DOC" : "true" }, "sender" : { "accessToken" : "abc", "EUID" : "'+str(EUID[2])+'" }}'

	for i in range(len(msgFromServer)):	
		print "sending message to server.... "
		print (msgFromServer[i])
		retval = sendSocket.sendto(msgFromServer[i], (server_ip, port))
		print (server_ip)
		print "message sent to server"

	print "Ready to receive..." 
	tend = time.time()*1000 + 1000;
	while(time.time()*1000 < tend):
		try:
			#print ("Ready to receive message... ") 
			msg = sendSocket.recvfrom(4096)
			msgFromServer.append(msg[0])
			print ("Finished receiving: " + msg[0])
			#print (server_ip)
		except socket.error:
			v = 1
			#print "no data yet"
	print "Receiving complete\n"

	x = [abs(xp+random.randint(-5,5)) % 100 for xp in x]
	y = [abs(yp+random.randint(-5,5)) % 100 for yp in y]
	EUID = [random.randint(1,99) for EUID in range(3)]

	#raw_input("Press Enter to resend...")
print ("end of test program")
