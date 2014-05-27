/*
 * This code was orginally written and developed by the Lux Backend Team
 * at Philadelphia Game Lab:
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * - Jake
 */

#include "battleground.h"

void BattleGround::spawn(void *param_in){

    // this pipe stuff should be right:

    // create pipe to send updates on
    const char *pipeLocation = "/temp/pipe"; // needs to be unique somehow
    if(mkfifo(pipeLocation, 0666) == 0){ // creates the pipe in the file system
        int pipe = open(pipeLocation, O_WRONLY); // open  the pipe for writing

        // so should the idea of this pthread

        s_SUT param;
        param.pipeLocation = pipeLocation;

       // pthread_create(&BGTID, NULL, (void *) &SendUpdate::createSUT, (void *) &param); // spawn sendUpdates thread

    }


    // construct a HMBL
    //locbasedhashmap HMBL;
    locbasedhashmap HMBL(thredSizeX,threadSizeY,pipeLocation);

    Socket socket(param_in.port); // create a socket object
	socket.init(); // initialize/open the socket


    // will need to pass the socket that was opened back to the
    // spawn BGT so that it can use that later for redirection

	while(1){
	    sockaddr_in cli_addr;
	    // accept clients, who will send in their update
		BSONObj message = socket.receive(&cli_addr);

        // get accessToken from BSONObj message
        std::string accessToken = message["sender"]["accessToken"].String(); // this should be as easy as this- but might not be.
        // get EUID from BSONObj message
        std::string EUID = message["sender"]["EUID"].String();


        // authenticate message
        if(Authenticate::authenticateAccessToken(accessToken, EUID)){
            // get location from message
            int location[0] = atoi(message["object"]["location"]["x"].String().c_str());
            int location[1] = atoi(message["object"]["location"]["y"].String().c_str());
            int radius = atoi(message["sender"]["radius"].String().c_str());

	    //Updte clients location in HMBL
	    HMBL.update(cli_addr,EUID,location[0],location[1]);
		
		
            // query HMBL for socket list
            std::list<struct sockaddr_in> SocketList = HMBL.getClients(location[0],location[1],radius);// need to pass in cli_addr, location, and radius

            // pass message to undecided server logic class that client will fill in
            // sadly this might be unavoidable
            // :-(

	    //Strip message header
	    BSONobj strippedMessage = message["object"];


	    //Create  structure
	    s_SUTMessage pipeStruct;
	    pipeStruct.message = strippedMessage;
	    pipeStruct.SocketList = SocketList;
	    
            // pipe updates to send updates thread
            write(pipe, pipeStruct, sizeof(pipeStruct));

        }

	}
}
