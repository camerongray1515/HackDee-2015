#!/bin/bash

gunicorn -k flask_sockets.worker socket_server:app
