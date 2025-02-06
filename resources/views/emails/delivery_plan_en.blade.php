<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivery Plan Notification</title>
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
        .body-message {
            margin-bottom: 20px;
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
        .contact-info {
            margin-top: 10px;
            font-size: 0.9em;
            color: #555;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Delivery Plan Notification</h1>
    </div>
    <div class="content">
        <div class="body-message">
            <p>Hi {{ $name }},</p>
            <p>Attached you will find an overview of what is planned for delivery at the beginning of next month.</p>
            <p>We greatly appreciate that you have chosen to support {{ $organization }}.</p>
            <p>By moving some of your shopping to bidragsbutikken.no, you are contributing to the important work done by {{ $organization }}.</p>
            <p>One of the goals of bidragsbutikken.no is to have competitive prices on common consumer goods, and that way you can give your contribution without having to increase your monthly costs.</p>
            <p>Thank you very much for being part of the team.</p>
            <p>If you have any questions, please feel free to get in touch.</p>
        </div>

        <hr>

        <div class="footer">
            <p>Kind regards,</p>
            <p><strong>Administrator Bidragsbutikken</strong></p>
            <p class="contact-info">
                Telephone: 40410206<br>
                Email: <a href="mailto:admin@bidragsbutikken.no">admin@bidragsbutikken.no</a>
            </p>
        </div>
    </div>
</div>
</body>
</html>
