import phonenumbers
import subprocess
import time

def main():
    # Đọc file danh sách số điện thoại
    with open('danh_sach_dien_thoai.txt', 'r') as f:
        danh_sach_so = f.readlines()

    # Khởi tạo Phone Link
    subprocess.Popen(['start', 'ms-phone-link:', ''], shell=True)

    # Duyệt qua danh sách số và gọi điện
    for so_dien_thoai in danh_sach_so:
        # Xử lý số điện thoại
        so_chuan = phonenumbers.parse(so_dien_thoai.strip(), 'VN')
        so_dien_thoai_chuan = phonenumbers.format_number(so_chuan, phonenumbers.PhoneNumberFormat.E164)

        # Gọi điện thoại
        subprocess.Popen(['ms-phone-link', 'dial', so_dien_thoai_chuan], shell=True)
        #subprocess.Popen(['start', 'ms-phone-link:', 'tel:' + so_dien_thoai_chuan], shell=True)

       
        time.sleep(5)

if __name__ == '__main__':
    main()
