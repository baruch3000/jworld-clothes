<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$statsFile = dirname(__DIR__) . '/click-stats.json';
$passcode = 'jworld2026';

function loadStats(string $file): array
{
    if (!file_exists($file)) {
        return ['products' => []];
    }

    $raw = file_get_contents($file);
    $data = json_decode($raw, true);

    if (!is_array($data) || !isset($data['products']) || !is_array($data['products'])) {
        return ['products' => []];
    }

    return $data;
}

function saveStats(string $file, array $stats): bool
{
    $json = json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($file, $json, LOCK_EX) !== false;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

$action = $body['action'] ?? '';

if ($action === 'track') {
    $productId = trim((string) ($body['productId'] ?? ''));
    if ($productId === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing productId']);
        exit;
    }

    $stats = loadStats($statsFile);
    if (!isset($stats['products'][$productId]) || !is_array($stats['products'][$productId])) {
        $stats['products'][$productId] = ['clicks' => 0, 'lastClickAt' => null];
    }

    $stats['products'][$productId]['clicks'] = (int) ($stats['products'][$productId]['clicks'] ?? 0) + 1;
    $stats['products'][$productId]['lastClickAt'] = date('c');

    if (!saveStats($statsFile, $stats)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save click stats']);
        exit;
    }

    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'get') {
    if (($body['passcode'] ?? '') !== $passcode) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Unauthorized']);
        exit;
    }

    echo json_encode(['success' => true, 'stats' => loadStats($statsFile)]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unknown action']);
