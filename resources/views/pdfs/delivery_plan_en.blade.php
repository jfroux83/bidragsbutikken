<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivery Plan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            padding: 20px;
        }
        h1 {
            font-size: 20px;
            font-weight: bold;
        }
        .subtitle {
            font-size: 14px;
            margin: 5px 0 20px 0;
        }
        .customer-info, .total {
            margin-bottom: 20px;
        }
        .customer-info p {
            margin: 2px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table, th, td {
            border: 1px solid #ccc;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        .text-right {
            text-align: right;
        }
        .text-bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Delivery Plan | Scheduled Delivery in {{ $monthYear }}</h1>
    <p class="subtitle">
        On our website <a href="https://bidragsbutikken.no">bidragsbutikken.no</a>, you can make changes until you receive the invoice on {{ $cutOffDate }}.
    </p>
    <div class="customer-info">
        <p><strong>Customer:</strong></p>
        <p>{{ $customer['fullName'] }}</p>
        <p>{{ $customer['address'] }}</p>
        <p>{{ $customer['postalCode'] . ' ' . $customer['city'] }}</p>
    </div>
    <table>
        <thead>
        <tr>
            <th>Product name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>To pay</th>
            <th>Product supplier</th>
        </tr>
        </thead>
        <tbody>
        @foreach ($products as $product)
            <tr>
                <td>{{ $product['name'] }}</td>
                <td>kr {{ $product['price'] }}</td>
                <td>{{ $product['quantity'] }}</td>
                <td>kr {{ number_format($product['quantity'] * $product['price'], 2, ',', ' ') }}</td>
                <td>{{ $product['supplier'] }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <div class="total">
        <p class="text-right text-bold">Total to pay: kr {{ number_format($total, 2, ',', ' ') }}</p>
    </div>
</div>
</body>
</html>
