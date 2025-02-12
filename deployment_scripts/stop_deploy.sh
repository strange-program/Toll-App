#!/bin/bash

# Function to kill only node processes listening on a specific port
kill_node_process_by_port() {
  PORT=$1
  PIDS=$(lsof -t -i :$PORT -sTCP:LISTEN -c node)

  if [ -n "$PIDS" ]; then
    echo "Killing node processes listening on port $PORT..."
    kill -9 $PIDS
  else
    echo "No node processes found listening on port $PORT"
  fi
}

# Stop node processes running on specific ports
kill_node_process_by_port 3000  # Example port 3000 (Frontend/Backend)
kill_node_process_by_port 9115  # Example port 9115
