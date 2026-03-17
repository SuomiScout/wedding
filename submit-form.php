<?php
header('Content-Type: application/json; charset=utf-8');

// Настройки email
define('TO_EMAIL', 'jarompanen@gmail.com');
define('FROM_EMAIL', 'noreply@yuratanyawedding.ru');
define('SUBJECT', 'Новое сообщение с сайта');
define('HCAPTCHA_SECRET', 'ES_02b033a87aae41a28e81edc313db5b4b'); // Замените на ваш секретный ключ hCaptcha

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Проверка hCaptcha
    if (empty($_POST['h-captcha-response'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Пройдите проверку hCaptcha']);
        exit;
    }

    $captcha_response = $_POST['h-captcha-response'];
    $verify_url = 'https://hcaptcha.com/siteverify';
    $data = [
        'secret' => HCAPTCHA_SECRET,
        'response' => $captcha_response
    ];

    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($verify_url, false, $context);
    $result_data = json_decode($result, true);

    if (!$result_data['success']) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Ошибка проверки hCaptcha. Попробуйте ещё раз.']);
        exit;
    }

    // Получение и валидация данных формы
    $name = trim($_POST['name'] ?? '');
    $message = trim($_POST['message'] ?? '');
    
    if (empty($name) || empty($message)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Заполните все поля']);
        exit;
    }
    
    // Формируем тело письма
    $email_body = "Имя: $name\n\n";
    $email_body .= "Сообщение:\n$message\n";
    $email_body .= "\n---\nОтправлено с сайта: " . $_SERVER['HTTP_HOST'];
    
    // Заголовки письма
    $headers = "From: " . FROM_EMAIL . "\r\n";
    $headers .= "Reply-To: " . FROM_EMAIL . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // Дополнительный параметр для обработки возврата писем
    $additional_params = "-f" . FROM_EMAIL;
    
    // Отправка письма
    if (mail(TO_EMAIL, SUBJECT, $email_body, $headers, $additional_params)) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Подтверждение принято!'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Ошибка при отправке письма'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Неверный метод запроса']);
exit;