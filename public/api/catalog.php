<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$catalogFile = dirname(__DIR__) . '/catalog.json';
$passcode = 'jworld2026';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($catalogFile)) {
        file_put_contents($catalogFile, '[]');
    }
    readfile($catalogFile);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body) || ($body['passcode'] ?? '') !== $passcode) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit;
    }

    $products = $body['products'] ?? null;
    if (!is_array($products)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid products array']);
        exit;
    }

    $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($catalogFile, $json) === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to write catalog.json']);
        exit;
    }

    echo json_encode(['success' => true, 'count' => count($products)]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
