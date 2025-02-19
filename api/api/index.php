<?php

// Vercel only allows an app’s entry-point to live inside the api directory,
// so we have to set up a simple script to forward to Laravel’s normal.

// Forward Vercel requests to normal index.php
require __DIR__ . '/../public/index.php';