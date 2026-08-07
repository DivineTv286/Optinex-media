<?php
header('Content-Type: application/json');

// Put your Paystack Secret Key here
$paystackSecretKey = "";

$action = $_GET['action'] ?? '';

// 1. Fetch Nigerian Banks
if ($action === 'get_banks') {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.paystack.co/bank?country=nigeria");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $paystackSecretKey,
        "Cache-Control: no-cache"
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    echo $response;
    exit();
}

// 2. Verify Account Details
if ($action === 'resolve_account') {
    $accountNumber = $_GET['account_number'] ?? '';
    $bankCode = $_GET['bank_code'] ?? '';

    if (strlen($accountNumber) !== 10 || empty($bankCode)) {
        echo json_encode(["status" => false, "message" => "Invalid parameters"]);
        exit();
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.paystack.co/bank/resolve?account_number=" . urlencode($accountNumber) . "&bank_code=" . urlencode($bankCode));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $paystackSecretKey,
        "Cache-Control: no-cache"
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    echo $response;
    exit();
}

echo json_encode(["status" => false, "message" => "Invalid action"]);
?>
