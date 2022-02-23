from kafka import KafkaAdminClient, KafkaClient, KafkaConsumer
#from confluent_kafka.admin import AdminClient

#print(dir(KafkaAdminClient))

class Consumer:
    def __init__(self, clientId, state, groupId, memberId,  clientHost, subscriptions, assignment):
        self.clientId = clientId
        self.state = state
        self.groupId = groupId
        self.memberId = memberId
        self.clientHost = clientHost
        self.subscriptions = subscriptions
        self.assignment = assignment
    def __str__(self):
        return f'Client ID: {self.clientId} \n State: {self.state} \n Host: {self.clientHost} \n Subscriptions: {self.subscriptions} \n Group: {self.groupId} \n Member ID: {self.memberId} \n Assignment: {self.assignment}'

# Global variables
brokers = []
topics = []
consumerGroups = []
consumers = []

admin = KafkaAdminClient(bootstrap_servers=['localhost:9092'])

# confluent Kafka
# Kafka Admin Client
# admin = AdminClient({'bootstrap.servers': 'localhost:9092'})
# groups = admin.list_groups()
# print(groups)
# print(dir(groups[1]))
# print(groups[0].members[0].client_id)

# print(admin.describe_configs(groups[1]))
# for group in groups:
#     print(admin.describe_configs(group))
# print(admin.describe_configs(groups[0].members[0]))

def getProucers():
    return brokers
    


def updateKafkaArchitecture():
    global brokers
    global topics
    global consumerGroups
    global consumers

    # Get information on cluster
    cluster = admin.describe_cluster()
    for broker in cluster["brokers"]:
        brokers.append(broker)


    # Get all topics
    topics = admin.list_topics()
    #for topic in topics:
        # describe_topic(topic) doesn't give the output I would expect
        # print(f'{topic}: {admin.describe_topics(topic)}')


    # Get all consumer groups
    consumerGroups = admin.list_consumer_groups()
    for group in consumerGroups:
        groupInfo = admin.describe_consumer_groups(group)
        for group in groupInfo:
            if group.state == "Stable":
                for member in group.members:
                    consumer = Consumer(member.client_id, group.state, group.group, member.member_id, member.client_host, member.member_metadata.subscription, member.member_assignment)
                    consumers.append(consumer)

def print_kafka_architecture():
    print('\nBrokers:')
    for broker in brokers:
        print(broker)
    print('\nTopics:')
    for topic in topics:
        print(topic)
    print('\nConsumer Groups:')
    for group in consumerGroups:
        print(group)
    print('\nActive Consumers:')
    for consumer in consumers:
        print(consumer)
        print()

updateKafkaArchitecture()
print_kafka_architecture()