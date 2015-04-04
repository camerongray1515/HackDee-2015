#!/bin/bash

gunicorn -k flask_sockets.worker main:app
