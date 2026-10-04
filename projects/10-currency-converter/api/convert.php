<?php
header('Content-Type: application/json');

$from = strtoupper($_GET['from'] ?? 'USD');
$to = strtoupper($_GET['to'] ?? 'CAD');
$amount = isset($_GET['amount']) ? filter_var($_GET['amount'], FILTER_VALIDATE_FLOAT) : null;

if ($amount === null || $amount === false || $amount < 0) {
    http_response_code(400);
    echo json_encode(['error' => 'amount must be a non-negative number']);
    exit;
}

$url = 'https://open.er-api.com/v6/latest/' . urlencode($from);
$context = stream_context_create(['http' => ['timeout' => 8]]);
$response = @file_get_contents($url, false, $context);

if ($response === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Upstream exchange rate service failed']);
    exit;
}

$data = json_decode($response, true);

if (($data['result'] ?? null) !== 'success' || !isset($data['rates'][$to])) {
    http_response_code(400);
    echo json_encode(['error' => "Unsupported currency pair {$from}/{$to}"]);
    exit;
}

$rate = $data['rates'][$to];
$result = round($amount * $rate, 4);

echo json_encode([
    'from' => $from,
    'to' => $to,
    'amount' => $amount,
    'rate' => $rate,
    'result' => $result,
    'updatedAt' => $data['time_last_update_utc'] ?? null,
]);
