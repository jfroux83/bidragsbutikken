<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <style>
        /* Base */
        body {
            background-color: #f8fafc;
            color: #2d3748;
            height: 100%;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            width: 100% !important;
        }

        .email-wrapper {
            background-color: #f8fafc;
            padding: 20px;
            font-family: Arial, sans-serif;
        }

        .email-content {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
            max-width: 600px;
            padding: 30px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo {
            max-width: 150px;
            height: auto;
        }

        .title {
            color: #1a202c;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }

        .credentials-box {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }

        .credentials-label {
            color: #4a5568;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .credentials-value {
            color: #2d3748;
            font-family: monospace;
            font-size: 16px;
            margin: 0;
        }

        .button {
            background-color: #4299e1;
            border-radius: 4px;
            color: #ffffff;
            display: inline-block;
            font-weight: bold;
            margin: 20px 0;
            padding: 12px 24px;
            text-decoration: none;
        }

        .requirements-box {
            background-color: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }

        .requirements-title {
            color: #2b6cb0;
            font-weight: bold;
            margin: 0 0 10px 0;
        }

        .requirement-list {
            color: #2c5282;
            margin: 0;
            padding-left: 20px;
        }

        .warning {
            color: #c53030;
            font-size: 14px;
            margin: 20px 0;
        }

        .footer {
            color: #718096;
            font-size: 12px;
            text-align: center;
            margin-top: 30px;
        }
    </style>
</head>
<body>
<div class="email-wrapper">
    <div class="email-content">
        <div class="header">
{{--            <img src="{{ asset('images/related-logo.webp') }}" alt="{{ $appName }}" class="logo">--}}
            <h1 class="title">Welcome to {{ $appName }}</h1>
        </div>

        <p>Hello {{ $user->name }},</p>

        <p>Your account has been created in {{ $appName }}. To ensure the security of your account, please set up your permanent password using the temporary credentials below.</p>

        <div class="credentials-box">
            <p class="credentials-label">Email:</p>
            <p class="credentials-value">{{ $user->email }}</p>

            <p class="credentials-label">Temporary Password:</p>
            <p class="credentials-value">{{ $temporaryPassword }}</p>
        </div>

        <a href="{{ $firstTimeLoginUrl }}" class="button">Set Up Your Password</a>

        <div class="requirements-box">
            <p class="requirements-title">Password Requirements:</p>
            <ul class="requirement-list">
                <li>Minimum 12 characters long</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character (!@#$%^&*()_-+=<>?)</li>
            </ul>
        </div>

        <p class="warning">
            Important: This setup link will expire on {{ $expiryTime }}. For security reasons,
            please change your password immediately upon first login.
        </p>

        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

        <p>Best regards,<br>{{ $appName }} Team</p>

        <div class="footer">
            <p>If you're having trouble clicking the "Set Up Your Password" button, copy and paste this URL into your web browser: {{ $firstTimeLoginUrl }}</p>
            <p>&copy; {{ $year }} {{ $appName }}. All rights reserved.</p>
        </div>
    </div>
</div>
</body>
</html>
