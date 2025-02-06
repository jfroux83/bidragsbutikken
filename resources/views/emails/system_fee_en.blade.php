<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Fee Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .table th, .table td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .table th {
            background-color: #f4f4f4;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #555;
        }
        .call-to-action {
            background-color: #007bff;
            color: #fff;
            padding: 10px 15px;
            text-align: center;
            border-radius: 3px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>System Fee Notification</h1>
        </div>
        <div class="content">
            <p>Hi {{ $name }},</p>
            <p>It is time to pay the system fee in connection with your use of the system Bonusbutikken.</p>
            <p>The fee is <strong>{{ $systemFeePercentage }}%</strong> of the turnover from your customers in the previous month.</p>
            <p>Total to pay: <strong>kr {{ $systemFee }}</strong> to {{ $paymentMethod }} number <strong>91919191</strong>.</p>

            <p><a href="{{ $paymentLink }}" class="call-to-action">Payment Link</a></p>

            <p>The following list shows an overview of which customers have shopped and which turnover forms the basis for the system fee:</p>

            <table class="table">
                <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Last Month's Trade</th>
                    <th>System Fee %</th>
                    <th>System Fee</th>
                </tr>
                </thead>
                <tbody>
                @foreach ($customers as $customer)
                    <tr>
                        <td>{{ $customer['name'] }}</td>
                        <td>kr {{ number_format($customer['last_month_trade'], 2, ',', '.') }}</td>
                        <td>{{ $customer['fee_percentage'] }}</td>
                        <td>kr {{ number_format($customer['fee'], 2, ',', '.') }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            <div class="footer">
                <p>Kind regards,</p>
                {{-- TODO: pass in as variable (systems_owner) --}}
                <p><strong>Systemansvarlig Bidragsbutikken</strong></p>
                {{-- TODO: pass in as variable (systems_owner) --}}
                <p>Telephone: +47 977 06 400</p>
                {{-- TODO: pass in as variable (systems_owner) --}}
                <p>Email: <a href="mailto:post@bidragsbutikken.no" class="call-to-action">post@bidragsbutikken.no</a></p>
            </div>
        </div>
    </div>
</body>
</html>
