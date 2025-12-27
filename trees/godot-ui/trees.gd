extends Node2D

@onready var point: Sprite2D = $Point
var socket := WebSocketPeer.new()

func _ready():
	print("Connecting to server...")
	socket.connect_to_url("ws://localhost:8080")

func _process(_delta):
	socket.poll()

	while socket.get_available_packet_count() > 0:
		var msg := socket.get_packet().get_string_from_utf8()
		handle_message(msg)

func _unhandled_input(event):
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MouseButton.MOUSE_BUTTON_LEFT:
			send_move_request()

func send_move_request():
	var pos = get_global_mouse_position()

	var msg = {
		"type": "move",
		"x": pos.x,
		"y": pos.y
	}

	socket.send_text(JSON.stringify(msg))

func handle_message(msg: String):
	print("Received:", msg)

	var data = JSON.parse_string(msg)
	if data == null:
		return

	if data.type == "state":
		point.global_position = Vector2(data.x, data.y)
