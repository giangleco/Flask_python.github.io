from flask import Flask, url_for, render_template, request, jsonify
import mysql.connector
app = Flask(__name__)

def get_db_connection():
    try:
        return mysql.connector.connect(
            host="127.0.0.1",
            user="gianghoang",
            password="Hoang14205",
            database="dangnhapdangky"
        )
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        raise
#Trang chủ(trang đăng nhập)
@app.route('/')
def home():
    return render_template('login.html')
#Trang đăng ký
@app.route('/signup')
def logup_page():
    return render_template('logup.html')

#Lấy dữ liệu từ bảng
def __get_user_row(identifier: str) -> dict:
    connect = get_db_connection()
    cursor = connect.cursor(dictionary=True)
    query = "SELECT * from User where email=%s OR phone=%s"
    cursor.execute(query, (identifier, identifier))
    result = cursor.fetchone()
    
    cursor.close()
    connect.close()
    print(f"Query: {query}, Identifier: {identifier}, Result: {result}")
    return result

#xử lý dữ liệu đã được lấy ra để đăng nhập 
@app.route('/login', methods=['POST'])
def login():
    identifier = request.json.get('identifier')
    password = request.json.get('password')
    user = __get_user_row(identifier)
    if user and user['password'] == password:
        return jsonify({'success': True, 'message': 'Đăng nhập thành công!'})
    return jsonify({'success': False, 'message': 'Sai email/số điện thoại hoặc mật khẩu.'})
@app.route('/logup', methods=['POST'])
def logup():
    phone=request.json.get('phone')
    email=request.json.get('email')
    password=request.json.get('password')
    # Kiểm tra dữ liệu
    if not phone or not email or not password:
        return jsonify({'success': False, 'message': 'Vui lòng nhập đầy đủ thông tin.'})

    # Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
    connect = get_db_connection()
    cursor=connect.cursor(dictionary=True)
    query="SELECT phone,email FROM User WHERE phone=%s OR email=%s"
    cursor.execute(query, (phone, email))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.fetchall()  # Đọc hết kết quả còn lại (nếu có)
        cursor.close()
        connect.close()
        return jsonify({'success': False, 'message': 'Email hoặc số điện thoại đã được sử dụng.'})
    #Lưu thông tin người dùng
    query="INSERT INTO User(phone,email,password) VALUES (%s, %s, %s)"
    cursor.execute(query, (phone, email, password))
    connect.commit()
    cursor.close()
    connect.close()
    return jsonify({'success': True, 'message': 'Đăng ký thành công! Vui lòng đăng nhập.'})
@app.route('/dashboard')
def dashboard():
    return "Chào mừng!"

if __name__ == "__main__":
    app.run(debug=True)