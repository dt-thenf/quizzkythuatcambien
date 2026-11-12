# Ngân hàng câu hỏi Kỹ thuật cảm biến

Nguồn dữ liệu: các câu hỏi người dùng cung cấp trong hội thoại ngày 12/11/2026. Thư mục này **không** tự động quét PDF để thêm câu hỏi chưa từng được hỏi.

## Cấu trúc

- `questions.json`: 74 câu hỏi, mã C001–C074; giữ tất cả biến thể số liệu và phương án từ hội thoại.
- `figures/*.svg`: hình kỹ thuật **vẽ lại** để có thể hiển thị trực tiếp trên web, không phải bản gốc PNG.
- `screenshots/`: đường dẫn dành riêng cho **ảnh chụp gốc từ hội thoại**; hiện tệp PNG chưa được đẩy lên GitHub vì kết nối GitHub tại phiên này chỉ nhận nội dung văn bản qua API. Ảnh PNG gốc được cung cấp trong tệp ZIP đính kèm cùng câu trả lời để có thể đưa vào đúng đường dẫn.

## Schema

Mỗi phần tử `questions` có:
- `id`: định danh không trùng nhau; `topic`: general, optical, thermal, electromagnetic, mechanical, smart, interface.
- `type`: `true_false`, `single_choice`, `numeric`, `fill_blank`, `matching`.
- `prompt`: nguyên văn câu hỏi (không gồm hậu tố hướng dẫn nhập liệu khi có `input_hint`).
- `answer`: boolean cho đúng/sai; chuỗi đúng chính xác với lựa chọn cho trắc nghiệm; số cho phép đo; chuỗi cho điền từ; mảng `{left,right}` cho ghép cặp.
- `options`: các đáp án lựa chọn theo thứ tự thấy trong đề gốc; dạng `matching` có danh sách các mô tả để chọn; `true_false` có True/False.
- `ui`: cách trình bày form: `radio`, `dropdown_per_row`, `numeric_input`, `text_input`.
- `figure` (nếu có): đường dẫn hình kỹ thuật SVG vẽ lại.
- `screenshot` (nếu có): đường dẫn tương đối của ảnh gốc PNG trong gói bổ sung.
- `source_question_number` (nếu có): số câu hiển thị trong screenshot.
- `duplicate_of` (nếu có): chỉ câu trùng nội dung nhưng có ảnh đề hoặc thứ tự lựa chọn khác.

`count` là số câu, hiện **74**. Thứ tự các câu trong mảng là thứ tự xuất hiện trong hội thoại, không phải thứ tự số Question trên website nguồn.

## Dùng cho web quiz

1. Fetch `/cau%20hoi/questions.json` (nếu site phục vụ trực tiếp root repo) hoặc import file JSON khi build.
2. Hiển thị `prompt`; nếu `figure` tồn tại, hiển thị SVG trong `cau hoi/` cùng thư mục. Khi thư mục `screenshots` đã nhận được ảnh, có thể hiển thị bản gốc thay cho hình vẽ lại.
3. Render theo `type` và `ui`: radio cho single choice/true-false; ô nhập cho numeric/fill_blank; dropdown theo hàng cho matching.
4. Kiểm tra đáp án: so sánh chuỗi cho lựa chọn, boolean cho đúng/sai; numeric so sánh với dung sai được chọn riêng (không so sánh IEEE floating-point chính xác tuyệt đối); matching so sánh mọi cặp.
5. **Không gửi trường `answer` xuống client nếu cần bảo mật đáp án kiểm tra thật**. Nên tách sang backend hoặc API riêng. Với web ôn tập offline, có thể dùng trực tiếp JSON.

## Lưu ý bảo toàn nguồn

- Ảnh chụp gốc chứa thêm khung giao diện và đôi khi đồ thị; các hình SVG chỉ mô phỏng phần cốt lõi để web hiển thị được, **không khẳng định là bản chép 1:1**.
- Một số câu hỏi nhập số không nêu số chữ số làm tròn: `answer` lưu giá trị tính toán đầy đủ, frontend tự chọn dung sai phù hợp.
- Đáp án là kết quả tổng hợp từ hội thoại và công thức, không được xem là đáp án chính thức của giảng viên.
- Có những screenshot chỉ cho thấy một phần dropdown hoặc một phần mạch. Những lựa chọn ghi trong JSON dựa vào các mục thấy rõ trong ảnh và câu trả lời trước đó.

## Kiểm tra dữ liệu

- Tất cả câu hỏi có mã duy nhất.
- Mọi câu `single_choice` có đáp án nằm trong `options`.
- Mọi cặp `matching` có mô tả nằm trong `options`.
- 17 true_false, 26 single_choice, 16 numeric, 7 fill_blank, 8 matching = 74.

## Bổ sung ảnh nguồn lên GitHub

Giải nén gói PNG đính kèm vào đúng thư mục `cau hoi/screenshots/` và commit. Ví dụ: `cau hoi/screenshots/image(7).png`. Sau khi upload, các khóa `screenshot` trong JSON sẽ trỏ đến tệp tồn tại, không cần sửa dữ liệu.

## Mở rộng

Khi bổ sung câu mới, tạo `id` mới, giữ nguyên câu cũ; không xóa bản trùng nếu hai ảnh/form là hai phiên bản của đề.