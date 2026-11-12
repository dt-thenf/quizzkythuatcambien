# Ngân hàng câu hỏi Kỹ thuật cảm biến

Nguồn dữ liệu: các câu hỏi người dùng cung cấp trong hội thoại ngày 12/11/2026. Thư mục này **không** tự động quét PDF để thêm câu hỏi chưa từng được hỏi.

## Cấu trúc

- `questions.json`: 210 câu hỏi, mã C001–C210; giữ tất cả biến thể số liệu và phương án từ hội thoại.
- `figures/*.png`: **14 hình được cắt trực tiếp từ ảnh câu hỏi gốc** do người dùng cung cấp, không phải hình vẽ lại. Có bản kê nguồn và tọa độ cắt tại `figures/SOURCES.md`.
- `screenshots/`: chứa **ảnh chụp gốc từ hội thoại** để đối chiếu form. Đã bổ sung ảnh chụp gốc cho câu ghép cặp, sơ đồ LDR, RTD, ký hiệu cảm biến, đường chuẩn và accelerometer tại các đường dẫn tương ứng. Đã khôi phục đủ ảnh gốc mà toàn bộ trường `screenshot` trong `questions.json` tham chiếu đến; các liên kết ảnh hiện có trong repo.

## Schema

Mỗi phần tử `questions` có:
- `id`: định danh không trùng nhau; `topic`: general, optical, thermal, electromagnetic, mechanical, smart, interface.
- `type`: `true_false`, `single_choice`, `numeric`, `fill_blank`, `matching`.
- `prompt`: nguyên văn câu hỏi (không gồm hậu tố hướng dẫn nhập liệu khi có `input_hint`).
- `answer`: boolean cho đúng/sai; chuỗi đúng chính xác với lựa chọn cho trắc nghiệm; số cho phép đo; chuỗi cho điền từ; mảng `{left,right}` cho ghép cặp.
- `options`: các đáp án lựa chọn theo thứ tự thấy trong đề gốc; dạng `matching` có danh sách các mô tả để chọn; `true_false` có True/False.
- `ui`: cách trình bày form: `radio`, `dropdown_per_row`, `numeric_input`, `text_input`.
- `figure` (nếu có): đường dẫn hình PNG được cắt trực tiếp từ ảnh gốc.
- `screenshot` (nếu có): đường dẫn tương đối của ảnh gốc PNG. Ảnh nào đã nằm trong `screenshots/` sẽ hiển thị trực tiếp từ repo.
- `form` (nếu có): các thuộc tính giao diện bổ sung để giữ nguyên form gốc (layout, loại control, placeholder, thứ tự tùy chọn, số câu, điểm). Khi render matching, mỗi nhãn `answer[].left` là một hàng có dropdown và một placeholder `[ Choose ]`.
- `source_question_number` (nếu có): số câu hiển thị trong screenshot.
- `duplicate_of` (nếu có): chỉ câu trùng nội dung nhưng có ảnh đề hoặc thứ tự lựa chọn khác.

`count` là số câu, hiện **210**. Thứ tự các câu trong mảng là thứ tự xuất hiện trong hội thoại, không phải thứ tự số Question trên website nguồn.

## Dùng cho web quiz

1. Fetch `/cauhoi_viet/questions.json` (nếu site phục vụ trực tiếp root repo) hoặc import file JSON khi build.
2. Hiển thị `prompt`; nếu `figure` tồn tại, hiển thị ảnh PNG ở đường dẫn `cauhoi_viet/` + giá trị `figure`. Ảnh đã được cắt riêng, không cần ảnh chụp toàn bộ form.
3. Render theo `type` và `ui`: radio cho single choice/true-false; ô nhập cho numeric/fill_blank; dropdown theo hàng cho matching.
4. Kiểm tra đáp án: so sánh chuỗi cho lựa chọn, boolean cho đúng/sai; numeric so sánh với dung sai được chọn riêng (không so sánh IEEE floating-point chính xác tuyệt đối); matching so sánh mọi cặp.
5. **Không gửi trường `answer` xuống client nếu cần bảo mật đáp án kiểm tra thật**. Nên tách sang backend hoặc API riêng. Với web ôn tập offline, có thể dùng trực tiếp JSON.

## Lưu ý bảo toàn nguồn

- Các hình minh họa trong `figures/` được **cắt từ ảnh chụp gốc**, đã bỏ phần đầu đề và form chọn đáp án. Phần biểu đồ, ký hiệu và sơ đồ mạch được giữ nguyên như ảnh gửi, không dựng lại.
- Một số câu hỏi nhập số không nêu số chữ số làm tròn: `answer` lưu giá trị tính toán đầy đủ, frontend tự chọn dung sai phù hợp.
- Đáp án là kết quả tổng hợp từ hội thoại và công thức, không được xem là đáp án chính thức của giảng viên.
- Có những screenshot chỉ cho thấy một phần dropdown hoặc một phần mạch. Những lựa chọn ghi trong JSON dựa vào các mục thấy rõ trong ảnh và câu trả lời trước đó.

## Kiểm tra dữ liệu

- Tất cả câu hỏi có mã duy nhất.
- Mọi câu `single_choice` có đáp án nằm trong `options`.
- Mọi cặp `matching` có mô tả nằm trong `options`.
- 47 true_false, 69 single_choice, 53 numeric, 23 fill_blank, 18 matching = 210.

## Bổ sung ảnh nguồn lên GitHub

Ảnh chụp gốc đã được đưa vào thư mục `cauhoi_viet/screenshots/`. Các câu mới thuộc ngân hàng này chỉ nên thêm khi có yêu cầu riêng. Ví dụ: `cauhoi_viet/screenshots/image(7).png`. Sau khi upload, các khóa `screenshot` trong JSON sẽ trỏ đến tệp tồn tại, không cần sửa dữ liệu.

## Mở rộng

Khi bổ sung câu mới, tạo `id` mới, giữ nguyên câu cũ; không xóa bản trùng nếu hai ảnh/form là hai phiên bản của đề.
## Dữ liệu tính toán, độ chính xác và trật tự đáp án (bổ sung 13/11/2026)

- `display_answer`: chuỗi kết quả định dạng đúng số chữ số thập phân theo câu hỏi (ví dụ `0.320`, `25.00`). `answer` vẫn là số để chấm với dung sai.
- `rounding_decimals`: số chữ số thập phân yêu cầu; không làm mất số 0 cuối nếu dùng `display_answer`.
- Trắc nghiệm và Đúng/Sai giữ nguyên thứ tự mảng `options` từ giao diện gốc. Với câu True/False có lựa chọn `Đúng`/`Sai`, trường `answer` boolean và `answer_label` chứa lựa chọn đúng để render theo tiếng Việt.
- Câu ghép cặp có `form.control = "select"`, `form.placeholder = "[ Choose ]"`, `form.pair_points` nếu có, và có thể có `form.source_options_raw` để giữ nguyên biểu diễn HTML thoát ký tự từ ảnh LMS.
- `screenshot` trỏ tới ảnh đầy đủ của câu gốc; `figure` trỏ tới phần hình minh họa được cắt từ ảnh, không bao gồm lựa chọn đáp án.
