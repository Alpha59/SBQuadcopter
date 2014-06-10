#ifndef SENDNEWRELEVANT_H
#define SENDNEWRELEVANT_H
#define DATABASE_NAME "Gameplay_DB"

#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdio.h>

#include <string>
#include <cstdlib>
#include <iostream>

#include <mutex>

#include <netinet/in.h>

#include "mongo/client/dbclient.h"
#include "mongo/bson/bson.h"
#include "mongo/db/json.h"

#include "luxSocket.h"

#include "Authenticate.h"

#include "HMBL.h"
#include "sendupdate.h"
#include <time.h>


using namespace mongo;
using namespace std;
using namespace socketlibrary;

class SendNewRelevant{
    public:
        static void spawn(struct pipe params_in);
    protected:
    private:
};

struct newConnectionInfo{
    std::vector<int> BucketList;
};

struct s_snr_params_in
{
    char* pipe_r;
};

//Struct for pipe to SNR Thread
struct s_SNR
{
        const char *pipeLocation;
};

        struct s_SNRMessage
        {
                std::vector<int> newBuckList;
        };
#endif // SENDNEWRELEVANT_H
