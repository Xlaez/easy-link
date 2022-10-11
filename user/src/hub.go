package src

import "encoding/json"

type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			clientId := client.ID
			for client := range h.clients {
				msg := []byte("some one join room (ID: " + clientId + ")")
				client.send <- msg
			}

			h.clients[client] = true

		case client := <-h.unregister:
			clientId := client.ID
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			for client := range h.clients {
				msg := []byte("some one leave room (ID:" + clientId + ")")
				client.send <- msg
			}
		case userMessage := <-h.broadcast:
			var data map[string][]byte
			json.Unmarshal(userMessage, &data)

			for client := range h.clients {
				//prevent self receive the message
				if client.ID == string(data["id"]) {
					continue
				}
				select {
				case client.send <- data["message"]:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
