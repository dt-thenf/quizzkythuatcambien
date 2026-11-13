# Ngân hàng câu hỏi cauhoi_thong

Đây là **ngân hàng đề mới, độc lập**, đã có **14 câu hỏi**. Tất cả câu hỏi được gửi sau khi thư mục này được tạo sẽ được thêm vào đây nếu chưa trùng **trong chính ngân hàng này**.

## Cấu trúc

- `questions.json`: dữ liệu câu hỏi và đáp án; hiện có 14 câu `C001–C014`.
- `figures/`: ảnh chỉ chứa phần sơ đồ, biểu đồ hoặc hình minh họa **cắt trực tiếp từ ảnh người dùng gửi**, không dựng lại.
- `screenshots/`: ảnh chụp đầy đủ câu hỏi, gồm nội dung, các đáp án và form để đối chiếu.
- `figures/README.md`, `screenshots/README.md`: thông tin thư mục ảnh riêng của ngân hàng này.

## Định dạng dữ liệu

Mỗi phần tử `questions` có `id` (bắt đầu `C001`), `topic`, `type`, `prompt`, `answer` và thuộc tính theo từng loại:

- `single_choice`: `options` theo đúng thứ tự đề, `answer` là một lựa chọn, `ui: "radio"`.
- `true_false`: `options` giữ nguyên ngôn ngữ/thứ tự gốc (`True/False` hoặc `Đúng/Sai`), `answer` là boolean; dùng `answer_label` khi thích hợp.
- `numeric`: `answer` là số, `unit`, `input_hint`; dùng `display_answer`, `rounding_decimals` khi đề yêu cầu định dạng làm tròn.
- `fill_blank`: `answer` là văn bản cần điền, `ui: "text_input"`.
- `matching`: `answer` là các cặp `{left,right}`, `options` là các mô tả theo đúng thứ tự dropdown, `ui: "dropdown_per_row"`; thêm `form` để giữ placeholder, điểm và cấu hình form.

`figure` và `screenshot` (nếu có) là đường dẫn **tương đối so với thư mục này**, ví dụ `figures/so-do-01.png`, `screenshots/cau-01.png`. Các ảnh phải tồn tại trong thư mục tương ứng.

## Quy trình bổ sung

1. Giữ nguyên câu chữ, phương án, kiểu câu hỏi, thứ tự lựa chọn và yêu cầu định dạng như đề gốc.
2. Kiểm tra trùng **chỉ trong `questions.json` tại đây**. Không thêm lại một câu giống hệt; nếu có biến thể dữ liệu thì lưu thành câu mới.
3. Với câu có hình, giữ ảnh chụp đầy đủ ở `screenshots/` và cắt đúng vùng hình minh họa vào `figures/`. Nếu ảnh mới tốt hơn cho cùng một sơ đồ, có thể cập nhật hình dùng chung.
4. Mỗi câu nhận mã `C001`, `C002`, … theo thứ tự thêm; cập nhật `count` khớp số phần tử.
5. Kiểm tra `answer` thuộc `options` khi chọn một; các cặp ghép thuộc `options`; và mọi đường dẫn ảnh có tệp tương ứng.

Để làm web quiz, đọc riêng `cauhoi_thong/questions.json`. Với đề kiểm tra thật, không gửi trường `answer` trực tiếp tới client; cần chấm ở phía máy chủ.

## Đợt 1 — 14 câu hỏi (13/11/2026)

- Đã bổ sung 14 câu `C001–C014`, gồm 13 câu chọn một và 1 câu Đúng/Sai.
- Hai câu `C001`, `C002` có ảnh đề toàn bộ trong `screenshots/` và hình bảng thông số cắt riêng trong `figures/`.
- `figure_table` (nếu có) lưu tiêu đề cột và từng hàng bảng để web có thể render bảng có cấu trúc, bên cạnh hình ảnh gốc.
- `form.layout = "vertical"`, `form.control = "radio"`, `form.option_order = "preserve"` ghi nhận form trắc nghiệm với thứ tự phương án đúng ảnh nguồn. Các lựa chọn trống trên đề gốc được lưu đúng nguyên văn.
