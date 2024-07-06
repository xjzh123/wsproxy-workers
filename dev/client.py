from threading import Thread
from time import sleep
import websocket

ws = websocket.create_connection('ws://localhost:8787/?ws://localhost:8765')

for i in range(7):
    sleep(1)
    ws.send(str(i))

ws.close()
