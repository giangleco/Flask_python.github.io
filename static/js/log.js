document.addEventListener('DOMContentLoaded', () => {
    // Xử lý hiển thị mật khẩu cho form đăng nhập
    const showPasswordLogin = document.getElementById('show-password-login');
    const passwordInputLogin = document.getElementById('password-login');

    if (showPasswordLogin && passwordInputLogin) {
        showPasswordLogin.addEventListener('change', () => {
            passwordInputLogin.type = showPasswordLogin.checked ? 'text' : 'password';
        });
    }

    // Xử lý hiển thị mật khẩu cho form đăng ký
    const showPasswordLogup = document.getElementById('show-password-logup');
    const passwordInputLogup = document.getElementById('password-logup');
    const confirmPasswordInputLogup = document.getElementById('confirm-password-logup');

    if (showPasswordLogup && passwordInputLogup && confirmPasswordInputLogup) {
        showPasswordLogup.addEventListener('change', () => {
            passwordInputLogup.type = showPasswordLogup.checked ? 'text' : 'password';
            confirmPasswordInputLogup.type = showPasswordLogup.checked ? 'text' : 'password';
        });
    }
});

$(document).ready(function () {
    // Xử lý chuyển hướng sang đăng ký
    $('#signup-btn').click(function (event) {
        event.preventDefault();
        window.location.href = "/signup";
    });

    // Xử lý chuyển hướng đến đăng nhập
    $('#dangnhap').click(function (event) {
        event.preventDefault();
        window.location.href = "/";
    });

    // Xử lý đăng nhập
    $('#login-btn').click(function (event) {
        event.preventDefault();
        const identifier = $('#email-login').val().trim();
        const password = $('#password-login').val().trim();

        // Kiểm tra trường rỗng
        if (!identifier || !password) {
            $('#error-msg').text('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        // Kiểm tra định dạng mật khẩu
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;
        if (!passwordRegex.test(password)) {
            $('#error-msg')
                .text('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&).')
                .show();
            alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&).');
            return;
        }

        $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ identifier, password }),
            success: function (response) {
                if (response.success) {
                    window.location.href = "/dashboard";
                } else {
                    $('#error-msg').text(response.message || 'Đăng nhập thất bại.');
                }
            },
            error: function () {
                $('#error-msg').text('Có lỗi xảy ra khi kết nối đến máy chủ.');
            }
        });
    });

    // Xử lý đăng ký
    $('#signup-form').submit(function (event) {
        event.preventDefault();
        const phone = $('#phone-logup').val().trim();
        const email = $('#email-logup').val().trim();
        const password = $('#password-logup').val().trim();
        const confirmPassword = $('#confirm-password-logup').val().trim();

        // Kiểm tra dữ liệu nhập vào
        if (!phone || !email || !password || !confirmPassword) {
            $('#signup-error-msg').text('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        if (password !== confirmPassword) {
            $('#signup-error-msg').text('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#signup-error-msg').text('Email không hợp lệ.').show();
            alert('Email không hợp lệ.');
            return;
        }

        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            $('#signup-error-msg').text('Số điện thoại phải có 10 chữ số.').show();
            alert('Số điện thoại phải có 10 chữ số.');
            return;
        }

        // Kiểm tra định dạng mật khẩu
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/;
        if (!passwordRegex.test(password)) {
            $('#signup-error-msg')
                .text('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&).')
                .show();
            alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&).');
            return;
        }

        $.ajax({
            url: '/logup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ phone, email, password }),
            success: function (response) {
                if (response.success) {
                    window.location.href = "/";
                    alert("Đăng ký thành công!");
                } else {
                    $('#signup-error-msg').text(response.message || 'Đăng ký thất bại.');
                    alert("Tài khoản của bạn đã được sử dụng!");
                }
            },
            error: function () {
                $('#signup-error-msg').text('Có lỗi xảy ra khi kết nối đến máy chủ.');
            }
        });
    });
});