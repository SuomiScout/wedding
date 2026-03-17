
document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('input[type="submit"]');
        const messagesDiv = document.getElementById('formMessages');
        
        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.value = 'Отправка...';
        messagesDiv.style.display = 'none';
        
        // Отправка данных
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
            // Успешная отправка
            showMessage('Сообщение успешно отправлено!', 'success');
            form.reset(); // Очищаем форму
            } else {
            // Ошибка
            throw new Error(data.message || 'Ошибка отправки');
            }
        })
        .catch(error => {
            showMessage(error.message, 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.value = 'Отправить сообщение';
        });
        
        function showMessage(text, type) {
            messagesDiv.textContent = text;
            messagesDiv.style.display = 'block';
            messagesDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
            messagesDiv.style.color = type === 'success' ? '#155724' : '#721c24';
            messagesDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
            
            // Автоматическое скрытие через 5 секунд
            setTimeout(() => {
            messagesDiv.style.display = 'none';
            }, 5000);
        }
        })
