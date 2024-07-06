import logging
from websocket_server import WebsocketServer

def new_client(client, server):
	print("join")

def client_left(client, server):
	print("left")

def message_received(client, server, message):
	print(message)

server = WebsocketServer(host='127.0.0.1', port=8765, loglevel=logging.INFO)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()